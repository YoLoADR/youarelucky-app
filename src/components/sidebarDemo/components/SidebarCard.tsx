'use client';

import {
  Button,
  Flex,
  Link,
  Img,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import logoWhite from '../../../../public/img/layout/logoWhite.png';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { updateSubscription } from '@/store/userSlice';
import { db } from '@/firebase';

export default function SidebarDocs() {
  const bgColor = 'linear-gradient(135deg, #868CFF 0%, #4318FF 100%)';
  const borderColor = useColorModeValue('white', 'navy.800');
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, isNewComer, needMoreCredits, isSubActive, isTrialActive, isTrialExpired } = useAppSelector((state) => state.user);

  const handleTrial = async () => {
    if (!user) {
      console.log('User is not defined.');
      return;
    }

    const userDocRef = db.collection('customers').doc(user.uid);
    const subscriptionsRef = userDocRef.collection('subscriptions');
    
    // Vérifiez si l'utilisateur a déjà eu une période d'essai ou un abonnement
    const subscriptionsSnapshot = await subscriptionsRef.get();
    const hasHadTrialOrSubscription = subscriptionsSnapshot.docs.some(doc => {
      const data = doc.data();
      return data.status === 'trialing' || data.status === 'active' || data.trial_end;
    });

    if (hasHadTrialOrSubscription) {
      console.log('User already had a trial or has an active subscription.');
      return;
    }

    const trialStartDate = new Date();
    const trialEndDate = new Date(trialStartDate.getTime() + 48 * 60 * 60 * 1000); // Ajoutez 48 heures pour la période d'essai

    try {
      // Créez une nouvelle souscription
      await subscriptionsRef.add({
        trial_start: trialStartDate,
        trial_end: trialEndDate,
        trial_tokens_used: 0,
        status: 'trialing',
      });

      // Mettez à jour l'état de l'utilisateur directement
      const updatedSubscriptions = [...user.subscriptions, {
        trial_start: trialStartDate,
        trial_end: trialEndDate,
        trial_tokens_used: 0,
        status: 'trialing',
      }];
      
      dispatch(updateSubscription(updatedSubscriptions));

      router.push('/ai-assistant'); // Redirigez l'utilisateur vers la page de tableau de bord
    } catch (error) {
      console.error('Error starting trial:', error);
      alert('An error occurred while starting the trial. Please try again.');
    }
  }

  const createCheckoutSession = async () => {
    if (!user) return; // Assurez-vous que l'utilisateur est défini

    const docRef = await db
      .collection('customers')
      .doc(user.uid)
      .collection('checkout_sessions')
      .add({
        price: "price_1PRp5VRrQ0CdHV8OpkMpHbmk", // Remplacez par votre ID de prix Stripe
        success_url: `${window.location.origin}/ai-assistant`,
        cancel_url: `${window.location.origin}/ai-assistant`,
        mode: 'subscription',
        subscription_data: {
          trial_settings: {
            end_behavior: {
              missing_payment_method: 'pause',
            },
          },
          trial_period_days: 2,
        },
      });

    docRef.onSnapshot(async (snap) => {
      const data = snap.data();
      console.log('Checkout session data *****', data);
      const { error, url } = data;
      if (error) {
        console.error(`An error occurred: ${error.message}`);
        alert(`An error occurred: ${error.message}`);
      } else if (url) {
        window.location.assign(url);
      }

      // Mettez à jour les informations de l'utilisateur dans la base de données
      const userDocRef = db.collection('customers').doc(user.uid);
      const userDocSnapshot = await userDocRef.get();

      if (userDocSnapshot.exists) {
        const userData = userDocSnapshot.data();
        console.log("UserDocSnapshot data:", userData);
        const subscriptionsSnapshot = await userDocRef.collection('subscriptions')
          .where('status', 'in', ['trialing', 'active'])
          .get();
        
        let subscriptionsData = [];
        subscriptionsSnapshot.forEach(doc => {
          subscriptionsData.push(doc.data());
        });

        const updatedUser = {
          ...userData,
          email: user.email,
          displayName: user.displayName,
          phoneNumber: user.phoneNumber,
          photoURL: user.photoURL,
          uid: user.uid,
          providerData: user.providerData,
          subscriptions: subscriptionsData,
        };
        
        console.log("Updated user data:", updatedUser);
        dispatch(updateSubscription(subscriptionsData));
      }
    });
  };

  return (
    <Flex
      justify="center"
      direction="column"
      align="center"
      bg={bgColor}
      borderRadius="16px"
      position="relative"
    >
      <Flex
        border="5px solid"
        borderColor={borderColor}
        bg="linear-gradient(135deg, #868CFF 0%, #4318FF 100%)"
        borderRadius="50%"
        w="80px"
        h="80px"
        align="center"
        justify="center"
        mx="auto"
        position="absolute"
        left="50%"
        top="-47px"
        transform="translate(-50%, 0%)"
      >
        <Img src={logoWhite.src} w="40px" h="40px" />
      </Flex>
      <Flex
        direction="column"
        mb="12px"
        align="center"
        justify="center"
        px="15px"
        pt="55px"
      >
        <Text
          fontSize={{ base: 'lg', xl: '18px' }}
          color="white"
          fontWeight="bold"
          lineHeight="150%"
          textAlign="center"
          mb="14px"
        >
          Go unlimited with PREMIUM
        </Text>
        <Text fontSize="14px" color={'white'} mb="14px" textAlign="center">
          Elevate your productivity to new heights with YouAreLucky AI Copilot and start achieving more today!
        </Text>
      </Flex>
      { isNewComer && (
        <Button
          bg="whiteAlpha.300"
          _hover={{ bg: 'whiteAlpha.200' }}
          _active={{ bg: 'whiteAlpha.100' }}
          mb={{ sm: '16px', xl: '24px' }}
          color={'white'}
          fontWeight="regular"
          fontSize="sm"
          minW="185px"
          mx="auto"
          borderRadius="45px"
          onClick={() => handleTrial()}
        >
          Start Free Trial
        </Button>
      )}

      { !isNewComer && needMoreCredits && (
        <Link href="https://calendly.com/moamen-elmasry/meet" isExternal>
          <Button
            bg="whiteAlpha.300"
            _hover={{ bg: 'whiteAlpha.200' }}
            _active={{ bg: 'whiteAlpha.100' }}
            mb={{ sm: '16px', xl: '24px' }}
            color={'white'}
            fontWeight="regular"
            fontSize="sm"
            minW="185px"
            mx="auto"
            borderRadius="45px"
          >
            Buy more credits...
          </Button>
        </Link>  
      )}

    {!isNewComer && !isSubActive && (isTrialActive || isTrialExpired) && !needMoreCredits && (
        <Button
          bg="whiteAlpha.300"
          _hover={{ bg: 'whiteAlpha.200' }}
          _active={{ bg: 'whiteAlpha.100' }}
          mb={{ sm: '16px', xl: '24px' }}
          color={'white'}
          fontWeight="regular"
          fontSize="sm"
          minW="185px"
          mx="auto"
          borderRadius="45px"
          onClick={createCheckoutSession}
        >
          Get started with PREMIUM
        </Button>
      )}
    </Flex>
  );
}
