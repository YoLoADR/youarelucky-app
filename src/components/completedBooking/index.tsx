import {
    Box,
    Flex,
    Text,
    Image,
    useColorModeValue,
    useToast,
  } from '@chakra-ui/react';
  import { useEffect, useState, useCallback } from 'react';
  import { db } from '@/firebase';
  import useUserStore from '@/store/userStore';
  import { FaStar } from 'react-icons/fa';
  
  export default function CompletedBooking() {
    const { user } = useUserStore();
    const [bookings, setBookings] = useState([]);
    const toast = useToast();
  
    const fetchBookings = useCallback(() => {
      let unsubscribe;
  
      if (user && user.uid) {
        unsubscribe = db
          .collection('appointments')
          .where('doctorId', '==', user.uid) // Fetch Current DOCTOR
          .where('status', '==', 'Completed')
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
            </Flex>
          </Box>
        ))}
      </Box>
    );
  }
  