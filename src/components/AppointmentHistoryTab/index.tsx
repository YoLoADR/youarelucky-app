import React from 'react';
import { Box, Text, Flex, Heading, Stack } from '@chakra-ui/react';

const AppointmentHistoryTab = () => {
  const patientHistory = [
    {
      date: '2023-07-01',
      event: 'Consultation générale',
      details: 'Vérification annuelle de la santé. Aucun problème majeur détecté.'
    },
    {
      date: '2023-06-15',
      event: 'Résultats de la prise de sang',
      details: 'Augmentation du taux de glucose, conseillé de surveiller l’alimentation.'
    },
    {
      date: '2023-05-10',
      event: 'Diagnostic de l’hypertension',
      details: 'Prescription de médicaments pour l’hypertension.'
    },
    {
      date: '2023-03-22',
      event: 'Visite d’urgence',
      details: 'Douleur thoracique, aucun signe d’infarctus. Recommandation de suivre un cardiologue.'
    }
  ];

  return (
    <Box p={4}>
      <Heading size="md" mb={4}>Historique du Patient</Heading>
      <Stack spacing={4}>
        {patientHistory.map((entry, index) => (
          <Flex key={index} align="center">
            <Box w="10%" textAlign="center">
              <Text fontSize="sm" color="gray.500">{entry.date}</Text>
            </Box>
            <Box w="90%" p={4} borderWidth="1px" borderRadius="lg" bg="white" boxShadow="sm">
              <Text fontWeight="bold">{entry.event}</Text>
              <Text>{entry.details}</Text>
            </Box>
          </Flex>
        ))}
      </Stack>
    </Box>
  );
};

export default AppointmentHistoryTab;
