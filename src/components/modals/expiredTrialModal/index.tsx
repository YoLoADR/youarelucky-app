import React from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton, Button, Link, Text, useDisclosure, useColorModeValue, Card, Flex } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { updateSubscription, setUser } from '@/store/userSlice';
import { db, auth } from '@/firebase';

export default function ExpiredTrialModal() {
  const textColor = useColorModeValue('navy.700', 'white');
  const grayColor = useColorModeValue('gray.500', 'gray.500');
  const link = useColorModeValue('brand.500', 'white');

  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);

  const createCheckoutSession = async () => {
    if (!user) return; // Assurez-vous que l'utilisateur est défini

    const docRef = await db
      .collection('customers')
      .doc(user.uid)
      .collection('checkout_sessions')
      .add({
        price: process.env.STRIPE_PRICE_ID, // Remplacez par votre ID de prix Stripe
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
            Trial Expired
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
              Your trial has expired. Upgrade to Premium or contact support for a personalized offer with more credits.
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
                onClick={createCheckoutSession}
              >
                Upgrade to Premium
              </Button>
            </Flex>
            <Link
              color={link}
              fontSize="sm"
              href="https://calendly.com/moamen-elmasry/meet"
              textDecoration="underline !important"
              fontWeight="600"
            >
              Get your customized offer by contacting support
            </Link>
            <Text
              color={grayColor}
              fontWeight="500"
              fontSize="sm"
              mt="10px"
              mb="42px"
              mx="30px"
            >
              * The app will connect to OpenAI API server to check if your API
              Key is working properly.
            </Text>
          </ModalBody>
        </Card>
      </ModalContent>
    </Modal>
  );
}
