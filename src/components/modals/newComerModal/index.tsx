import React from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton, Button, Link, Text, useDisclosure, useColorModeValue, Card, Flex } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { updateSubscription, setUser } from '@/store/userSlice';
import { db, auth } from '@/firebase';

export default function NewComerModal() {
  const textColor = useColorModeValue('navy.700', 'white');
  const grayColor = useColorModeValue('gray.500', 'gray.500');
  const link = useColorModeValue('brand.500', 'white');

  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);

  const logout = async () => {
    try {
      await auth.signOut();
      console.log("User logged out successfully");
      dispatch(setUser(null));
      router.push('/sign-in');
      localStorage.setItem('token', '');
    } catch (error) {
      console.error("Logout failed: ", error);
    }
  };

  const handleStartTrial = async () => {
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
  };

  return (
    <Modal blockScrollOnMount={false} isOpen={true} onClose={() => logout()}>
      <ModalOverlay />
      <ModalContent bg="none" boxShadow="none">
        <Card textAlign={'center'}>
          <ModalHeader
            fontSize="22px"
            fontWeight={'700'}
            mx="auto"
            textAlign={'center'}
            color={textColor}
          >
            Welcome to YouAreLucky AI Copilot
          </ModalHeader>
          <ModalCloseButton _focus={{ boxShadow: 'none' }} />
          <ModalBody p="0px">
            <Text
              color={grayColor}
              fontWeight="500"
              fontSize="md"
              lineHeight="28px"
              mb="22px"
            >
              Start your free trial to experience the full capabilities of YouAreLucky AI Copilot.
            </Text>
            <Flex justifyContent="center" mb="20px">
              <Button
                variant="chakraLinear"
                py="20px"
                px="16px"
                fontSize="sm"
                borderRadius="45px"
                mb={{ base: '20px', md: '0px' }}
                w={{ base: '300px', md: '180px' }}
                h="54px"
                onClick={handleStartTrial}
              >
                Start Free Trial
              </Button>
            </Flex>
            <Link
              color={link}
              fontSize="sm"
              href="https://calendly.com/moamen-elmasry/meet"
              textDecoration="underline !important"
              fontWeight="600"
            >
              Learn more about YouAreLucky AI Copilot
            </Link>
            <Text
              color={grayColor}
              fontWeight="500"
              fontSize="sm"
              mt="10px"
              mb="42px"
              mx="30px"
            >
              * The app will connect to OpenAI API server to check if your API Key is working properly.
            </Text>
          </ModalBody>
        </Card>
      </ModalContent>
    </Modal>
  );
}
