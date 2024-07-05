import React, { useState } from 'react';
import { Box, Button, Flex, Text, useColorModeValue, Card } from '@chakra-ui/react';

const mockData = [
  { id: 1, title: 'Item 1', description: 'Description for item 1' },
  { id: 2, title: 'Item 2', description: 'Description for item 2' },
  { id: 3, title: 'Item 3', description: 'Description for item 3' },
  { id: 4, title: 'Item 4', description: 'Description for item 4' },
  { id: 5, title: 'Item 5', description: 'Description for item 5' },
  { id: 6, title: 'Item 6', description: 'Description for item 6' },
  { id: 7, title: 'Item 7', description: 'Description for item 7' },
  { id: 8, title: 'Item 8', description: 'Description for item 8' },
  { id: 9, title: 'Item 9', description: 'Description for item 9' },
  // Ajoutez plus d'items si nécessaire
];

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const itemsPerPage = 3;
  const totalItems = mockData.length;
  const maxIndex = Math.ceil(totalItems / itemsPerPage) - 1;

  const nextItems = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) > maxIndex ? 0 : prevIndex + 1);
  };

  const prevItems = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1) < 0 ? maxIndex : prevIndex - 1);
  };

  const getCurrentItems = () => {
    const startIndex = currentIndex * itemsPerPage;
    return mockData.slice(startIndex, startIndex + itemsPerPage);
  };

  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');

  return (
    <Card maxW="100%" w="100%" h="auto" p="20px" mb="20px">
      <Box fontWeight="bold" fontSize="lg" mb="4">
        Card Horizontale
      </Box>
      <Flex justifyContent="space-between" alignItems="center" mb="4">
        <Button onClick={prevItems}>Previous</Button>
        <Button onClick={nextItems}>Next</Button>
      </Flex>
      <Flex justifyContent="space-between">
        {getCurrentItems().map((item) => (
          <Box
            key={item.id}
            w="30%"
            p="10px"
            border="1px solid"
            borderColor={borderColor}
            borderRadius="10px"
          >
            <Text fontWeight="bold">{item.title}</Text>
            <Text>{item.description}</Text>
          </Box>
        ))}
      </Flex>
    </Card>
  );
};

export default Carousel;
