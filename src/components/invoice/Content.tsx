'use client';

import { Button, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/hooks';
import Card from '@/components/card/Card';
import InvoiceTable from '@/components/invoice/InvoiceTable';
import tableDataInvoice from '@/variables/account/invoice/tableDataInvoice';
import { db } from '@/firebase';

export default function Content(props: { [x: string]: any }) {
  const textColor = useColorModeValue('navy.700', 'white');
  const textSecondaryColor = useColorModeValue('gray.500', 'white');
  const bgCard = useColorModeValue('white', 'navy.700');

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
        success_url: window.location.origin,
        cancel_url: window.location.origin,
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

    docRef.onSnapshot((snap) => {
      const data = snap.data();
      console.log('Checkout session data *****', data);
      const { error, url } = data;
      if (error) {
        console.error(`An error occurred: ${error.message}`);
        alert(`An error occurred: ${error.message}`);
      } else if (url) {
        window.location.assign(url);
      }
    });
  };

  const startTrial = async () => {
    if (!user) return; // Assurez-vous que l'utilisateur est défini
  
    const trialStartDate = new Date();
    const trialEndDate = new Date(trialStartDate.getTime() + 48 * 60 * 60 * 1000); // Ajoutez 48 heures pour la période d'essai
  
    try {
      const userDocRef = db.collection('customers').doc(user.uid);
      const subscriptionsRef = userDocRef.collection('subscriptions');
  
      // Vérifiez si la collection 'subscriptions' existe
      const snapshot = await subscriptionsRef.get();
  
      if (snapshot.empty) {
        // Créez une nouvelle souscription si elle n'existe pas
        await subscriptionsRef.add({
          trial_start: trialStartDate,
          trial_end: trialEndDate,
          trial_tokens_used: 0,
          status: 'trialing',
        });
      } else {
        // Mettez à jour la première souscription trouvée
        const doc = snapshot.docs[0];
        await doc.ref.update({
          trial_start: trialStartDate,
          trial_end: trialEndDate,
          trial_tokens_used: 0,
          status: 'trialing',
        });
      }
  
      router.push('/ai-assistant'); // Redirigez l'utilisateur vers la page de tableau de bord
    } catch (error) {
      console.error('Error starting trial:', error);
      alert('An error occurred while starting the trial. Please try again.');
    }
  };
  

  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    if (!user) return; // Assurez-vous que l'utilisateur est défini
    console.log('Plan page ****', user);
    const unsubscribe = db
      .collection('customers')
      .doc(user.uid)
      .collection('subscriptions')
      .where('status', 'in', ['trialing', 'active'])
      .onSnapshot((snapshot) => {
        if (!snapshot.empty) {
          const doc = snapshot.docs[0];
          console.log('Subscription data', doc.data());
          setSubscription(doc.data());
        } else {
          setSubscription(null);
        }
      });

    // Nettoyage de l'abonnement
    return () => unsubscribe();
  }, [user]); // Dépendance sur l'utilisateur

  return (
    <Flex direction="column" p={{ base: '10px', md: '60px' }}>
      <Card
        bg={bgCard}
        backgroundRepeat="no-repeat"
        p="30px"
        mb="30px"
        mt="-100px"
      >
        <Flex direction={{ base: 'column', md: 'row' }}>
          <Flex direction="column" me="auto">
            <Text color={textColor} fontSize="xl" fontWeight="700">
              Adela Parkson
            </Text>
            <Text
              w="max-content"
              mb="10px"
              fontSize="md"
              color={textSecondaryColor}
              fontWeight="400"
              lineHeight="24px"
            >
              37 Avenue, Boggstown,
              <br /> Indiana, United States 84219
            </Text>
          </Flex>
          <Text my="auto" color={textColor} fontSize="36px" fontWeight="700">
            $39,00
          </Text>
        </Flex>
      </Card>
      <InvoiceTable tableData={tableDataInvoice} />
      <Flex
        flexDirection={{ base: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems="right"
        mt="50px"
      >
        <Button
          variant="red"
          py="20px"
          px="16px"
          fontSize="sm"
          borderRadius="45px"
          w={{ base: '100%', md: '210px' }}
          h="54px"
        >
          Cancel Subscription
        </Button>
        <Button
          variant="primary"
          py="20px"
          px="16px"
          fontSize="sm"
          borderRadius="45px"
          mt={{ base: '20px', md: '0px' }}
          w={{ base: '100%', md: '210px' }}
          h="54px"
          onClick={createCheckoutSession}
        >
          Subscribe
        </Button>
        <Button
          variant="teal"
          py="20px"
          px="16px"
          fontSize="sm"
          borderRadius="45px"
          mt={{ base: '20px', md: '0px' }}
          w={{ base: '100%', md: '210px' }}
          h="54px"
          onClick={startTrial}
        >
          Start Free Trial
        </Button>
      </Flex>
    </Flex>
  );
}
