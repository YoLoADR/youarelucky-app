// DoctorDashboard.js
'use client';
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { setUser } from '@/store/userSlice';
import {
  Box, Button, Stack, Text, Flex, Heading, IconButton
} from '@chakra-ui/react';
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import { mockSlots } from '@/variables/demoPlanning';
import AppointmentModal from '@/components/modals/appointmentModal';

export default function DoctorDashboard() {
  const { user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [currentWeek, setCurrentWeek] = useState(0); // 0 = cette semaine, -1 = semaine dernière, 1 = semaine prochaine
  const [selectedDay, setSelectedDay] = useState('Lundi'); // Par défaut, le jour sélectionné est lundi

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleSlotClick = (slot) => {
    setSelectedSlot(slot);
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
            {mockSlots[currentWeek]?.filter(slot => slot.day === selectedDay).map((slot, index) => (
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
                <Text>{slot.patientId}</Text>
                <Text fontSize="sm" color="gray.500">{slot.day}</Text>
              </Box>
            ))}
          </Flex>
        </Box>
      </Flex>
      {selectedSlot && <AppointmentModal slot={selectedSlot} onClose={() => setSelectedSlot(null)} />}
    </Box>
  );
}
