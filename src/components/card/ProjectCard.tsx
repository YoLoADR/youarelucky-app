'use client';
// Chakra imports
import {
  Flex,
  useColorModeValue,
  Text,
  Icon,
  Box
} from '@chakra-ui/react';
import Card from '@/components/card/Card';
import { IoMdTime, IoMdDocument, IoMdTrash, IoMdCreate } from 'react-icons/io';
import { useRouter } from 'next/navigation'; // Importez useRouter de Next.js
import { useDispatch } from 'react-redux'; // Importez useDispatch de React Redux
import { setActiveProject } from '@/store/activeProjectSlice'; // Assurez-vous que le chemin est correct

export default function Default(props: {
  project: any;
  onDelete: (id: string) => void;
}) {
  const { project, onDelete } = props;
  const textColor = useColorModeValue('navy.700', 'white');
  const gray = useColorModeValue('gray.500', 'white');
  const router = useRouter();
  const dispatch = useDispatch(); // Utilisez useDispatch pour dispatcher des actions

  const handleTitleClick = () => {
    dispatch(setActiveProject(project));
    router.push('/edit-project');
  };

  const handleDocumentClick = () => {
    dispatch(setActiveProject(project));
    router.push('/form-filling');
  };

  const handleDeleteClick = () => {
    onDelete(project.id);
  };

  const handleEditClick = () => {
    dispatch(setActiveProject(project));
    router.push('/edit-project');
  };

  return (
    <Card py="32px" px="32px">
      <Flex
        my="auto"
        h="100%"
        direction={'column'}
        align={{ base: 'center', xl: 'start' }}
        justify={{ base: 'center', xl: 'center' }}
      >
        <Text fontSize="lg" color={textColor} fontWeight="700" cursor="pointer" onClick={handleTitleClick}>
          {project?.title}
        </Text>
        <Text mt="5px" color={gray} fontSize="md">
          {project?.description}
        </Text>
        <Flex w="100%" align="center" justify="space-between" mt="5px" mb="20px">
          <Flex align="center">
            <Icon w="18px" h="18px" me="10px" as={IoMdTime} color={gray} />
            <Text fontSize="sm" color={gray} fontWeight="500">
              {new Date(project.created_at).toLocaleString()}
            </Text>
          </Flex>
        </Flex>
        <Flex w="100%" align="center" justify="space-between">
          <Flex align="center">
            <Icon
              as={IoMdDocument}
              w={5}
              h={5}
              cursor="pointer"
              onClick={handleDocumentClick}
              me="10px"
            />
            <Icon
              as={IoMdCreate}
              w={5}
              h={5}
              cursor="pointer"
              onClick={handleEditClick}
              me="10px"
            />
            <Icon
              as={IoMdTrash}
              w={5}
              h={5}
              cursor="pointer"
              onClick={handleDeleteClick}
            />
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
}
