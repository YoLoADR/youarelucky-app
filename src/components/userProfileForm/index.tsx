'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  FormControl,
  SimpleGrid,
  useColorModeValue,
  Select,
  Text,
  Button,
  useToast,
  InputGroup,
  InputLeftElement,
  InputLeftAddon,
  Input,
} from '@chakra-ui/react';
import Card from '@/components/card/Card';
import InputField from '@/components/fields/InputField';
import TextField from '@/components/fields/TextField';
import { NextAvatar } from '@/components/image/Avatar';
import avatarEmpty from '../../../public/img/avatars/avatar_empty.png';
import useUserStore from '@/store/userStore';
import { auth, db, storage } from '@/firebase';
import { useRouter } from 'next/navigation';

const conversionRates = {
  'France': 0.85,
  'Ghana': 12.0,
  'India': 74.0,
  'Kenya': 109.0,
  'Nigeria': 411.0,
  'South Africa': 14.5,
  'United States': 1,
  'United Kingdom': 0.75,
};

const DualCurrencyInputField = ({
  id,
  label,
  placeholder,
  usdValue,
  onUsdChange,
  region,
}) => {
  const localCurrencyValue = usdValue * (conversionRates[region] || 1);

  const handleInputChange = (e) => {
    const value = e.target.value;
    const numericValue = value === '' ? '' : Number(value);
    onUsdChange(numericValue);
  };

  return (
    <Flex direction="column" mb="25px">
      <Text fontWeight="bold" mb="8px">{label}</Text>
      <Flex gap="4">
        <InputGroup>
          <InputLeftElement pointerEvents="none" color="gray.300" fontSize="1.2em">
            $
          </InputLeftElement>
          <Input
            id={`${id}_usd`}
            placeholder={placeholder}
            type="number"
            value={usdValue || ''}
            onChange={handleInputChange}
            min={0}
          />
        </InputGroup>

        <InputGroup>
          <InputLeftAddon>{`Approx. in ${region}`}</InputLeftAddon>
          <Input
            id={`${id}_local`}
            type="number"
            placeholder={placeholder}
            value={localCurrencyValue.toFixed(2)}
            isReadOnly
          />
        </InputGroup>
      </Flex>
    </Flex>
  );
};

