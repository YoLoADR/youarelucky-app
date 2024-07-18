import React from 'react';
import { Box, Button, Text, Flex, Heading, Stack, Checkbox } from '@chakra-ui/react';

// Mocked data
const patientDetails = {
  name: 'John Doe',
  age: 45,
  medicalHistory: 'Hypertension, Diabetes',
  recentDiagnoses: 'Mild COVID-19',
  previousNotes: 'Patient is responding well to treatment.',
  allergies: 'Penicillin',
  criticalMedications: 'Insulin',
};

const checklistItems = [
  'Vérifier les résultats des derniers tests',
  'Discuter des symptômes actuels',
  'Réviser les prescriptions actuelles',
  'Confirmer les prochaines étapes du traitement',
  'Discuter des recommandations de style de vie'
];

const AppointmentPreparationTab = () => {
  return (
    <Box>
      <Flex justifyContent="space-between" mb={4}>
        <Button colorScheme="blue">Accéder au meeting</Button>
      </Flex>
      <Flex>
        <Stack spacing={4} w="50%">
          <Box p={4} borderWidth="1px" borderRadius="lg" bg="white" boxShadow="sm">
            <Heading size="md" mb={2}>Résumé IA Personnalisé</Heading>
            <Text><strong>Nom du patient:</strong> {patientDetails.name}</Text>
            <Text><strong>Âge:</strong> {patientDetails.age}</Text>
            <Text><strong>Antécédents médicaux:</strong> {patientDetails.medicalHistory}</Text>
            <Text><strong>Diagnostiques récents:</strong> {patientDetails.recentDiagnoses}</Text>
            <Text><strong>Notes précédentes:</strong> {patientDetails.previousNotes}</Text>
          </Box>
          <Box p={4} borderWidth="1px" borderRadius="lg" bg="red.50" boxShadow="sm">
            <Heading size="md" mb={2}>Alerte</Heading>
            <Text><strong>Allergies:</strong> {patientDetails.allergies}</Text>
            <Text><strong>Médicaments critiques:</strong> {patientDetails.criticalMedications}</Text>
          </Box>
        </Stack>
        <Box p={4} borderWidth="1px" borderRadius="lg" bg="white" boxShadow="sm" w="50%" ml={4}>
          <Heading size="md" mb={2}>Checklist Interactive</Heading>
          {checklistItems.map((item, index) => (
            <Checkbox key={index} mb={2} colorScheme="green">
              {item}
            </Checkbox>
          ))}
        </Box>
      </Flex>
    </Box>
  );
};

export default AppointmentPreparationTab;
