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
  Progress,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { MdCloudUpload } from 'react-icons/md';

function UploadModal(props: { setApiKey: any; sidebar?: boolean }) {
  const { setApiKey, sidebar } = props;
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
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

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

  const handleSaveFiles = () => {
    setIsUploading(true);
    setProgress(0);

    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
          clearInterval(timer);
          setIsUploading(false);
          setIsCompleted(true);
          return 100;
        }
        return oldProgress + 10;
      });
    }, 500);
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
          <Icon w="18px" h="18px" as={MdCloudUpload} color={navbarIcon} />
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
                <Progress mt={5} width='auto' value={progress} size="md" colorScheme="purple" />
              ) : isCompleted ? (
                <Text mt={5} fontSize="xl" color="teal.300">
                  Votre demande est en cours de traitement.
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
                  >
                    Save Files
                  </Button>
                </>
              )}
            </ModalBody>
          </Card>
        </ModalContent>
      </Modal>
    </>
  );
}

export default UploadModal;
