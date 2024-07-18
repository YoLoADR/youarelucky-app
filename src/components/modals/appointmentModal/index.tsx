// AppointmentModal.js
import React, { useEffect, useState } from 'react';
import { Box, Button, Text, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure, Tabs, TabList, Tab, TabPanels, TabPanel, Link, Checkbox, VStack } from '@chakra-ui/react';
import { mockPatients } from '@/variables/demoPlanning';
import AppointmentPreparationTab from '@/components/AppointmentPreparationTab'
import AppointmentHistoryTab from '@/components/AppointmentHistoryTab'
import ChatComponent from '@/components/chatbotDemo'

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
              <Tab>Préparation</Tab>
              <Tab>Historique</Tab>
              <Tab>Chatbot</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
              <AppointmentPreparationTab></AppointmentPreparationTab>
              </TabPanel>
              <TabPanel>
                <AppointmentHistoryTab></AppointmentHistoryTab>
              </TabPanel>
              <TabPanel>
                <ChatComponent></ChatComponent>
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
