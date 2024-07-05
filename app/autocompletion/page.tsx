'use client';
/*eslint-disable*/

import React, { useState } from 'react';
import { Button, Flex, FormLabel, Input, Textarea, useColorModeValue, Box, Image, IconButton, SimpleGrid, CircularProgress, CircularProgressLabel, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { AddIcon, DeleteIcon, DownloadIcon } from '@chakra-ui/icons';
import Card from '@/components/card/Card';
import UploadModalDemo from '@/components/uploadModalDemo'; // Assurez-vous que le chemin est correct
import AddDocModal from '@/components/AddDocModal';

export default function Autocompletion() {
  const textColor = useColorModeValue('navy.700', 'white');
  const placeholderColor = useColorModeValue({ color: 'gray.500' }, { color: 'whiteAlpha.600' });
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');

  const [items, setItems] = useState([
    { id: 1, title: 'Import Invoice for Electronics 🇨🇳🇺🇸', description: 'Invoice detailing the shipment of electronics from China to the USA', content: 'Foreign Administrative ...', category: 'Foreign Administrative Documents', name: "Yohann", age: "36", address: '123 Export St', city: "Los Angeles", image: 'https://res.cloudinary.com/dy4hywvlz/image/upload/v1717835412/uexigefa7dhqxw7pqf1u.png', progress: 50 },
    { id: 2, title: 'Bill of Lading for Textile Goods 🇮🇳🇫🇷', description: '', content: 'Commercial Documents ...', category: 'Commercial Documents', image: 'https://res.cloudinary.com/dy4hywvlz/image/upload/v1717835412/uexigefa7dhqxw7pqf1u.png', progress: 75 },
    // Add more mock items here if needed
]);
  const [currentItem, setCurrentItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTabIndex, setActiveTabIndex] = useState(0);

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

  const handleDeleteItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleDownloadItem = (id) => {
    // Implémentez la logique de téléchargement ici
  };

  const handleSaveChanges = () => {
    if (currentItem) {
      setItems(prevItems => 
        prevItems.map(item => 
          item.id === currentItem.id 
            ? { ...item, ...currentItem, progress: item.progress } 
            : item
        )
      );
      setCurrentItem(null);
      setActiveTabIndex(0);
    }
  };

  const handleCancelEdit = () => {
    setCurrentItem(null);
    setActiveTabIndex(0);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    // Check if the current item value is not empty
    const isCurrentValueEmpty = currentItem[name] === '';
  
    setCurrentItem({ ...currentItem, [name]: value });
  
    // Increase progress for all items only if the current value was empty
    if (isCurrentValueEmpty) {
      setItems(prevItems =>
        prevItems.map(item =>
          ({ ...item, progress: Math.min(item.progress + 10, 100) })
        )
      );
    }
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
                <Box mb="5px">
                  <span style={{ fontWeight: 'bold' }}>Content:</span> {item.content}
                </Box>
                <Flex justifyContent="space-between">
                  <IconButton icon={<DeleteIcon />} onClick={(e) => { e.stopPropagation(); handleDeleteItem(item.id); }} mr="2" />
                  <IconButton icon={<DownloadIcon />} onClick={(e) => { e.stopPropagation(); handleDownloadItem(item.id); }} />
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
          <UploadModalDemo setApiKey={"setApiKey"} handleFileUpload={() => {
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
            <Tabs variant='soft-rounded' colorScheme='purple' index={activeTabIndex} onChange={setActiveTabIndex}>
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
      <AddDocModal isOpen={isModalOpen} onClose={handleCloseModal} onSelectItem={handleSelectItem} />
    </Flex>
  );
}
