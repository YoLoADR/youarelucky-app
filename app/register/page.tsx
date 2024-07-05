'use client';

// Chakra imports
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  Link,
  useColorModeValue,
  Checkbox,
} from '@chakra-ui/react';
import illustration from '/public/img/auth/auth.png';
import { HSeparator } from '@/components/separator/Separator';
import DefaultAuth from '@/components/auth';
import React, { useState, useEffect } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { RiEyeCloseLine } from 'react-icons/ri';
import { auth, db } from '@/firebase';
import firebase from 'firebase/compat/app';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { setUser } from '@/store/userSlice';

const googleProvider = new firebase.auth.GoogleAuthProvider();

function SignUp() {
  // Chakra color mode
  const textColor = useColorModeValue('navy.700', 'white');
  const textColorSecondary = 'gray.500';
  const textColorDetails = useColorModeValue('navy.700', 'gray.500');
  const textColorBrand = useColorModeValue('brand.500', 'white');
  const brandStars = useColorModeValue('brand.500', 'brand.400');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const placeholderColor = useColorModeValue(
    { color: 'gray.500', fontWeight: '500' },
    { color: 'whiteAlpha.600', fontWeight: '500' },
  );
  const [isChecked, setIsChecked] = useState(false);
  const handleCheckboxChange = () => setIsChecked(!isChecked);
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [isLoginInProgress, setLoginInProgress] = useState(false);

  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, isSubActive, isTrialActive } = useAppSelector((state) => state.user);

  //Listening redux store to user changes
  useEffect(() => {
    if (isSubActive && isTrialActive) {
      console.log('User is present, redirecting to /ai-assistant', `isSubActive : ${isSubActive} isTrialActive : ${isTrialActive}`);
      router.push('/ai-assistant');
    } else if (user) {
      console.log('Subscription and trial are active, redirecting to /ai-assistant, user :', user);
      router.push('/ai-assistant');
    }
  }, [user, isSubActive, isTrialActive, router]);

  // Gestion de la connexion Google
  const handleGoogleSignIn = async () => {
    try {
      setLoginInProgress(true);
      const result = await auth.signInWithPopup(googleProvider);
      const user = result.user;
      console.log('Google Sign-In User:', user);
      await handleUserCreation(user);
    } catch (error) {
      console.error('Google Sign-In Error:', error);
    } finally {
      setLoginInProgress(false);
    }
  };

  const handleSignUp = async () => {
    if (!email || !password) {
      setEmailError(true);
      return;
    }
    try {
      setLoginInProgress(true);
      const result = await auth.createUserWithEmailAndPassword(email, password);
      const user = result.user;
      console.log('User signed up and signed in: ', user, "Name :", name, "Email :", user.email);
      await handleUserCreation(user);
    } catch (error) {
      console.error('Sign up error: ', error);
      setEmail('');
      setPassword('');
    } finally {
      setLoginInProgress(false);
    }
  };

  // Fonction pour créer ou récupérer les informations de l'utilisateur dans Firebase
  const handleUserCreation = async (firebaseUser) => {
    const { displayName, phoneNumber, photoURL, uid, providerData, email } = firebaseUser;
    const userdata = {
      email,
      displayName,
      phoneNumber,
      photoURL,
      uid,
      providerData,
    };
    console.log("User data:", userdata);
    dispatch(setUser(userdata));
  };

  return (
    <DefaultAuth illustrationBackground={illustration?.src}>
      <Flex
        w="100%"
        maxW="max-content"
        mx={{ base: 'auto', lg: '0px' }}
        me="auto"
        h="100%"
        justifyContent="center"
        mb={{ base: '30px', md: '60px' }}
        px={{ base: '25px', md: '0px' }}
        mt={{ base: '40px', md: '8vh' }}
        flexDirection="column"
      >
        <Box me="auto">
          <Text
            fontWeight={'700'}
            color={textColor}
            fontSize={{ base: '34px', lg: '36px' }}
            mb="10px"
          >
            Create account
          </Text>
          <Text
            mb="36px"
            ms="4px"
            color={textColorSecondary}
            fontWeight="500"
            fontSize="sm"
          >
            Enter your credentials to create your account!
          </Text>
        </Box>
        <Flex
          zIndex="2"
          direction="column"
          w={{ base: '100%', md: '420px' }}
          maxW="100%"
          background="transparent"
          borderRadius="15px"
          mx={{ base: 'auto', lg: 'unset' }}
          me="auto"
          mb={{ base: '20px', md: 'auto' }}
        >
          <Button
            variant="transparent"
            border="1px solid"
            borderColor={borderColor}
            borderRadius="14px"
            ms="auto"
            mb="30px"
            fontSize="sm"
            w={{ base: '100%' }}
            h="54px"
            onClick={handleGoogleSignIn}
            isDisabled={!isChecked}
          >
            <Icon as={FcGoogle} w="20px" h="20px" me="10px" />
            Continue with Google
          </Button>
          <Flex align="center" mb="25px">
            <HSeparator />
            <Text
              color={textColorSecondary}
              fontWeight="500"
              fontSize="sm"
              mx="14px"
            >
              or
            </Text>
            <HSeparator />
          </Flex>
          <FormControl>
            <FormLabel
              cursor="pointer"
              htmlFor="name"
              display="flex"
              ms="4px"
              fontSize="sm"
              fontWeight="500"
              color={textColor}
              mb="8px"
            >
              Name<Text color={brandStars}>*</Text>
            </FormLabel>
            <Input
              isRequired={true}
              variant="auth"
              id="name"
              fontSize="sm"
              type="text"
              placeholder="Enter your name"
              mb="24px"
              size="lg"
              borderColor={borderColor}
              h="54px"
              _placeholder={{ placeholderColor }}
              fontWeight="500"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <FormLabel
              cursor="pointer"
              display="flex"
              ms="4px"
              htmlFor="email"
              fontSize="sm"
              fontWeight="500"
              color={textColor}
              mb="8px"
            >
              Email<Text color={brandStars}>*</Text>
            </FormLabel>
            <Input
              isRequired={true}
              id="email"
              variant="auth"
              fontSize="sm"
              type="email"
              borderColor={borderColor}
              placeholder="Enter your email address"
              mb="24px"
              size="lg"
              _placeholder={{ placeholderColor }}
              h="54px"
              fontWeight="500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {/* PASSWORD */}
            <FormLabel
              cursor="pointer"
              ms="4px"
              fontSize="sm"
              fontWeight="500"
              htmlFor="pass"
              color={textColor}
              display="flex"
            >
              Password<Text color={brandStars}>*</Text>
            </FormLabel>
            <InputGroup size="md">
              <Input
                isRequired={true}
                variant="auth"
                id="pass"
                fontSize="sm"
                placeholder="Enter your password"
                mb="24px"
                size="lg"
                h="54px"
                borderColor={borderColor}
                fontWeight="500"
                _placeholder={{ placeholderColor }}
                type={show ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <InputRightElement display="flex" alignItems="center" mt="4px">
                <Icon
                  color={textColorSecondary}
                  _hover={{ cursor: 'pointer' }}
                  as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                  onClick={handleClick}
                />
              </InputRightElement>
            </InputGroup>

            <Flex justifyContent="space-between" align="center" mb="24px">
              <FormControl display="flex" alignItems="center">
                <Checkbox
                  id="remember-login"
                  colorScheme="brandScheme"
                  me="10px"
                  isChecked={isChecked}
                  onChange={handleCheckboxChange}
                />
                <FormLabel
                  htmlFor="remember-login"
                  mb="0"
                  color={textColor}
                  fontWeight="500"
                  fontSize="sm"
                >
                  By creating an account, you agree to our{' '}
                  <Link
                    href="https://www.youarelucky.ai/fr/contracts-cgu"
                    py="0px"
                    lineHeight={'120%'}
                    fontWeight="600"
                    isExternal
                  >
                    {' '}
                    Terms of Service
                  </Link>
                  ,{' '}
                  <Link
                    href="https://www.youarelucky.ai/fr/contracts-cgv"
                    py="0px"
                    lineHeight={'120%'}
                    fontWeight="600"
                    isExternal
                  >
                    Privacy Policy
                  </Link>{' '}
                  and{' '}
                  <Link
                    href="https://www.youarelucky.ai/fr/mentions-legales"
                    py="0px"
                    lineHeight={'120%'}
                    fontWeight="600"
                    isExternal
                  >
                    Disclaimer
                  </Link>
                  .
                </FormLabel>
              </FormControl>
            </Flex>
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
              isDisabled={!isChecked}
              onClick={() => handleSignUp()}
            >
              Create your Account
            </Button>
          </FormControl>
          <Flex justifyContent="center" alignItems="start" maxW="100%" mt="0px">
            <Text color={textColorDetails} fontWeight="500" fontSize="sm">
              Already have an account?
            </Text>
            <Link href="/sign-in" py="0px" lineHeight={'120%'}>
              <Text
                color={textColorBrand}
                fontSize="sm"
                as="span"
                ms="5px"
                fontWeight="600"
              >
                Login here
              </Text>
            </Link>
          </Flex>
        </Flex>
      </Flex>
    </DefaultAuth>
  );
}

export default SignUp;
