'use client';  // Marque ce composant comme un Client Component

import React, { useState } from 'react';
import { Box, Text, Button, Spinner, useToast, VStack } from '@chakra-ui/react';
import useManageAppointment from '@/hooks/useManageAppointment';
import { useRouter } from 'next/navigation';  // Utilise useRouter de next/navigation

const TestManageAppointment = () => {
  // Utilisation des hooks de manière constante
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
  const router = useRouter();  // Utilisation de useRouter pour la navigation

  // Informations statiques ou mockées
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

  // Gestion de la création d'un rendez-vous
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

  // Gestion de l'annulation d'un rendez-vous
  const handleCancelAppointment = async () => {

    const result = await cancelAppointmentAndMarkDoctorAvailable(
      appointmentId,
      selectedDoctor.id,
      selectedDate,
      selectedHour
    );

    console.log("result", result)

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

  // Gestion du report d'un rendez-vous
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
    await handleGetUserAppointments(); // Fonction pour récupérer les rendez-vous de l'utilisateur

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

  // Récupération des rendez-vous de l'utilisateur
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

  // Gestion de la navigation pour rejoindre un appel vidéo
  const handleJoinVideoCall = () => {
    router.push('/video-call');  // Redirige vers la page du vidéo call
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
