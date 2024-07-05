'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from '@/components/link/Link';
import MessageBoxChat from '@/components/MessageBoxChat';
import { OpenAIModel } from '@/types/types';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  Icon,
  Img,
  Input,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { updateSubscription, setUser } from '@/store/userSlice';
import { db } from '@/firebase';
import { MdAutoAwesome, MdBolt, MdEdit, MdPerson } from 'react-icons/md';
import Bg from '../../public/img/chat/bg-image.png';

export default function Assistant() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isTrialExpired, needMoreCredits, isSubActive, isTrialActive } = useAppSelector((state) => state.user);

  const [inputOnSubmit, setInputOnSubmit] = useState<string>('');
  const [inputCode, setInputCode] = useState<string>('');
  const [outputCode, setOutputCode] = useState<string>('');
  const [model, setModel] = useState<OpenAIModel>('gpt-3.5-turbo');
  const [loading, setLoading] = useState<boolean>(false);
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const inputColor = useColorModeValue('navy.700', 'white');
  const iconColor = useColorModeValue('brand.500', 'white');
  const bgIcon = useColorModeValue(
    'linear-gradient(180deg, #FBFBFF 0%, #CACAFF 100%)',
    'whiteAlpha.200',
  );
  const brandColor = useColorModeValue('brand.500', 'white');
  const buttonBg = useColorModeValue('white', 'whiteAlpha.100');
  const gray = useColorModeValue('gray.500', 'white');
  const buttonShadow = useColorModeValue(
    '14px 27px 45px rgba(112, 144, 176, 0.2)',
    'none',
  );
  const textColor = useColorModeValue('navy.700', 'white');
  const placeholderColor = useColorModeValue(
    { color: 'gray.500' },
    { color: 'whiteAlpha.600' },
  );

  // TODO : quand on s'enregistre il va sur ai-assistant puis il est le redirect sur /demo
  // useEffect(() => {
  //   // Check for an issuer on our user object. If it exists, route them to the dashboard.
  //   (!isSubActive && !isTrialActive) && router.push('/demo');
  //   !user?.email && router.push('/demo');
  // }, [user]);

  const handleTranslate = async () => {
    setInputOnSubmit(inputCode);
    const maxCodeLength = 700;

    if (!inputCode) {
      alert('Please enter your subject.');
      return;
    }
    if (inputCode.length > maxCodeLength) {
      alert(
        `Please enter code less than ${maxCodeLength} characters. You are currently at ${inputCode.length} characters.`,
      );
      return;
    }
    setOutputCode(' ');
    setLoading(true);
    
    const prompt = `You are an artificial intelligence assistant. Answer the following user question precisely and concisely. Do not include any references to sources or documents in your answer: ${inputCode}`
    const response = await fetch(`${process.env.NEXT_PUBLIC_AGENT_AI_v2}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query: prompt })
    }).then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      return response.json();
    }).catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
    });
    console.log('*** response ***', response);

    const data = response?.content;
    const { content, total_tokens } = response && response;
    console.log('*** content format ***', content);
    console.log('*** total_tokens format ***', total_tokens);
    console.log('*** data format ***', data);
    if (!content) {
      setLoading(false);
      alert('Something went wrong');
      return;
    }

    setOutputCode(content);
    setLoading(false);
    updateUserData(total_tokens);
  }

  const handleChange = (Event: any) => { setInputCode(Event.target.value); };

  const updateUserData = async (total_tokens) => {
    if (!user) return;
  
    const userDocRef = db.collection('customers').doc(user.uid);
    const subscriptionsRef = userDocRef.collection('subscriptions');
  
    try {
      const subscriptionsSnapshot = await subscriptionsRef.get();
      let activeSubscription = null;
      let trialSubscription = null;
  
      subscriptionsSnapshot.forEach(doc => {
        const data = doc.data();
        if (data.status === 'active') {
          activeSubscription = { id: doc.id, ...data };
        } else if (data.status === 'trialing') {
          trialSubscription = { id: doc.id, ...data };
        }
      });
  
      if (activeSubscription) {
        const newTokenUsage = (activeSubscription.tokens_used || 0) + total_tokens;
  
        await subscriptionsRef.doc(activeSubscription.id).update({
          tokens_used: newTokenUsage
        });
  
      } else if (trialSubscription) {
        const newTokenUsage = (trialSubscription.trial_tokens_used || 0) + total_tokens;
  
        await subscriptionsRef.doc(trialSubscription.id).update({
          trial_tokens_used: newTokenUsage
        });
      } else {
        console.log('No active or trialing subscription found');
        return;
      }
  
      // Fetch the updated user data from Firestore
      const userDocSnapshot = await userDocRef.get();
      if (userDocSnapshot.exists) {
        const userData = userDocSnapshot.data();
        console.log("Updated user data:", userData);
  
        // Fetch updated subscriptions
        const updatedSubscriptionsSnapshot = await subscriptionsRef.get();
        let updatedSubscriptionsData = [];
        updatedSubscriptionsSnapshot.forEach(doc => {
          updatedSubscriptionsData.push(doc.data());
        });
  
        const updatedUser = {
          ...userData,
          email: user.email,
          displayName: user.displayName,
          phoneNumber: user.phoneNumber,
          photoURL: user.photoURL,
          uid: user.uid,
          providerData: user.providerData,
          subscriptions: updatedSubscriptionsData,
        };
  
        console.log("Updated user data:", updatedUser);
        dispatch(updateSubscription(updatedSubscriptionsData));
        dispatch(setUser(updatedUser));
      }
    } catch (error) {
      console.error('Error updating user data:', error);
      alert('An error occurred while updating the user data. Please try again.');
    }
  }

  return (
    <Flex
      w="100%"
      pt={{ base: '70px', md: '0px' }}
      direction="column"
      position="relative"
    >
      <Img
        src={Bg.src}
        position={'absolute'}
        w="350px"
        left="50%"
        top="50%"
        transform={'translate(-50%, -50%)'}
      />
      <Flex
        direction="column"
        mx="auto"
        w={{ base: '100%', md: '100%', xl: '100%' }}
        minH={{ base: '75vh', '2xl': '85vh' }}
        maxW="1000px"
      >

  <Flex direction={'column'} w="100%" mb={outputCode ? '20px' : 'auto'}>
    {/* Put some content here */}
        </Flex>
      <Flex
          direction="column"
          w="100%"
          mx="auto"
          display={outputCode ? 'flex' : 'none'}
          mb={'auto'}
        >
          <Flex w="100%" align={'center'} mb="10px">
            <Flex
              borderRadius="full"
              justify="center"
              align="center"
              bg={'transparent'}
              border="1px solid"
              borderColor={borderColor}
              me="20px"
              h="40px"
              minH="40px"
              minW="40px"
            >
              <Icon
                as={MdPerson}
                width="20px"
                height="20px"
                color={brandColor}
              />
            </Flex>
            <Flex
              p="22px"
              border="1px solid"
              borderColor={borderColor}
              borderRadius="14px"
              w="100%"
              zIndex={'2'}
            >
              <Text
                color={textColor}
                fontWeight="600"
                fontSize={{ base: 'sm', md: 'md' }}
                lineHeight={{ base: '24px', md: '26px' }}
              >
                {inputOnSubmit}
              </Text>
              <Icon
                cursor="pointer"
                as={MdEdit}
                ms="auto"
                width="20px"
                height="20px"
                color={gray}
              />
            </Flex>
          </Flex>
          <Flex w="100%">
            <Flex
              borderRadius="full"
              justify="center"
              align="center"
              bg={'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%)'}
              me="20px"
              h="40px"
              minH="40px"
              minW="40px"
            >
              <Icon
                as={MdAutoAwesome}
                width="20px"
                height="20px"
                color="white"
              />
            </Flex>
            <MessageBoxChat output={outputCode} />
          </Flex>
        </Flex>
        <Flex
          ms={{ base: '0px', xl: '60px' }}
          mt="20px"
          justifySelf={'flex-end'}
        >
          <Input
            minH="54px"
            h="100%"
            border="1px solid"
            borderColor={borderColor}
            borderRadius="45px"
            p="15px 20px"
            me="10px"
            fontSize="sm"
            fontWeight="500"
            _focus={{ borderColor: 'none' }}
            color={inputColor}
            _placeholder={placeholderColor}
            placeholder="Type your message here..."
            onChange={handleChange}
          />
          <Button
            variant="primary"
            py="20px"
            px="16px"
            fontSize="sm"
            borderRadius="45px"
            ms="auto"
            w={{ base: '160px', md: '210px' }}
            h="54px"
            _hover={{
              boxShadow:
                '0px 21px 27px -10px rgba(96, 60, 255, 0.48) !important',
              bg: 'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%) !important',
              _disabled: {
                bg: 'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%)',
              },
            }}
            onClick={handleTranslate}
            isLoading={loading ? true : false}
          >
            Submit
          </Button>
        </Flex>

        <Flex
          justify="center"
          mt="20px"
          direction={{ base: 'column', md: 'row' }}
          alignItems="center"
        >
          <Text fontSize="xs" textAlign="center" color={gray}>
            MAY is a model of AI language that can produce inaccurate or incomplete information about people, places or facts. Users must verify any information obtained before making decisions. YVEA is not responsible for any errors or omissions in the content provided by MAY.
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
}
