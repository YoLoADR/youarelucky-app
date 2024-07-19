'use client';
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { setUser } from '@/store/userSlice';
import {
  Box, Button, Stack, Text, Flex, Heading, Icon, Badge, Modal,
  ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure
} from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';
import { faker } from '@faker-js/faker';

// Composant pour afficher les informations du patient dans une modal
const PatientModal = ({ patient, onClose }) => {
  return (
    <Modal isOpen={!!patient} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Informations du Patient</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>Nom : {patient.name}</Text>
          <Text>Email : {patient.email}</Text>
          <Text>Âge : {patient.age}</Text>
          <Text>Adresse : {patient.address}</Text>
          <Text>Téléphone : {patient.phone}</Text>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Fermer
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default function NurseDashboard() {
  const { user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    // Mock des données des patients avec faker
    const generatePatients = () => {
      return Array.from({ length: 10 }, () => ({
        id: faker.datatype.uuid(),
        name: faker.person.fullName(),
        email: faker.internet.email(),
        age: faker.number.int({ min: 18, max: 90 }),
        address: faker.location.streetAddress(),
        phone: faker.phone.number(),
        photo: faker.image.avatar(),
        status: faker.helpers.arrayElement(['Admis de jour', 'Hospitalisé']),
        careCompleted: faker.datatype.boolean()
      }));
    };
    setPatients(generatePatients());
  }, []);

  const handleCardClick = (patient) => {
    setSelectedPatient(patient);
    onOpen();
  };

  return (
    <Box mt={{ base: '70px', md: '0px', xl: '0px' }} ml="25px" pt="50px">
      <Flex wrap="wrap" justifyContent="center">
        {patients.map((patient) => (
          <Box key={patient.id} m={4} textAlign="center">
            <Box
              width="250px"
              height="250px"
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              position="relative"
              bgImage={`url(${patient.photo})`}
              bgSize="cover"
              bgPosition="center"
              cursor="pointer"
              onClick={() => handleCardClick(patient)}
            >
              <Flex direction="column" justifyContent="space-between" height="100%">
                <Box p={2} display="flex" justifyContent="flex-end">
                  {patient.careCompleted && (
                    <Box
                      width="24px"
                      height="24px"
                      borderRadius="50%"
                      bg="white"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Icon as={CheckIcon} w={4} h={4} color="green.500" />
                    </Box>
                  )}
                </Box>
                <Box p={2}>
                  <Badge colorScheme={patient.status === 'Admis de jour' ? 'blue' : 'red'}>
                    {patient.status}
                  </Badge>
                </Box>
              </Flex>
            </Box>
            <Text fontWeight="bold" width="250px" isTruncated>{patient.name}</Text>
          </Box>
        ))}
      </Flex>
      {selectedPatient && <PatientModal patient={selectedPatient} onClose={onClose} />}
    </Box>
  );
}
