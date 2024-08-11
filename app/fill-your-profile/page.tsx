'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Text,
  useToast,
  Avatar,
  Select,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import useUserStore from '@/store/userStore';
import { auth, db } from '@/firebase';

const FillYourProfile = () => {
  const { user, setUser } = useUserStore();
  const [image, setImage] = useState(user?.photoURL || '');
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [nickname, setNickname] = useState(user?.nickname || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [selectedRegion, setSelectedRegion] = useState(user?.region || '');
  const [error, setError] = useState(null);
  const toast = useToast();
  const router = useRouter();

  const regionOptions = [
    'France',
    'Ghana',
    'India',
    'Kenya',
    'Nigeria',
    'South Africa',
    'United States',
    'United Kingdom',
  ];

  useEffect(() => {
    if (error) {
      toast({
        title: 'An error occurred.',
        description: error,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [error, toast]);

  const pickImage = async () => {
    // Utilisation d'un input de fichier pour le web
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = () => {
      if (fileInput.files && fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
          setImage(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    };
    fileInput.click();
  };

  const handleContinue = async () => {
    if (!fullName || !selectedRegion) {
      toast({
        title: 'Error',
        description: 'Please provide your full name and select a region.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const currentUser = auth.currentUser;
    const userData = {
      fullName,
      nickname,
      phoneNumber,
      region: selectedRegion,
      photoURL: image,
    };

    try {
      await db.collection('users').doc(currentUser.uid).set(userData, { merge: true });
      setUser(userData); // Mettre à jour Zustand store
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been updated successfully!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      router.push('/dashboard');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Flex direction="column" align="center" justify="center" minH="100vh">
      <Box w="100%" maxW="md" p={8} borderWidth={1} borderRadius={8} boxShadow="lg">
        <Text fontSize="2xl" fontWeight="bold" mb={4}>
          Fill Your Profile
        </Text>
        <FormControl mb={4}>
          <Flex direction="column" align="center" mb={4}>
            <Avatar size="xl" src={image || user?.photoURL} />
            <Button mt={2} onClick={pickImage}>
              Upload Image
            </Button>
          </Flex>
          <FormLabel>Full Name</FormLabel>
          <Input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter your full name"
          />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Nickname</FormLabel>
          <Input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Enter your nickname"
          />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Phone Number</FormLabel>
          <Input
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter your phone number"
          />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Select Region</FormLabel>
          <Select
            placeholder="Select your region"
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
          >
            {regionOptions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </Select>
        </FormControl>
        <Button colorScheme="teal" size="lg" w="100%" onClick={handleContinue}>
          Continue
        </Button>
      </Box>
    </Flex>
  );
};

export default FillYourProfile;
