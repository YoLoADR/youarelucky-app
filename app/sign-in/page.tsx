'use client';

import React, { useState, useEffect } from 'react';
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
  useColorModeValue,
  useToast,
  Link,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { RiEyeCloseLine } from 'react-icons/ri';
import firebase from 'firebase/compat/app';
import { auth, db } from '@/firebase'; // Assurez-vous d'importer firebase correctement
import useUserStore from '@/store/userStore';
import Spinner from '@/components/Spinner'; // Assurez-vous d'avoir un composant Spinner pour indiquer le chargement
import DefaultAuth from '@/components/auth';
import illustration from '/public/img/auth/auth.png';

const googleProvider = new firebase.auth.GoogleAuthProvider(); // Initialisation du provider Google

function SignIn() {
  const textColor = useColorModeValue('navy.700', 'white');
  const textColorSecondary = 'gray.500';
  const textColorDetails = useColorModeValue('navy.700', 'gray.500');
  const textColorBrand = useColorModeValue('brand.500', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const placeholderColor = useColorModeValue(
    { color: 'gray.500', fontWeight: '500' },
    { color: 'whiteAlpha.600', fontWeight: '500' },
  );

  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [isLoginInProgress, setLoginInProgress] = useState(false);
  const [error, setError] = useState('');
  const setUser = useUserStore((state) => state.setUser);
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    // Redirect if user is already signed in
    const currentUser = auth.currentUser;
    if (currentUser) {
      router.push('/appointment');
    }
  }, [router]);

  const handleClick = () => setShow(!show);

  const handleGoogleSignIn = async () => {
    try {
      setLoginInProgress(true);
      const result = await auth.signInWithPopup(googleProvider);
      const user = result.user;
      await handleUserCreation(user);
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      toast({
        title: "Sign-In Error",
        description: "Unable to sign in with Google. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoginInProgress(false);
    }
  };

  const handleSignIn = async () => {
    if (!email || !password) {
      setEmailError(true);
      return;
    }
    try {
      setLoginInProgress(true);
      const result = await auth.signInWithEmailAndPassword(email, password);
      const user = result.user;
      await handleUserCreation(user);
    } catch (error) {
      console.error('Sign-In Error:', error);
      setError('Invalid email or password. Please try again.');
      setEmail('');
      setPassword('');
    } finally {
      setLoginInProgress(false);
    }
  };

  const handleUserCreation = async (firebaseUser) => {
    try {
      const userDoc = await db.collection('users').doc(firebaseUser.uid).get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          ...userData,
        });
        router.push('/appointement');
      } else {
        throw new Error('User data does not exist');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Failed to retrieve user data. Please try again.');
    }
  };

  return (
    <DefaultAuth illustrationBackground={illustration?.src}>
      {isLoginInProgress ? (
        <Flex justifyContent="center" alignItems="center" h="100vh">
          <Spinner />
        </Flex>
      ) : (
        <Flex
          w="100%"
          maxW="max-content"
          mx={{ base: 'auto', lg: '0px' }}
          me="auto"
          h="100%"
          justifyContent="center"
          mb={{ base: '30px', md: '60px' }}
          px={{ base: '25px', md: '0px' }}
          mt={{ base: '40px', md: '12vh' }}
          flexDirection="column"
        >
          <Box me="auto">
            <Text
              color={textColor}
              fontSize={{ base: '34px', lg: '36px' }}
              mb="10px"
              fontWeight={'700'}
            >
              Sign In
            </Text>
            <Text
              mb="36px"
              ms="4px"
              color={textColorSecondary}
              fontWeight="500"
              fontSize="sm"
            >
              Enter your email and password to sign in!
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
              fontSize="md"
              w={{ base: '100%' }}
              h="54px"
              onClick={handleGoogleSignIn}
            >
              <Icon as={FcGoogle} w="20px" h="20px" me="10px" />
              Sign in with Google
            </Button>
            <Flex align="center" mb="25px">
              <Text
                color={textColorSecondary}
                fontWeight="500"
                fontSize="sm"
                mx="14px"
              >
                or
              </Text>
            </Flex>
            <FormControl>
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
                Email<Text color={textColorBrand}>*</Text>
              </FormLabel>
              <Input
                isRequired={true}
                id="email"
                variant="auth"
                fontSize="sm"
                type="email"
                placeholder="Enter your email address"
                mb="24px"
                size="lg"
                borderColor={borderColor}
                h="54px"
                fontWeight="500"
                _placeholder={{ placeholderColor }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <FormLabel
                cursor="pointer"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                htmlFor="pass"
                color={textColor}
                display="flex"
              >
                Password<Text color={textColorBrand}>*</Text>
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
                  borderColor={borderColor}
                  h="54px"
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
              {error && (
                <Text color="red.500" mb="8px" fontSize="sm">
                  {error}
                </Text>
              )}
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
                onClick={handleSignIn}
              >
                Sign In
              </Button>
            </FormControl>
            <Flex justifyContent="center" alignItems="start" maxW="100%" mt="0px">
              <Text color={textColorDetails} fontWeight="500" fontSize="sm">
                Not registered yet?
              </Text>
              <Link href="/sign-up" py="0px" lineHeight={'120%'}>
                <Text
                  color={textColorBrand}
                  fontSize="sm"
                  as="span"
                  ms="5px"
                  fontWeight="600"
                >
                  Create an Account
                </Text>
              </Link>
            </Flex>
          </Flex>
        </Flex>
      )}
    </DefaultAuth>
  );
}

export default SignIn;
