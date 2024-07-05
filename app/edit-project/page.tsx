'use client';
/*eslint-disable*/
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store'; 
import Card from '@/components/card/Card';
import {
  Button,
  Flex,
  FormLabel,
  Input,
  Textarea,
  useColorModeValue,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
} from '@chakra-ui/react';
import TagsField from '@/components/fields/TagsField';
import { setActiveProject } from '@/store/projectSlice';
import { db } from '@/firebase';

export default function EditProject() {
  const dispatch = useDispatch();
  const project = useSelector((state: RootState) => state.projects.activeProject);
  const [context, setContext] = useState(project ? project.context : {});
  const textColor = useColorModeValue('navy.700', 'white');
  const placeholderColor = useColorModeValue(
    { color: 'gray.500' },
    { color: 'whiteAlpha.600' },
  );
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');

  useEffect(() => {
    if (!project) {
      const storedProject = localStorage.getItem('activeProject');
      if (storedProject) {
        const parsedProject = JSON.parse(storedProject);
        dispatch(setActiveProject(parsedProject));
        setContext(parsedProject.context || {});
      }
    } else {
      setContext(project.context || {});
    }
  }, [project, dispatch]);

  const handleContextChange = (key, value) => {
    setContext((prevContext) => ({
      ...prevContext,
      [key]: value,
    }));
  };

  const handleSaveChanges = async () => {
    if (project && project.id) {
      const updatedProject = { ...project, context };
      const projectDocRef = db.collection('projects').doc(project.id);

      try {
        await projectDocRef.update({
          context: context,
          title: updatedProject.title,
          description: updatedProject.description,
        });

        dispatch(setActiveProject(updatedProject));
        localStorage.setItem('activeProject', JSON.stringify(updatedProject));
      } catch (error) {
        console.error('Error updating project:', error);
      }
    }
  };

  if (!project) {
    return <div>No project selected</div>;
  }

  return (
    <Box maxW="100%" mx="auto" ml="25px">
      <Card
        w="100%"
        mt={{ base: '70px', md: '0px', xl: '0px' }}
        mb="20px"
        h="100%"
      >
        <FormLabel
          display="flex"
          htmlFor={'Emoji'}
          fontSize="md"
          color={textColor}
          letterSpacing="0px"
          fontWeight="bold"
          _hover={{ cursor: 'pointer' }}
        >
          Emoji
        </FormLabel>
        <Input
          color={textColor}
          border="1px solid"
          borderRadius={'14px'}
          borderColor={borderColor}
          h="60px"
          w="60px"
          id="Emoji"
          fontSize="24px"
          fontWeight="500"
          placeholder="😁"
          maxLength={5}
          _placeholder={placeholderColor}
          _focus={{ borderColor: 'none' }}
          mb="22px"
          defaultValue={'📝'}
        />
        <FormLabel
          display="flex"
          htmlFor={'title'}
          fontSize="md"
          color={textColor}
          letterSpacing="0px"
          fontWeight="bold"
          _hover={{ cursor: 'pointer' }}
        >
          Title
        </FormLabel>
        <Input
          color={textColor}
          border="1px solid"
          borderRadius={'14px'}
          borderColor={borderColor}
          h="60px"
          w="100%"
          id="title"
          fontSize="sm"
          fontWeight="500"
          defaultValue={project.title}
          placeholder="Template Title"
          _placeholder={placeholderColor}
          _focus={{ borderColor: 'none' }}
          mb="22px"
          onChange={(e) => handleContextChange('title', e.target.value)}
        />
        <FormLabel
          display="flex"
          htmlFor={'description'}
          fontSize="md"
          color={textColor}
          letterSpacing="0px"
          fontWeight="bold"
          _hover={{ cursor: 'pointer' }}
        >
          Description
        </FormLabel>
        <Input
          color={textColor}
          border="1px solid"
          borderRadius={'14px'}
          borderColor={borderColor}
          h="60px"
          w="100%"
          id="description"
          fontSize="sm"
          fontWeight="500"
          defaultValue={project.description}
          placeholder="Template Description"
          _placeholder={placeholderColor}
          _focus={{ borderColor: 'none' }}
          mb="22px"
          onChange={(e) => handleContextChange('description', e.target.value)}
        />
        <FormLabel
          display="flex"
          htmlFor={'prompt'}
          fontSize="md"
          color={textColor}
          letterSpacing="0px"
          fontWeight="bold"
          _hover={{ cursor: 'pointer' }}
        >
          Prompt
        </FormLabel>
        <Textarea
          border="1px solid"
          borderRadius={'14px'}
          borderColor={borderColor}
          p="15px 20px"
          mb="28px"
          minH="180px"
          fontWeight="500"
          fontSize="sm"
          _focus={{ borderColor: 'none' }}
          color={textColor}
          defaultValue={'Write a formal essay based on the following:'}
          placeholder="Template Prompt"
          _placeholder={placeholderColor}
        />
        <Flex
          flexDirection={{ base: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems="right"
        >
          <Button
            variant="red"
            py="20px"
            px="16px"
            fontSize="sm"
            borderRadius="45px"
            w={{ base: '100%', md: '200px' }}
            h="54px"
          >
            Delete Prompt
          </Button>
          <Button
            variant="primary"
            py="20px"
            px="16px"
            fontSize="sm"
            borderRadius="45px"
            mt={{ base: '20px', md: '0px' }}
            w={{ base: '100%', md: '200px' }}
            h="54px"
            onClick={handleSaveChanges}
          >
            Save changes
          </Button>
        </Flex>
      </Card>
      <Box w="100%" mt="20px">
        {context && (
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th>Key</Th>
                <Th>Value</Th>
              </Tr>
            </Thead>
            <Tbody>
              {Object.keys(context).map((key) => (
                <Tr key={key}>
                  <Td>{key}</Td>
                  <Td>
                    <Input
                      color={textColor}
                      border="1px solid"
                      borderRadius={'14px'}
                      borderColor={borderColor}
                      h="60px"
                      w="100%"
                      value={context[key]}
                      onChange={(e) => handleContextChange(key, e.target.value)}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Box>
    </Box>
  );
}
