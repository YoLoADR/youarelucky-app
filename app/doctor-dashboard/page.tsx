'use client';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { db, auth } from '@/firebase';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { setUser } from '@/store/userSlice';
import { setActiveProject } from '@/store/activeProjectSlice';
import ProjectPaperworks from '@/components/projectPaperworks';
import {
  Box, Button, Input, Stack, Text, IconButton
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';

export default function DoctorDashboard() {
  const { user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const activeProject = useSelector((state: any) => state.activeProject.activeProject);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [projects, setProjects] = useState([]);
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [editingProject, setEditingProject] = useState(null);
  const [userIdToAdd, setUserIdToAdd] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      fetchProjects();
    }
  }, [user]);

  const fetchProjects = async () => {
    if (user && user.uid) {
      const projectsSnapshot = await db.collection('projects')
        .where('users', 'array-contains', user.uid)
        .get();

      const projectsData = projectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProjects(projectsData);
    }
  };

  const handleUpdateUser = async () => {
    if (user && user.uid) {
      const userDocRef = db.collection('customers').doc(user.uid);
      await userDocRef.update({
        name: name,
        email: email
      });

      const updatedUser = { ...user, name: name, email: email };
      dispatch(setUser(updatedUser));
      setIsEditing(false);
    }
  };

  const handleCreateProject = async () => {
    if (user && user.uid && projectTitle && projectDescription) {
      const newProject = {
        title: projectTitle,
        description: projectDescription,
        created_at: new Date().toISOString(),
        users: [user.uid]
      };

      await db.collection('projects').add(newProject);
      setProjectTitle('');
      setProjectDescription('');
      fetchProjects();
    }
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setProjectTitle(project.title);
    setProjectDescription(project.description);
    setUserIdToAdd(''); // Reset user ID field
    setErrorMessage(''); // Reset error message
    setIsEditing(true);
  };

  const handleSaveProject = async () => {
    if (editingProject && editingProject.id) {
      const projectDocRef = db.collection('projects').doc(editingProject.id);
      await projectDocRef.update({
        title: projectTitle,
        description: projectDescription
      });

      if (userIdToAdd) {
        if (editingProject.users.includes(userIdToAdd)) {
          setErrorMessage('User is already added to the project.');
          return;
        }

        try {
          const userDocRef = db.collection('customers').doc(userIdToAdd);
          const userDoc = await userDocRef.get();

          if (userDoc.exists) {
            await projectDocRef.update({
              users: [...editingProject.users, userIdToAdd]
            });

            setEditingProject({
              ...editingProject,
              users: [...editingProject.users, userIdToAdd]
            });

            setUserIdToAdd('');
            setErrorMessage('');
            fetchProjects();
          } else {
            setErrorMessage('User not found');
          }
        } catch (error) {
          console.error('Error adding user to project: ', error);
          if (error.code === 'permission-denied') {
            setErrorMessage('Missing or insufficient permissions to access user data.');
          } else {
            setErrorMessage('An unexpected error occurred. Please try again.');
          }
        }
      }

      setEditingProject(null);
      setProjectTitle('');
      setProjectDescription('');
      fetchProjects();
    }
  };

  const handleCancelEdit = () => {
    setEditingProject(null);
    setProjectTitle('');
    setProjectDescription('');
    setUserIdToAdd('');
    setErrorMessage('');
    setIsEditing(false);
  };

  const handleSetActiveProject = (project) => {
    dispatch(setActiveProject(project));
  };

  const handleRemoveProject = async () => {
    if (activeProject && activeProject.id) {
      try {
        await db.collection('projects').doc(activeProject.id).delete();
        dispatch(setActiveProject(null));
        fetchProjects();
      } catch (error) {
        console.error('Error removing project:', error);
      }
    }
  };

  return (
    <Box mt={{ base: '70px', md: '0px', xl: '0px' }} ml="25px">
      <h1> Doctor Dashboard Page</h1>
      {user?.email && (
        <>
          <h2>Profile</h2>
          {isEditing ? (
            <Box>
              <Input
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                mb={4}
              />
              <Input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                mb={4}
              />
              <Button onClick={handleUpdateUser}>Save</Button>
              <Button onClick={() => setIsEditing(false)} ml={2}>Cancel</Button>
            </Box>
          ) : (
            <Box>
              <p>Name: {name}</p>
              <p>Email: {email}</p>
              <Button onClick={() => setIsEditing(true)}>Edit</Button>
            </Box>
          )}

          <Box mt={10}>
            <h2>{editingProject ? 'Edit Project' : 'Create New Project'}</h2>
            <Input
              placeholder="Project Title"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              mb={4}
            />
            <Input
              placeholder="Project Description"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              mb={4}
            />
            {editingProject && (
              <Input
                placeholder="Add User ID"
                value={userIdToAdd}
                onChange={(e) => setUserIdToAdd(e.target.value)}
                mb={4}
              />
            )}
            {editingProject ? (
              <>
                <Button onClick={handleSaveProject}>Save</Button>
                <Button onClick={handleCancelEdit} ml={2}>Cancel</Button>
                {errorMessage && <Text color="red.500" mt={4}>{errorMessage}</Text>}
              </>
            ) : (
              <Button onClick={handleCreateProject}>Create Project</Button>
            )}
          </Box>

          <Box mt={10}>
            <h2>Doctor Projects</h2>
            {projects.length > 0 ? (
              <Stack>
                {projects.map((project) => (
                  <Box
                    key={project.id}
                    p={5}
                    shadow="md"
                    borderWidth="1px"
                    onClick={() => handleSetActiveProject(project)}
                    cursor="pointer"
                    backgroundColor={activeProject?.id === project.id ? 'gray.100' : 'white'}
                  >
                    <Text fontWeight="bold">{project.title}</Text>
                    <Text mt={2}>{project.description}</Text>
                    <Text mt={2} fontSize="sm" color="gray.500">
                      Created at: {new Date(project.created_at).toLocaleString()}
                    </Text>
                    <IconButton
                      aria-label="Edit project"
                      icon={<EditIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditProject(project);
                      }}
                      ml={2}
                    />
                    <IconButton
                      aria-label="Remove project"
                      icon={<DeleteIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveProject();
                      }}
                      ml={2}
                    />
                  </Box>
                ))}
              </Stack>
            ) : (
              <Text>No projects found</Text>
            )}
          </Box>

          {activeProject && <ProjectPaperworks activeProject={activeProject} />}
        </>
      )}
    </Box>
  );
}
