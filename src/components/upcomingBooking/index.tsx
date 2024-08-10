import {
    Box,
    Flex,
    Text,
    Image,
    Button,
    useColorModeValue,
    useToast,
  } from '@chakra-ui/react';
  import { useEffect, useState } from 'react';
  import { db } from '@/firebase';
  import useUserStore from '@/store/userStore';
  import { FaStar } from 'react-icons/fa';
  
  export default function UpcomingBooking() {
    const { user } = useUserStore();
    const [bookings, setBookings] = useState([]);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const toast = useToast();
  
    useEffect(() => {
      let unsubscribe;
  
      if (user && user.uid) {
        unsubscribe = db
          .collection('appointments')
          .where('userId', '==', user.uid)
          .where('status', '==', 'Scheduled')
          .onSnapshot(
            (snapshot) => {
              const fetchedBookings = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }));
              setBookings(fetchedBookings);
            },
            (error) => {
              console.error('Error fetching appointments in real-time: ', error);
              toast({
                title: 'Error',
                description: 'Failed to load bookings.',
                status: 'error',
                duration: 5000,
                isClosable: true,
              });
            }
          );
      }
  
      return () => {
        if (unsubscribe) unsubscribe(); // Cleanup the listener on unmount
      };
    }, [user, toast]);
  
    const handleCancelAppointment = async (appointment) => {
      try {
        // Logique d'annulation de rendez-vous
        // ...
  
        setBookings((prevBookings) =>
          prevBookings.filter((booking) => booking.id !== appointment.id)
        );
        setSelectedAppointment(null);
        toast({
          title: 'Success',
          description: 'Appointment successfully canceled.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } catch (err) {
        console.error('Error during appointment cancellation:', err.message);
        toast({
          title: 'Error',
          description: 'An unexpected error occurred.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };
  
    return (
      <Box>
        {bookings.map((item) => (
          <Box
            key={item.id}
            borderRadius="lg"
            bg={useColorModeValue('white', 'gray.700')}
            p={4}
            mb={4}
            boxShadow="md"
          >
            <Flex justifyContent="space-between" alignItems="center">
              <Flex alignItems="center">
                <Image
                  src={item.image}
                  alt={item.doctor}
                  borderRadius="lg"
                  boxSize="88px"
                  mr={4}
                />
                <Box>
                  <Text fontWeight="bold" fontSize="lg">
                    {item.doctor}
                  </Text>
                  <Text color={useColorModeValue('gray.600', 'gray.400')}>
                    {item.package} - {item.date} - {item.time}
                  </Text>
                  <Flex alignItems="center">
                    <FaStar color="orange" size={12} />
                    <Text ml={1} fontSize="sm" color="gray.500">
                      {item.status}
                    </Text>
                  </Flex>
                </Box>
              </Flex>
              <Button
                colorScheme="red"
                onClick={() => handleCancelAppointment(item)}
              >
                Cancel Appointment
              </Button>
            </Flex>
          </Box>
        ))}
      </Box>
    );
  }
  