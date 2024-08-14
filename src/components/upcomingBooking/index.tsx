import {
  Box,
  Flex,
  Text,
  Image,
  Button,
  useColorModeValue,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import { useEffect, useState, useCallback, useRef } from 'react';
import { db } from '@/firebase';
import useUserStore from '@/store/userStore';
import { FaStar } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import useAppointmentStore from '@/store/appointmentStore';

export default function UpcomingBooking() {
  const { user } = useUserStore();
  const setCurrentAppointment = useAppointmentStore((state) => state.setCurrentAppointment);
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const cancelRef = useRef();
  const toast = useToast();

  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');

  const fetchBookings = useCallback(() => {
    let unsubscribe;

    if (user && user.uid) {
      unsubscribe = db
        .collection('appointments')
        .where('doctorId', '==', user.uid)
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
      if (unsubscribe) unsubscribe();
    };
  }, [user, toast]);

  useEffect(() => {
    const unsubscribe = fetchBookings();
    return () => unsubscribe && unsubscribe();
  }, [fetchBookings]);

  const handleCancelAppointment = async (appointment) => {
    try {
      // Logique d'annulation de rendez-vous
      const appointmentRef = db.collection('appointments').doc(appointment.id);
      await appointmentRef.update({ status: 'Cancelled' });

      setBookings((prevBookings) =>
        prevBookings.filter((booking) => booking.id !== appointment.id)
      );

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


  const handleJoinCall = (item: { date: string; time: string }) => {
    const appointmentTime : Date  = new Date(`${item.date}T${item.time}`);
    const currentTime : Date = new Date();
    const timeDifference = (appointmentTime.getTime() - currentTime.getTime()) / 1000 / 60; // Différence en minutes

    if (timeDifference <= 20) {
      setCurrentAppointment(item);
      router.push('/video-call');
    } else {
      setSelectedAppointment(item);
      setIsAlertOpen(true);
    }
  };

  const closeAlert = () => {
    setIsAlertOpen(false);
    setSelectedAppointment(null);
  };

  const bg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  return (
    <Box>
      {bookings.map((item) => (
        <Box
          key={item.id}
          borderRadius="lg"
          bg={bg}
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
                <Text color={textColor}>
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
            <Flex>
              <Button
                variant="primary"
                py="20px"
                px="16px"
                fontSize="sm"
                borderRadius="45px"
                mt={{ base: '20px', md: '0px' }}
                w="100%"
                h="54px"
                mb="24px"
                mr="10px"
                onClick={() => handleJoinCall(item)}
              >
                Join Call Appointment
              </Button>
              <Button
                variant="transparent"
                border="1px solid"
                borderColor={borderColor}
                borderRadius="45px"
                ms="auto"
                mb="30px"
                fontSize="md"
                w={{ base: '100%' }}
                h="54px"
                onClick={() => handleCancelAppointment(item)}
              >
                Cancel Appointment
              </Button>
            </Flex>
          </Flex>
        </Box>
      ))}

      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={closeAlert}
      >
        <AlertDialogOverlay>
          <AlertDialogContent backgroundColor="white">
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Too Early to Join
            </AlertDialogHeader>

            <AlertDialogBody>
              You can only join the call a few minutes before the scheduled time. Please try again later.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={closeAlert}>
                OK
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}
