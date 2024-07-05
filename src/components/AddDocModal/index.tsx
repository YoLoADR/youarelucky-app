import React, { useState, useEffect } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, SimpleGrid, Box, Image, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';

const AddDocModal = ({ isOpen, onClose, onSelectItem, templates }) => {
  const mockItems = templates;


  const categories = ['All', ...new Set(mockItems.map(item => item.category))];

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    setSelectedCategory(categories[tabIndex]);
  }, [tabIndex, categories]);

  const filteredItems = selectedCategory === 'All'
    ? mockItems
    : mockItems.filter(item => item.category === selectedCategory);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={'xl'}>
      <ModalOverlay />
      <ModalContent bg="white" maxWidth="80%">
        <ModalHeader>Select an Item</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Tabs variant="soft-rounded" colorScheme="purple" index={tabIndex} onChange={(index) => setTabIndex(index)}>
            <TabList>
              {categories.map((category, index) => (
                <Tab key={index}>{category}</Tab>
              ))}
            </TabList>
            <TabPanels>
              {categories.map((category, index) => (
                <TabPanel key={index}>
                  <SimpleGrid columns={{ base: 1, md: 3 }} spacing="10px">
                    {filteredItems.map(item => (
                      <Box key={item.id} border="1px solid" borderColor="gray.200" borderRadius="10px" p="10px" onClick={() => onSelectItem(item)} cursor="pointer">
                        <Image src={item.image} boxSize="50px" objectFit="cover" mb="10px" />
                        <Box fontWeight="bold" fontSize="md">
                          {item.title}
                        </Box>
                        <Box>
                          {item.description}
                        </Box>
                      </Box>
                    ))}
                  </SimpleGrid>
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddDocModal;
