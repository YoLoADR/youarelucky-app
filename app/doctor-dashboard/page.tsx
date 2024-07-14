'use client';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { setUser } from '@/store/userSlice';
import {
  Box, Button, Stack, Text, Flex, Heading, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure, IconButton
} from '@chakra-ui/react';
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons';

export default function DoctorDashboard() {
  const { user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [currentWeek, setCurrentWeek] = useState(0); // 0 = cette semaine, -1 = semaine dernière, 1 = semaine prochaine
  const [selectedDay, setSelectedDay] = useState('Lundi'); // Par défaut, le jour sélectionné est lundi

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const mockData = {
    0: [
      { time: '10:00', patient: 'John Doe', details: 'Consultation de suivi', day: 'Lundi' },
      { time: '11:00', patient: 'Jane Smith', details: 'Nouveau patient', day: 'Lundi' },
      { time: '09:00', patient: 'Alice Johnson', details: 'Consultation de routine', day: 'Mardi' },
      { time: '14:00', patient: 'Bob Brown', details: 'Consultation de suivi', day: 'Mercredi' },
      { time: '10:30', patient: 'Charlie Davis', details: 'Consultation de suivi', day: 'Jeudi' },
      { time: '13:00', patient: 'Eve Evans', details: 'Nouveau patient', day: 'Vendredi' },
    ],
    1: [
      { time: '10:00', patient: 'John Smith', details: 'Consultation de suivi', day: 'Lundi' },
      { time: '11:00', patient: 'Jane Doe', details: 'Nouveau patient', day: 'Lundi' },
      { time: '09:00', patient: 'Alice Brown', details: 'Consultation de routine', day: 'Mardi' },
      { time: '14:00', patient: 'Bob Johnson', details: 'Consultation de suivi', day: 'Mercredi' },
      { time: '10:30', patient: 'Charlie Evans', details: 'Consultation de suivi', day: 'Jeudi' },
      { time: '13:00', patient: 'Eve Davis', details: 'Nouveau patient', day: 'Vendredi' },
    ],
    '-1': [
      { time: '10:00', patient: 'John Brown', details: 'Consultation de suivi', day: 'Lundi' },
      { time: '11:00', patient: 'Jane Johnson', details: 'Nouveau patient', day: 'Lundi' },
      { time: '09:00', patient: 'Alice Smith', details: 'Consultation de routine', day: 'Mardi' },
      { time: '14:00', patient: 'Bob Doe', details: 'Consultation de suivi', day: 'Mercredi' },
      { time: '10:30', patient: 'Charlie Brown', details: 'Consultation de suivi', day: 'Jeudi' },
      { time: '13:00', patient: 'Eve Smith', details: 'Nouveau patient', day: 'Vendredi' },
    ],
  };

  const handleSlotClick = (slot) => {
    setSelectedSlot(slot);
    onOpen();
  };

  const handleWeekChange = (direction) => {
    setCurrentWeek(currentWeek + direction);
  };

  const handleDayChange = (day) => {
    setSelectedDay(day);
  };

  return (
    <Box mt={{ base: '70px', md: '0px', xl: '0px' }} ml="25px">
      <Flex mb={4} justifyContent="space-between">
        <IconButton icon={<ArrowBackIcon />} onClick={() => handleWeekChange(-1)} />
        <Text fontSize="xl">Semaine {currentWeek === 0 ? 'actuelle' : currentWeek > 0 ? `+${currentWeek}` : currentWeek}</Text>
        <IconButton icon={<ArrowForwardIcon />} onClick={() => handleWeekChange(1)} />
      </Flex>
      <Flex>
        <Box w="20%" p={4} borderRight="1px solid #e2e8f0">
          <Stack spacing={4}>
            {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'].map((day) => (
              <Button
                key={day}
                variant={day === selectedDay ? "solid" : "outline"}
                onClick={() => handleDayChange(day)}
              >
                {day}
              </Button>
            ))}
          </Stack>
        </Box>
        <Box w="80%" p={4}>
          <Flex wrap="wrap">
            {mockData[currentWeek]?.filter(slot => slot.day === selectedDay).map((slot, index) => (
              <Box
                key={index}
                w="300px"
                p={4}
                m={2}
                borderWidth="1px"
                borderRadius="lg"
                onClick={() => handleSlotClick(slot)}
                cursor="pointer"
              >
                <Heading size="md">{slot.time}</Heading>
                <Text>{slot.patient}</Text>
                <Text fontSize="sm" color="gray.500">{slot.day}</Text>
              </Box>
            ))}
          </Flex>
        </Box>
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose} size={'xl'}>
        <ModalOverlay />
        <ModalContent  bg="white" maxWidth="80%">
          <ModalHeader>Détails du Rendez-vous</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Patient : {selectedSlot?.patient}</Text>
            <Text>Détails : {selectedSlot?.details}</Text>
            <Text>Jour : {selectedSlot?.day}</Text>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Fermer</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}