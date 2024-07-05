'use client';

// Chakra imports
import { useState, useEffect } from "react";
import Card from '@/components/card/Card';
import {
  Box,
  Button,
  Flex,
  SimpleGrid,
  Text,
  Stack,
  useColorModeValue,
  Heading, Avatar, Table, Thead, Tbody, Tr, Th, Td, Input
} from '@chakra-ui/react';
import { db } from '@/firebase';
import { createProject, getProjects, updateProject, deleteProject, createDocument, getDocuments, updateDocument, deleteDocument } from "@/services/firebaseServices";

const mockUser = {
  id: "customer_id_1",
  name: "John Doe",
  email: "john@example.com",
  data: {
    address: "123 Main St",
    phone: "555-555-5555"
  }
};

const mockProjects = [
  {
    id: "project_id_1",
    title: "Export Shoes to USA",
    description: "Project for exporting shoes to the USA",
    created_at: "2024-06-27",
    customers: ["customer_id_1", "customer_id_2"],
    pdfs: [
      {
        id: "pdf_id_1",
        file_name: "invoice_001.pdf",
        upload_date: "2024-06-27",
        data: {
          amount: "$500",
          items: 50
        }
      },
      {
        id: "pdf_id_2",
        file_name: "invoice_002.pdf",
        upload_date: "2024-06-27",
        data: {
          amount: "$300",
          items: 30
        }
      }
    ]
  }
];

export default function Settings() {
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

  const [user, setUser] = useState(mockUser);
  const [projects, setProjects] = useState(mockProjects);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showUserData, setShowUserData] = useState(false);
  const [showProjectData, setShowProjectData] = useState(false);
  const [showFormFilling, setShowFormFilling] = useState(false);

  useEffect(() => {
    async function fetchProjects() {
      const projectsList = await getProjects();
      setProjects(projectsList);
    }
    fetchProjects();
  }, []);

  const handleUpdateProject = async (projectId, key, value) => {
    const updatedProjects = projects.map(project => {
      if (project.id === projectId) {
        project[key] = value;
      }
      return project;
    });
    setProjects(updatedProjects);
    await updateProject(projectId, { [key]: value });
  };

  const handleUpdateDocument = async (projectId, documentId, key, value) => {
    const updatedProjects = projects.map(project => {
      if (project.id === projectId) {
        project.pdfs = project.pdfs.map(pdf => {
          if (pdf.id === documentId) {
            pdf.data[key] = value;
          }
          return pdf;
        });
      }
      return project;
    });
    setProjects(updatedProjects);
    await updateDocument(projectId, documentId, { data: { [key]: value } });
  };

  return (
      <Box mt={{ base: '70px', md: '0px', xl: '0px' }} ml="25px">
        <Heading>Export Management</Heading>
        <Box mt={5} p={5} borderWidth={1} borderRadius="lg">
          <Avatar name={user.name} />
          <Text mt={3} fontWeight="bold">{user.name}</Text>
          <Text>{user.email}</Text>
          <Button mt={3} onClick={() => setShowUserData(!showUserData)}>
            {showUserData ? "Hide User Data" : "Show User Data"}
          </Button>
          {showUserData && (
            <Table variant="simple" mt={3}>
              <Thead>
                <Tr>
                  <Th>Key</Th>
                  <Th>Value</Th>
                </Tr>
              </Thead>
              <Tbody>
                {Object.entries(user.data).map(([key, value]) => (
                  <Tr key={key}>
                    <Td>{key}</Td>
                    <Td>
                      <Input
                        value={value}
                        onChange={(e) => {
                          const newUser = { ...user };
                          newUser.data[key] = e.target.value;
                          setUser(newUser);
                        }}
                      />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </Box>

        <Heading size="md" mt={5}>Projects</Heading>
        <SimpleGrid columns={2} spacing={10} mt={5}>
          {projects.map((project) => (
            <Box key={project.id} p={5} borderWidth={1} borderRadius="lg">
              <Heading size="sm">{project.title}</Heading>
              <Text>{project.description}</Text>
              <Stack direction="row" spacing={4} mt={3}>
                <Button onClick={() => {
                  setSelectedProject(project);
                  setShowProjectData(true);
                  setShowFormFilling(false);
                }}>
                  Variables
                </Button>
                <Button onClick={() => {
                  setSelectedProject(project);
                  setShowFormFilling(true);
                  setShowProjectData(false);
                }}>
                  Form-Filling
                </Button>
              </Stack>
            </Box>
          ))}
        </SimpleGrid>

        {showProjectData && selectedProject && (
          <Box mt={5} p={5} borderWidth={1} borderRadius="lg">
            <Heading size="sm">Project Variables</Heading>
            <Table variant="simple" mt={3}>
              <Thead>
                <Tr>
                  <Th>Key</Th>
                  <Th>Value</Th>
                </Tr>
              </Thead>
              <Tbody>
                {Object.entries(selectedProject.pdfs[0].data).map(([key, value]) => (
                  <Tr key={key}>
                    <Td>{key}</Td>
                    <Td>
                      <Input
                        value={value}
                        onChange={(e) => handleUpdateDocument(selectedProject.id, selectedProject.pdfs[0].id, key, e.target.value)}
                      />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        )}

        {showFormFilling && selectedProject && (
          <Box mt={5} p={5} borderWidth={1} borderRadius="lg">
            <Heading size="sm">Form-Filling</Heading>
            {selectedProject.pdfs.map((pdf) => (
              <Box key={pdf.id} mt={5}>
                <Text fontWeight="bold">{pdf.file_name}</Text>
                <Table variant="simple" mt={3}>
                  <Thead>
                    <Tr>
                      <Th>Key</Th>
                      <Th>Value</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {Object.entries(pdf.data).map(([key, value]) => (
                      <Tr key={key}>
                        <Td>{key}</Td>
                        <Td>
                          <Input
                            value={value}
                            onChange={(e) => handleUpdateDocument(selectedProject.id, pdf.id, key, e.target.value)}
                          />
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            ))}
          </Box>
        )}
      </Box>
  );
}