const UserProfileForm = () => {
  const { user, setUser } = useUserStore();
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [specialty, setSpecialty] = useState(user?.specialty || '');
  const [experience, setExperience] = useState(user?.experience || '');
  const [address, setAddress] = useState(user?.address || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [region, setRegion] = useState(user?.region || '');
  const [about, setAbout] = useState(user?.about || '');
  const [feeMessaging, setFeeMessaging] = useState(user?.feeMessaging || '');
  const [feeVoiceCall, setFeeVoiceCall] = useState(user?.feeVoiceCall || '');
  const [feeVideoCall, setFeeVideoCall] = useState(user?.feeVideoCall || '');
  const [feeInPerson, setFeeInPerson] = useState(user?.feeInPerson || '');
  const [feeThirdParty, setFeeThirdParty] = useState(user?.feeThirdParty || '');
  const [image, setImage] = useState<File | null>(null);
  const [imageURL, setImageURL] = useState(user?.photoURL || '');

  const textColorPrimary = useColorModeValue('navy.700', 'white');
  const textColorSecondary = 'gray.500';
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

  const pickImage = async () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = () => {
      if (fileInput.files && fileInput.files.length > 0) {
        const file = fileInput.files[0];
        setImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setImageURL(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    };
    fileInput.click();
  };

  const uploadImageToStorage = async (file: File, uid: string): Promise<string> => {
    const storageRef = storage.ref();
    const fileRef = storageRef.child(`profileImages/${uid}/${file.name}`);
    await fileRef.put(file);
    const downloadURL = await fileRef.getDownloadURL();
    return downloadURL;
  };

  const handleSave = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      toast({
        title: 'Error',
        description: 'User not authenticated. Please sign in again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    let finalImageURL = imageURL;

    try {
      if (image) {
        finalImageURL = await uploadImageToStorage(image, currentUser.uid);
      }

      const updatedData = {
        firstName,
        lastName,
        fullName,
        email,
        specialty,
        experience,
        address,
        phoneNumber,
        region,
        about,
        photoURL: finalImageURL,
        feeMessaging,
        feeVoiceCall,
        feeVideoCall,
        feeInPerson,
        feeThirdParty,
        updatedAt: new Date().toISOString(),
      };

      await db.collection('users').doc(currentUser.uid).set(updatedData, { merge: true });

      setUser((prevUser) => ({
        ...prevUser,
        ...updatedData,
      }));

      toast({
        title: 'Profile Updated',
        description: 'Your profile has been updated successfully!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      router.push('/appointment');
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const validateForm = () => {
    return imageURL && region && experience;
  };

  return (
    <Box mt={{ base: '70px', md: '0px', xl: '0px' }} padding="25px">
      <SimpleGrid columns={{ sm: 1, lg: 2 }} spacing="20px" mb="20px">
        <Flex direction="column">
          <Flex direction="column" gap="30px">
            <Card mb="20px" alignItems="center">
              <Flex bg={'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%)'} w="100%" h="129px" borderRadius="16px" />
              <NextAvatar mx="auto" src={imageURL ? imageURL : avatarEmpty} h="87px" w="87px" mt="-43px" mb="15px" />
              <Button mt={2} onClick={pickImage}>
                Upload Image
              </Button>
              <Flex align="center" mx="auto" px="14px" mb="20px">
                <Text color={textColorSecondary} fontSize="sm" fontWeight="500" lineHeight="100%">
                  Select Specialty :
                </Text>
                <Select
                  ms="-4px"
                  w="unset"
                  h="100%"
                  variant="transparent"
                  display="flex"
                  textColor={textColorPrimary}
                  color={textColorPrimary}
                  alignItems="center"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                >
                  <option value="Generalist">Generalist</option>
                  <option value="Ophthalmo">Ophthalmo</option>
                  <option value="Nutritionist">Nutritionist</option>
                  <option value="Neurologist">Neurologist</option>
                  <option value="Pediatric">Pediatric</option>
                  <option value="Radiologist">Radiologist</option>
                  <option value="Others">Others</option>
                </Select>
              </Flex>
            </Card>
          </Flex>
          <FormControl>
            <Card>
              <Flex direction="column" mb="40px">
                <Text fontSize="xl" color={textColorPrimary} mb="6px" fontWeight="bold">
                  Account Settings
                </Text>
                <Text fontSize="md" fontWeight="500" color={textColorSecondary}>
                  Here you can change user account information
                </Text>
              </Flex>
              <SimpleGrid columns={{ sm: 1, md: 2 }} spacing={{ base: '20px', xl: '20px' }}>
                <InputField mb="10px" me="30px" id="first_name" label="First Name" placeholder="Adela" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                <InputField mb="10px" id="last_name" label="Last Name" placeholder="Parkson" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                <InputField mb="10px" me="30px" id="email" label="Email Address" placeholder="hello@youarelucky.ai" value={email} onChange={(e) => setEmail(e.target.value)} />
                <InputField mb="20px" id="full_name" label="Full Name" placeholder="@parkson.adela" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </SimpleGrid>
              <TextField id="about" label="About Me" minH="150px" placeholder="Tell something about yourself in 150 characters!" value={about} onChange={(e) => setAbout(e.target.value)} />
            </Card>
          </FormControl>
        </Flex>
        <Flex direction="column" gap="20px">
          <FormControl>
            <Card mb="20px" pb="50px" h="100%">
              <Flex direction="column" mb="40px">
                <Text fontSize="xl" color={textColorPrimary} mb="6px" fontWeight="bold">
                  Consultation Fees
                </Text>
                <Text fontSize="md" fontWeight="500" color={textColorSecondary}>
                  Please enter your consultation fees for each service.
                </Text>
              </Flex>
              <DualCurrencyInputField
                id="fee_messaging"
                label="Messaging Fee"
                placeholder="Enter fee for messaging consultation"
                usdValue={feeMessaging}
                onUsdChange={setFeeMessaging}
                region={region}
              />
              <DualCurrencyInputField
                id="fee_voice_call"
                label="Voice Call Fee"
                placeholder="Enter fee for voice call consultation"
                usdValue={feeVoiceCall}
                onUsdChange={setFeeVoiceCall}
                region={region}
              />
              <DualCurrencyInputField
                id="fee_video_call"
                label="Video Call Fee"
                placeholder="Enter fee for video call consultation"
                usdValue={feeVideoCall}
                onUsdChange={setFeeVideoCall}
                region={region}
              />
              <DualCurrencyInputField
                id="fee_in_person"
                label="In-Person Consultation Fee"
                placeholder="Enter fee for in-person consultation"
                usdValue={feeInPerson}
                onUsdChange={setFeeInPerson}
                region={region}
              />
              <DualCurrencyInputField
                id="fee_third_party"
                label="Third-Party Consultation Fee"
                placeholder="Enter fee for consultation with third-party assistance (e.g., interpreter or nurse)"
                usdValue={feeThirdParty}
                onUsdChange={setFeeThirdParty}
                region={region}
              />
            </Card>
          </FormControl>
          <FormControl>
            <Card>
              <Flex direction="column" mb="40px">
                <Text fontSize="xl" color={textColorPrimary} mb="6px" fontWeight="bold">
                  Professional Information
                </Text>
                <Text fontSize="md" fontWeight="500" color={textColorSecondary}>
                  Please provide your contact and professional details
                </Text>
              </Flex>
              <Flex flexDirection="column">
                <InputField mb="25px" id="phone_number" label="Phone Number" placeholder="Enter your phone number" type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                <InputField mb="25px" id="address" label="Work Address" placeholder="Enter your address" value={address} onChange={(e) => setAddress(e.target.value)} />
                <FormControl mb="25px">
                  <Text mb="8px" color={textColorPrimary} fontWeight="500">
                    Select Region
                  </Text>
                  <Select placeholder="Select your region" id="region" value={region} onChange={(e) => setRegion(e.target.value)}>
                    {regionOptions.map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <InputField mb="25px" id="experience" label="Years of Experience" placeholder="Enter your years of experience" type="number" value={experience} onChange={(e) => setExperience(Number(e.target.value))} />
              </Flex>
            </Card>
          </FormControl>
        </Flex>
      </SimpleGrid>
      <Button colorScheme="teal" size="lg" w="100%" mt={4} onClick={handleSave} isDisabled={!validateForm()}>
        Save Changes
      </Button>
    </Box>
  );
};

export default UserProfileForm;
