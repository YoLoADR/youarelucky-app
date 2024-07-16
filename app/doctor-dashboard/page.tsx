'use client';
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { setUser } from '@/store/userSlice';
import {
  Box, Button, Stack, Text, Flex, Heading, Avatar, IconButton, AvatarGroup, Badge
} from '@chakra-ui/react';
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import AppointmentModal from '@/components/modals/appointmentModal';

const fetchMockData = async () => {
  const response = await fetch('/api/mockSlotsAPI');
  const data = await response.json();
  return data;
};

const consultationTypeColors = {
  '1er visite': 'blue',
  'nouveau cas': 'green',
  'examen complémentaire': 'yellow',
  'suivi': 'red'
};

export default function DoctorDashboard() {
  const { user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [currentWeek, setCurrentWeek] = useState(0); // 0 = cette semaine, -1 = semaine dernière, 1 = semaine prochaine
  const [selectedDay, setSelectedDay] = useState('Lundi'); // Par défaut, le jour sélectionné est lundi
  const [mockSlots, setMockSlots] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const slots = await fetchMockData();
      setMockSlots(slots);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleSlotClick = (slot) => {
    setSelectedSlot(slot);
  };

  const handleWeekChange = (direction) => {
    setCurrentWeek(currentWeek + direction);
  };

  const handleDayChange = (day) => {
    setSelectedDay(day);
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

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
                <Flex justifyContent="space-between" alignItems="center">
                  <Heading size="md">{slot.time}</Heading>
                    <Badge
                      colorScheme={consultationTypeColors[slot.consultationType]}
                      maxW="140px"  // Définissez une largeur maximale appropriée
                      whiteSpace="normal"
                      textAlign="right"
                    >
                      {slot.consultationType}
                    </Badge>
                </Flex>
                <Flex align="center" mt={2}>
                  <Avatar src={slot.patientAvatar} size="sm" mr={2} />
                  <Text>{slot.patientName}</Text>
                </Flex>
                <Flex mt={2} justifyContent="flex-end">
                  <Text size="sm">Praticiens : </Text> 
                  <AvatarGroup size="sm" max={2}>
                    {slot.practitioners.map((practitioner, idx) => (
                      <Avatar key={idx} src={practitioner.avatar} size="sm" />
                    ))}
                  </AvatarGroup>
                </Flex>
              </Box>
            ))}
          </Flex>
        </Box>
      </Flex>
      {selectedSlot && <AppointmentModal slot={selectedSlot} onClose={() => setSelectedSlot(null)} />}
    </Box>
  );
}
