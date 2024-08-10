'use client';  // Ajoute cette ligne en haut du fichier pour marquer ce composant comme un Client Component

import React, { useState } from 'react';
import { Box, Text, Button, Spinner, useToast, VStack } from '@chakra-ui/react';
import useManageAppointment from '@/hooks/useManageAppointment';
import useUserStore from '@/store/userStore';
import { useRouter } from 'next/navigation';  // Utilise next/navigation au lieu de next/router

const TestManageAppointment = () => {
//   const { user } = useUserStore();
  const {
    addAppointmentAndMarkDoctorBusy,
    cancelAppointmentAndMarkDoctorAvailable,
    rescheduleAppointment,
    getUserAppointments,
    isLoading,
    error,
  } = useManageAppointment();
  const [appointmentId, setAppointmentId] = useState(null);
  const toast = useToast();
  const router = useRouter();  // Utilise le hook useRouter pour la navigation

  const selectedDoctor = {
    id: 'b07c2380-4332-48e0-aca1-2265e49e135a',
    fullName: 'Dr. Ravino Lena',
    photoURL: 'https://firebasestorage.googleapis.com/v0/b/merena-yl751.appspot.com/o/profilePictures%2Fdoctor7.jpeg?alt=media&token=4e687fae-85e2-4bd7-9f36-6856ae3cc152',
    speciality: 'Cardiologist',
    address: '123 Main St, City, Country'
  };

  const selectedDate = '2024-11-21';
  const selectedHour = '8:00';
  const newDate = '2024-11-21';
  const newHour = '13:00';
  const patientDetails = {
    bookingFor: 'Self',
    gender: 'Male',
    age: 30,
    problem: 'Chest pain',
    visitReason: 'Routine check-up'
  };

  const selectedPackage = {
    title: 'Video Call',
    price: 199
  };

  const user = {
    uid: 'coUNMhcxJ3VNZLH4NyX2Dt7fn352',
    fullName: 'Tony Dumont',
    email: 'tony.dumont@example.com',
    phoneNumber: '+1234567890',
    dateOfBirth: '1990-01-01',
    address: '456 Elm St, City, Country'
  };


  const handleAddAppointment = async () => {
    const appointment = await addAppointmentAndMarkDoctorBusy(
      selectedDoctor,
      selectedDate,
      selectedHour,
      patientDetails,
      user,
      selectedPackage
    );
    if (appointment) {
      setAppointmentId(appointment.id);
      toast({
        title: 'Success',
        description: 'Appointment successfully created.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } else {
      toast({
        title: 'Error',
        description: error,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleCancelAppointment = async () => {
    if (!appointmentId) {
      toast({
        title: 'Error',
        description: 'No appointment ID found. Please create an appointment first.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const result = await cancelAppointmentAndMarkDoctorAvailable(
      selectedDoctor.id,
      selectedDate,
      selectedHour
    );
    if (result) {
      toast({
        title: 'Success',
        description: 'Appointment successfully canceled.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } else {
      toast({
        title: 'Error',
        description: error,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleRescheduleAppointment = async () => {
    const result = await rescheduleAppointment(
      selectedDoctor.id,
      selectedDate,
      selectedHour,
      newDate,
      newHour,
      selectedDoctor,
      selectedPackage,
      user,
      patientDetails
    );
    if (result) {
      toast({
        title: 'Success',
        description: 'Appointment successfully rescheduled.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } else {
      toast({
        title: 'Error',
        description: error,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleGetUserAppointments = async () => {
    const appointments = await getUserAppointments(user.uid);
    if (appointments.length > 0) {
      toast({
        title: 'Success',
        description: `Found ${appointments.length} appointments.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      console.log(appointments);
    } else {
      toast({
        title: 'No Appointments',
        description: 'No appointments found for this user.',
        status: 'info',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleJoinVideoCall = () => {
    router.push('/video-call');  // Utilise router.push pour rediriger vers la page du vidéo call
  };

  return (
    <Box p={4}>
      {isLoading ? (
        <Spinner size="xl" />
      ) : (
        <VStack spacing={4}>
          <Button onClick={handleAddAppointment} colorScheme="blue">Test Add Appointment</Button>
          <Button onClick={handleCancelAppointment} colorScheme="red">Test Cancel Appointment</Button>
          <Button onClick={handleRescheduleAppointment} colorScheme="yellow">Test Reschedule Appointment</Button>
          <Button onClick={handleGetUserAppointments} colorScheme="green">Test Get User Appointments</Button>
          <Button onClick={handleJoinVideoCall} colorScheme="purple">Join Call</Button>
        </VStack>
      )}
      {error && <Text color="red.500" mt={4}>{error}</Text>}
    </Box>
  );
};

export default TestManageAppointment;
