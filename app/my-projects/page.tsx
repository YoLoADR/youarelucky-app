'use client';

// Chakra imports
import { useRouter } from 'next/navigation';
import Card from '@/components/card/Card';
import ProjectCard from '@/components/card/ProjectCard';
import { SearchBar } from '@/components/search';
import {
  Box,
  Button,
  Flex,
  Icon,
  Select,
  SimpleGrid,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { MdApps, MdDashboard } from 'react-icons/md';
import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/hooks';
import { db } from '@/firebase';
import { setProjects, removeProject } from '@/store/projectSlice'; // Assurez-vous que le chemin est correct

export default function MyProjects() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  const { projects } = useAppSelector((state) => state.projects); // Utiliser useAppSelector pour obtenir les projets
  const textColor = useColorModeValue('navy.700', 'white');
  const buttonBg = useColorModeValue('transparent', 'navy.800');
  const hoverButton = useColorModeValue(
    { bg: 'gray.100' },
    { bg: 'whiteAlpha.100' },
  );
  const activeButton = useColorModeValue(
    { bg: 'gray.200' },
    { bg: 'whiteAlpha.200' },
  );

  useEffect(() => {
    if (user) {
      console.log("user", user);
      fetchProjects();
    }
  }, [user]);

  const fetchProjects = async () => {
    if (user && user.uid) {
      const projectsSnapshot = await db.collection('projects')
        .where('users', 'array-contains', user.uid)
        .get();
      const projectsData = projectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log("projectsData", projectsData);
      dispatch(setProjects(projectsData));
    }
  };

  const handleNewProjectClick = () => {
    router.push('/new-project'); // Rediriger vers /new-project lorsque le bouton est cliqué
  };

  const handleRemoveProject = async (id) => {
    try {
      await db.collection('projects').doc(id).delete();
      dispatch(removeProject(id));
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  return (
    <Box mt={{ base: '70px', md: '0px', xl: '0px' }} ml="25px">
      <Card w="100%" mb="20px">
        <Flex align="center" direction={{ base: 'column', md: 'row' }}>
          <Text fontSize="lg" fontWeight={'700'}>
            All Projects ({projects.length})
          </Text>
          <Button
            variant="primary"
            py="20px"
            px="16px"
            fontSize="sm"
            borderRadius="45px"
            ms="auto"
            mt={{ base: '20px', md: '0px' }}
            w={{ base: '100%', md: '210px' }}
            h="54px"
            onClick={handleNewProjectClick}
          >
            New Project
          </Button>
        </Flex>
      </Card>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing="20px">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} onDelete={handleRemoveProject} />
        ))}
      </SimpleGrid>
    </Box>
  );
}
