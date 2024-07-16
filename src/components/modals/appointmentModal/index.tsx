// AppointmentModal.js
import React, { useEffect, useState } from 'react';
import { Box, Button, Text, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure, Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/react';
import { mockPatients } from '@/variables/demoPlanning';

const AppointmentModal = ({ slot, onClose }) => {
  const { isOpen, onOpen, onClose: close } = useDisclosure();
  const [patientDetails, setPatientDetails] = useState(null);

  useEffect(() => {
    if (slot) {
      // Simuler une récupération des données de l'API pour le patient
      const fetchPatientDetails = async () => {
        const patient = mockPatients[slot.patientId];
        setPatientDetails(patient);
        onOpen();
      };

      fetchPatientDetails();
    }
  }, [slot]);

  const handleClose = () => {
    setPatientDetails(null);
    close();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size={'xl'}>
      <ModalOverlay />
      <ModalContent bg="white" maxWidth="80%">
        <ModalHeader>Détails du Rendez-vous</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
        <Tabs variant='soft-rounded' colorScheme='green'>
          <TabList>
            <Tab>Tab 1</Tab>
            <Tab>Tab 2</Tab>
            <Tab>Tab 3</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Text>Heure : {slot.time}</Text>
              <Text>Jour : {slot.day}</Text>
              {patientDetails ? (
                <>
                  <Text>Patient : {patientDetails.name}</Text>
                  <Text>Âge : {patientDetails.age}</Text>
                  <Text>Historique Médical : {patientDetails.medicalHistory}</Text>
                </>
              ) : (
                <Text>Chargement...</Text>
              )}
            </TabPanel>
            <TabPanel>
              <p>two!</p>
            </TabPanel>
            <TabPanel>
              <p>three!</p>
            </TabPanel>
          </TabPanels>
        </Tabs>
        </ModalBody>
        <ModalFooter>
          <Button onClick={handleClose}>Fermer</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AppointmentModal;
