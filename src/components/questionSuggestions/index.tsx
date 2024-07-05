import { Box, Text } from '@chakra-ui/react';

const QuestionSuggestions = ({ demoQuestions, handleDemo }) => {
  return (
    <Box display="flex" flexWrap="wrap" justifyContent="space-between" mb="4" zIndex="1">
      {demoQuestions.map((card) => (
        <Box 
          as="button" 
          onClick={() => handleDemo(card.id)} 
          key={card.id} 
          width={{ base: '100%', md: '48%' }} 
          p="4" 
          borderWidth="1px" 
          borderRadius="lg" 
          overflow="hidden" 
          mb="4" 
          bg="rgba(128, 90, 213, 0.1)" 
          _hover={{ bg: "rgba(128, 90, 213, 0.3)" }} 
          textAlign="left"
        >
          <Text fontSize="sm" mb="1">{card.question}</Text>
          <Text fontSize="xs" color="purple.700">{card.action}</Text>
        </Box>
      ))}
    </Box>
  );
};

export default QuestionSuggestions;
