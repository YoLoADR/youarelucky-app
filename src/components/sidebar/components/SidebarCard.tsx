// Chakra imports
import { Box, Flex, Text, Button, IconButton } from '@chakra-ui/react';
import { FaMicrophone } from 'react-icons/fa';
import BarChart from '@/components/charts/BarChart';
import {
  barChartDataSidebar,
  barChartOptionsSidebar,
} from '@/variables/charts';

export default function SidebarDocs() {
  const bgColor = 'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%)';

  // Function to handle voice command trigger
  const handleVoiceCommand = () => {
    // Code to start voice command (you'll need to integrate with a voice recognition library or service here)
    console.log('Voice command initiated');
  };

  return (
    <Flex
      justify="center"
      direction="column"
      align="center"
      bg={bgColor}
      borderRadius="16px"
      position="relative"
      w="100%"
      pb="10px"
    >
      <Flex direction="column" mb="12px" w="100%" px="20px" pt="20px">
        <Text fontSize="sm" fontWeight={'600'} color="white" mb="10px">
          Audio Trigger
        </Text>
        <Flex justify="center" w="100%">
          <IconButton
            aria-label="Start voice command"
            icon={<FaMicrophone size="2em" />} // Increased icon size
            onClick={handleVoiceCommand}
            size="lg"
            isRound
            width="70px" // Increased button width
            height="70px" // Increased button height
            fontSize="2xl" // Increased font size for larger icon
            colorScheme="teal"
            bg="white"
            color="black"
            _hover={{ bg: "gray.200" }}
            _active={{ bg: "gray.300" }}
            p="24px" // Augmente l'espace blanc autour de l'icône
            minW="80px" // Assure que le bouton a une largeur minimum
            minH="80px" // Assure que le bouton a une hauteur minimum
          />
        </Flex>
      </Flex>
    </Flex>
  );
}
