'use client';
/*eslint-disable*/
import { useSelector, useDispatch } from 'react-redux';
import { useAppSelector } from '@/hooks';
import { RootState } from '@/store'; 
import React, { useState, useEffect } from 'react';
import { Button, Flex, FormLabel, Input, Textarea, useColorModeValue, Box, Image, IconButton, SimpleGrid, CircularProgress, CircularProgressLabel, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { AddIcon, DeleteIcon, DownloadIcon } from '@chakra-ui/icons';
import Card from '@/components/card/Card';
import UploadPDFModal from '@/components/modals/uploadPDFModal'; // Assurez-vous que le chemin est correct
import AddDocModal from '@/components/AddDocModal';
import { db } from '@/firebase';
import { setProjects, setActiveProject } from '@/store/projectSlice';

export default function FormFilling() {
  const dispatch = useDispatch();
  const project = useSelector((state: RootState) => state.projects.activeProject);
  const { user } = useAppSelector((state) => state.user);
  const textColor = useColorModeValue('navy.700', 'white');
  const placeholderColor = useColorModeValue({ color: 'gray.500' }, { color: 'whiteAlpha.600' });
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');

  const [items, setItems] = useState([]); // If empty : Please select one pdf
  const [fullListItems, setFullListItems] = useState([]);
  const [currentItem, setCurrentItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  // Function to calculate the progress percentage
  const calculateProgress = (item) => {
    const totalFields = Object.keys(item).filter(key => !['id', 'image', 'progress'].includes(key)).length;
    const filledFields = Object.keys(item).filter(key => !['id', 'image', 'progress'].includes(key) && item[key] !== '' && item[key] !== null).length;
    return Math.floor((filledFields / totalFields) * 100);
  };

  // Function to synchronize context with templates
  const synchronizeContextWithTemplates = (context, templates) => {
    return templates.map(template => {
      const updatedTemplate = { ...template };
      Object.keys(template).forEach(key => {
        if (context.hasOwnProperty(key) && key !== 'id' && key !== 'title' && key !== 'description' && key !== 'image') {
          updatedTemplate[key] = context[key];
        }
      });
      updatedTemplate.progress = calculateProgress(updatedTemplate);
      return updatedTemplate;
    });
  };

  // TODO HERE : UseEffect in order Synchronize current templates with context (because context can be updated from redux)
  useEffect(() => {
    if (user) {
      fetchTemplates();
      fetchProjects();
    }
  }, [user]);

  useEffect(() => {
    if (project && project.context && items.length) {
      const synchronizedItems = synchronizeContextWithTemplates(project.context, items);
      setItems(synchronizedItems);
    }
  }, [project.context]); 

  const fetchTemplates = async () => {
    if (user && user.uid) {
      const templatesSnapshot = await db.collection('templates').get();
      const templatesData = templatesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Sort templates by created_at date in ascending order
      const sortedTemplates = templatesData.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    
      if (project.context) {
        // Synchronize context with sorted templates
        const synchronizedTemplates = synchronizeContextWithTemplates(project.context, sortedTemplates);
        setFullListItems(synchronizedTemplates);
        setItems(synchronizedTemplates.slice(0, 2));
        console.log("synchronizedTemplates", synchronizedTemplates);
      } else {
        setFullListItems(sortedTemplates);
        setItems(sortedTemplates.slice(0, 2));
      }

      console.log("project.context", project.context);
    }
  };

  const updateProjectContextInFirestore = async (projectId, context) => {
    try {
      await db.collection('projects').doc(projectId).update({
        context: context
      });
      console.log('Project context updated successfully');
    } catch (error) {
      console.error('Error updating project context: ', error);
    }
  };

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

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSelectItem = (item) => {
    setItems([...items, item]);
    setIsModalOpen(false);
  };

  const handleAddItem = () => {
    const newItem = { id: Date.now(), title: '', description: '', content: '', image: 'https://res.cloudinary.com/dy4hywvlz/image/upload/v1717835412/uexigefa7dhqxw7pqf1u.png', progress: 0 };
    setItems([...items, newItem]);
    setCurrentItem(newItem);
    setActiveTabIndex(0);
  };

  const handleDeleteItem = async (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleDownloadItem = async (templateName) => {
    try {
      const response = await fetch('/api/fillPdfAPI', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ templateName, uid: user.uid, projectId: project.id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error:', errorData.message);
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `filled_${templateName}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSaveChanges = async () => {
    if (currentItem) {
      currentItem.progress = calculateProgress(currentItem);

      // Mettre à jour le contexte du projet avec les données actuelles de currentItem
      const updatedContext = { ...project.context, ...currentItem };
      await updateProjectContextInFirestore(project.id, updatedContext);

      // Mettre à jour le state Redux après avoir mis à jour Firestore
      await fetchTemplates();

      // TODO HERE : Synchronize sorted templates with context (because context is updated)

      const synchronizedItems = synchronizeContextWithTemplates(updatedContext, items);
      setItems(synchronizedItems);
      setActiveTabIndex(0);
    }
  };

  const handleCancelEdit = () => {
    setCurrentItem(null);
    setActiveTabIndex(0);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    setCurrentItem(prevItem => {
      const updatedItem = { ...prevItem, [name]: value };
      updatedItem.progress = calculateProgress(updatedItem);
      return updatedItem;
    });

    setItems(prevItems => 
      prevItems.map(item => 
        item.id === currentItem.id 
          ? { ...item, [name]: value, progress: calculateProgress({ ...item, [name]: value }) } 
          : item
      )
    );
  };

  const paginatedItems = items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Determine the unique set of keys from the current item, excluding id, image, and progress
  const getFormFields = () => {
    if (!currentItem) return [];
    return Object.keys(currentItem).filter(key => !['id', 'image', 'progress', 'category'].includes(key));
  };

  const formFields = getFormFields();

  // Split form fields into groups of up to 5 for tabs
  const formFieldGroups = [];
  for (let i = 0; i < formFields.length; i += 5) {
    formFieldGroups.push(formFields.slice(i, i + 5));
  }

  return (
    <Flex direction={{ base: 'column', md: 'row' }} justifyContent="space-between" alignItems="flex-start" w="100%" p="20px">
      <Card maxW="100%" w={{ base: '100%', md: '48%' }} h="100%" p="20px">
        <Box fontWeight="bold" fontSize="lg" mb="4">
          Aperçu PDF
        </Box>
        <Box w="100%" h="100%" border="1px solid" borderColor={borderColor} borderRadius="14px" p="20px" overflow="auto">
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing="10px">
            {paginatedItems.map((item) => (
              <Box key={item.id} border="1px solid" borderColor={borderColor} borderRadius="10px" p="10px" onClick={() => { setCurrentItem(item); setActiveTabIndex(0); }} cursor="pointer">
                <Flex alignItems="center" justifyContent="space-between">
                  <CircularProgress value={item.progress} color='purple.400' size='100px' thickness='4px'>
                    <CircularProgressLabel>{item.progress}%</CircularProgressLabel>
                  </CircularProgress>
                  <Image src={item.image} boxSize="100px" objectFit="cover" ml="15px" />
                </Flex>
                <Box mt="10px" fontWeight="bold" fontSize="md" mb="5px">
                  {item.title}
                </Box>
                <Box mb="5px">
                  <span style={{ fontWeight: 'bold' }}>Description:</span> {item.description}
                </Box>
                <Flex justifyContent="space-between">
                  <IconButton icon={<DeleteIcon />} onClick={(e) => { e.stopPropagation(); handleDeleteItem(item.id); }} mr="2" />
                  <IconButton icon={<DownloadIcon />} onClick={(e) => { e.stopPropagation(); handleDownloadItem(item.templateName); }} />
                </Flex>
              </Box>
            ))}
            <Box display="flex" alignItems="center" justifyContent="center" border="1px dashed" borderColor={borderColor} borderRadius="10px" p="10px">
              <IconButton icon={<AddIcon />} onClick={handleOpenModal} />
            </Box>
          </SimpleGrid>
        </Box>
        {items.length > itemsPerPage && (
          <Flex justifyContent="center" mt="10px">
            {Array.from({ length: Math.ceil(items.length / itemsPerPage) }, (_, index) => (
              <Button key={index} onClick={() => setCurrentPage(index + 1)}>{index + 1}</Button>
            ))}
          </Flex>
        )}
      </Card>
            
      <Card maxW="100%" w={{ base: '100%', md: '48%' }} h="100%" p="20px" mt={{ base: '20px', md: '0px' }}>
        <Box border="1px solid" borderColor={borderColor} borderRadius="14px" p="5px" mb="10px" display="flex" alignItems="center" justifyContent="center">
          <UploadPDFModal setApiKey={"setApiKey"} handleFileUpload={() => {
              setItems(prevItems =>
                prevItems.map(item =>
                  ({ ...item, progress: Math.min(item.progress + 10, 100) })
                )
              );
          }} />
        </Box>
        {currentItem ? (
          <>
            {/* DYNAMIC FORM BASED ON ITEM */}
            <Tabs size="sm" variant='soft-rounded' colorScheme='purple' index={activeTabIndex} onChange={setActiveTabIndex}>
              <TabList>
                {formFieldGroups.map((_, index) => (
                  <Tab key={index}>Section {index + 1}</Tab>
                ))}
              </TabList>
              <TabPanels>
                {formFieldGroups.map((group, groupIndex) => (
                  <TabPanel key={groupIndex}>
                    {group.map((field) => (
                      <React.Fragment key={field}>
                        <FormLabel htmlFor={field} fontSize="md" color={textColor} letterSpacing="0px" fontWeight="bold">
                          {field.charAt(0).toUpperCase() + field.slice(1)}
                        </FormLabel>
                        {currentItem[field]?.length > 200 ? (
                          <Textarea
                            name={field}
                            value={currentItem[field] || ''}
                            onChange={handleChange}
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
                            placeholder={`Template ${field.charAt(0).toUpperCase() + field.slice(1)}`}
                            _placeholder={placeholderColor}
                          />
                        ) : (
                          <Input
                            name={field}
                            value={currentItem[field] || ''}
                            onChange={handleChange}
                            color={textColor}
                            border="1px solid"
                            borderRadius={'14px'}
                            borderColor={borderColor}
                            h="60px"
                            w="100%"
                            fontSize="sm"
                            fontWeight="500"
                            placeholder={`Template ${field.charAt(0).toUpperCase() + field.slice(1)}`}
                            _placeholder={placeholderColor}
                            mb="22px"
                          />
                        )}
                      </React.Fragment>
                    ))}
                  </TabPanel>
                ))}
              </TabPanels>
            </Tabs>
            {/* DYNAMIC FORM BASED ON ITEM */}
            <Flex flexDirection={{ base: 'column', md: 'row' }} justifyContent="space-between" alignItems="right">
              <Button variant="red" py="20px" px="16px" fontSize="sm" borderRadius="45px" w={{ base: '100%', md: '130px' }} h="54px" onClick={handleCancelEdit}>
                Cancel
              </Button>
              <Button variant="primary" py="20px" px="16px" fontSize="sm" borderRadius="45px" mt={{ base: '20px', md: '0px' }} w={{ base: '100%', md: '200px' }} h="54px" onClick={handleSaveChanges}>
                Save changes
              </Button>
            </Flex>
          </>
        ) : (
          <Box fontWeight="bold" fontSize="lg" textAlign="center" mt="20px">Select an item to edit</Box>
        )}
      </Card>
      <AddDocModal isOpen={isModalOpen} onClose={handleCloseModal} onSelectItem={handleSelectItem} templates={fullListItems}/>
    </Flex>
  );
}
