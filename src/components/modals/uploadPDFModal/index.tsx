import Card from '@/components/card/Card';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Button,
  Flex,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { MdCloudUpload } from 'react-icons/md';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { useAppSelector } from '@/hooks';
import { RootState } from '@/store'; 
import { db } from '@/firebase';
import { setProjects, setActiveProject } from '@/store/projectSlice';

function UploadPDFModal(props: { setApiKey: any; sidebar?: boolean; handleFileUpload: () => void }) { 
  const dispatch = useDispatch();
  const project = useSelector((state: RootState) => state.projects.activeProject);
  const { user } = useAppSelector((state) => state.user);
  const { setApiKey, sidebar, handleFileUpload } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [inputCode, setInputCode] = useState<string>('');

  const textColor = useColorModeValue('navy.700', 'white');
  const grayColor = useColorModeValue('gray.500', 'gray.500');
  const inputBorder = useColorModeValue('gray.200', 'whiteAlpha.200');
  const inputColor = useColorModeValue('navy.700', 'white');
  const link = useColorModeValue('brand.500', 'white');
  const navbarIcon = useColorModeValue('gray.500', 'white');
  const toast = useToast();

  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [message, setMessage] = useState('');

  const messages = [
    "Uploading your file, please wait...",
    "Processing data, please be patient...",
    "Almost done, hang tight..."
  ];
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  const fetchProjects = async () => {
    if (user && user.uid) {
      const projectsSnapshot = await db.collection('projects')
        .where('users', 'array-contains', user.uid)
        .get();
      const projectsData = projectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log("projectsData", projectsData);
      dispatch(setProjects(projectsData));

      // Mettre à jour le projet actif dans le state Redux
      const activeProject = projectsData.find(proj => proj.id === project.id);
      if (activeProject) {
        dispatch(setActiveProject(activeProject));
      }
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isUploading) {
      interval = setInterval(() => {
        setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
      }, 10000); // Changement d'intervalle à 10 secondes
    }
    return () => clearInterval(interval);
  }, [isUploading]);

  useEffect(() => {
    if (isCompleted) {
      const timer = setTimeout(() => {
        setMessage('');
        setIsUploading(false);
        setIsCompleted(false);
        setFiles([]);
        fetchProjects();
        onClose();
      }, 10000); // Garder la modal ouverte pour 10 secondes supplémentaires
      return () => clearTimeout(timer);
    }
  }, [isCompleted, onClose]);

  

  const onDrop = (acceptedFiles: File[]) => {
    const pdfFiles = acceptedFiles.filter(file => file.type === 'application/pdf');
    setFiles((prevFiles) => [...prevFiles, ...pdfFiles]);
    if (pdfFiles.length !== acceptedFiles.length) {
      toast({
        title: 'Only PDF files are allowed!',
        status: 'error',
        isClosable: true,
      });
    }
  };

  const handleRemoveFile = (fileName: string) => {
    setFiles(files.filter(file => file.name !== fileName));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'application/pdf'
  });

  const handleChange = (Event: any) => {
    setInputCode(Event.target.value);
  };

  const handleApiKeyChange = (value: string) => {
    setApiKey(value);
    localStorage.setItem('apiKey', value);
  };

  const handleSaveFiles = async () => {
    if (!project) {
      toast({
        title: 'No project selected!',
        status: 'error',
        isClosable: true,
      });
      return;
    }

    setIsUploading(true);
    setCurrentMessageIndex(0);
    setMessage('');

    const formData = new FormData();
    files.forEach(file => {
      formData.append('file', file);
    });
    formData.append('project_id', project.id); // Ajoutez l'ID du projet

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_AGENT_AI_EXTRACT_DOCUMENT}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      console.log('Server Response:', response.data);
      setMessage('File uploaded successfully!');
      setIsCompleted(true);
    } catch (error) {
      console.error('Error sending file:', error);
      setMessage('Failed to upload file.');
      setIsCompleted(true);
    }
  };

  return (
    <>
      {sidebar ? (
        <Button
          onClick={onOpen}
          display="flex"
          variant="api"
          fontSize={'sm'}
          fontWeight="600"
          borderRadius={'45px'}
          mt="8px"
          minH="40px"
        >
          Set API Key
        </Button>
      ) : (
        <Button
          onClick={onOpen}
          minW="max-content !important"
          p="0px"
          me="10px"
          _hover={{ bg: 'none' }}
          _focus={{ bg: 'none' }}
          _selected={{ bg: 'none' }}
          bg="none !important"
        >
          <Icon w="33px" h="33px" as={MdCloudUpload} color={navbarIcon} />
        </Button>
      )}

      <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose} size={'xl'}>
        <ModalOverlay />
        <ModalContent bg="none" boxShadow="none">
          <Card textAlign={'center'}>
            <ModalHeader
              fontSize="22px"
              fontWeight={'700'}
              mx="auto"
              textAlign={'center'}
              color={textColor}
            >
              Upload PDF Files
            </ModalHeader>
            <ModalCloseButton _focus={{ boxShadow: 'none' }} />
            <ModalBody p="0px">
              {isUploading ? (
                <Text mt={5} fontSize="xl" color="blue.500">
                  {messages[currentMessageIndex]}
                </Text>
              ) : isCompleted ? (
                <Text mt={5} fontSize="xl" color={message.includes('successfully') ? "green.500" : "red.500"}>
                  {message}
                </Text>
              ) : (
                <>
                  <Text
                    color={grayColor}
                    fontWeight="500"
                    fontSize="md"
                    lineHeight="28px"
                    mb="22px"
                  >
                    You need an OpenAI API Key to use YouAreLucky AI Copilot Template's
                    features. Your API Key is stored locally on your browser and
                    never sent anywhere else.
                  </Text>
                  <div {...getRootProps()} style={{
                    border: '2px dashed gray',
                    borderRadius: '20px',
                    padding: '20px',
                    textAlign: 'center',
                    cursor: 'pointer'
                  }}>
                    <input {...getInputProps()} />
                    {isDragActive ? (
                      <Text color={textColor} fontWeight="500" fontSize="md" lineHeight="28px">
                        Drop the files here ...
                      </Text>
                    ) : (
                      <Text color={textColor} fontWeight="500" fontSize="md" lineHeight="28px">
                        Drag 'n' drop some files here, or click to select files
                      </Text>
                    )}
                  </div>
                  <Box mt="20px">
                    {files.map((file, index) => (
                      <Flex key={index} justifyContent="space-between" alignItems="center">
                        <Text color={textColor} fontWeight="500" fontSize="md" lineHeight="28px">
                          {file.name}
                        </Text>
                        <Button
                          ml="10px"
                          size="sm"
                          onClick={() => handleRemoveFile(file.name)}
                        >
                          x
                        </Button>
                      </Flex>
                    ))}
                  </Box>
                  <Button
                    variant="chakraLinear"
                    mt="20px"
                    py="20px"
                    px="16px"
                    fontSize="sm"
                    borderRadius="45px"
                    ms="auto"
                    mb={{ base: '20px', md: '0px' }}
                    w={{ base: '300px', md: '180px' }}
                    h="54px"
                    onClick={handleSaveFiles}
                    isDisabled={files.length === 0}
                  >
                    Save Files
                  </Button>
                  {message && <Text mt={5} fontSize="md" color="red.500">{message}</Text>}
                </>
              )}
            </ModalBody>
          </Card>
        </ModalContent>
      </Modal>
    </>
  );
}

export default UploadPDFModal;
