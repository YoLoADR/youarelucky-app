'use client';
import React, { ReactNode, useEffect } from 'react';
import '@/styles/App.css';
import '@/styles/Contact.css';
import '@/styles/Plugins.css';
import '@/styles/MiniCalendar.css';
import { ChakraProvider } from '@chakra-ui/react';
import { useRouter, usePathname } from 'next/navigation';
import { auth, db } from '@/firebase';
import theme from '@/theme/theme';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { setUser, updateSubscription, setMockMode, setMockUser, setLoading } from '@/store/userSlice';
import { getMockUser, EXPIRED_TRIAL, ACTIVE_NO_CREDITS, ACTIVE_WITH_CREDITS, NEWCOMER, IN_TRIAL } from '@/variables/mockData';
import NewComerModal from '@/components/modals/newComerModal';
import NeedMoreCreditsModal from '@/components/modals/needMoreCreditsModal';
import ExpiredTrialModal from '@/components/modals/expiredTrialModal';
import Spinner from '@/components/Spinner';

export default function AppWrapper({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { mockMode, user, isNewComer, needMoreCredits, isTrialExpired, isLoading } = useAppSelector((state) => state.user);

  useEffect(() => {
    const initializeApp = async () => {
      dispatch(setLoading(true));
      try {
        if (mockMode) {
          initializeMockUser();
        } else {
          await initializeFirebaseUser();
        }
      } catch (error) {
        console.error("Initialization error:", error);
        dispatch(setLoading(false));
      }
    };

    const initializeMockUser = () => {
      const scenario = IN_TRIAL; // Changez le scénario ici (EXPIRED_TRIAL, ACTIVE_NO_CREDITS, ACTIVE_WITH_CREDITS, NEWCOMER, IN_TRIAL)
      const mockUser = getMockUser(scenario);

      if (mockUser) {
        const mockSubscriptions = mockUser.subscriptions;
        dispatch(setMockUser({ user: mockUser, subscriptions: mockSubscriptions }));
      }
      dispatch(setLoading(false)); // Arrêter le chargement une fois les données mock chargées
    };

    const initializeFirebaseUser = async () => {
      const unsubscribeAuth = auth.onAuthStateChanged(async (firebaseUser) => {
        if (firebaseUser) {
          await handleFirebaseUser(firebaseUser);
        } else {
          handleNoFirebaseUser();
        }
        dispatch(setLoading(false)); // Arrêter le chargement une fois les données réelles chargées
      });

      return () => unsubscribeAuth();
    };

    const handleFirebaseUser = async (firebaseUser) => {
      console.log("User is logged in with email:", firebaseUser.email);
      console.log("User auth data :", firebaseUser);

      const { displayName, phoneNumber, photoURL, uid, providerData, email } = firebaseUser;

      const userDocRef = db.collection('customers').doc(uid);
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

        const userdata = {
          ...userData,
          email,
          displayName,
          phoneNumber,
          photoURL,
          uid,
          providerData,
          subscriptions: subscriptionsData,
        };
        console.log("User data:", userdata);
        dispatch(setUser(userdata));
        dispatch(updateSubscription(subscriptionsData));
      }
    };

    const handleNoFirebaseUser = () => {
      console.log("User not logged in");
      dispatch(setUser(null));
      dispatch(updateSubscription([]));
      if (!pathname?.includes('register') && !pathname?.includes('sign-in') && !pathname?.includes('autocompletion')) {
        router.push('/sign-in');
      }
    };

    initializeApp();
  }, [mockMode, router, dispatch, pathname]);

  // Ajout de la gestion de redirection en dehors du rendu JSX
  useEffect(() => {
    if (!isLoading && !user && !pathname?.includes('register') && !pathname?.includes('sign-in') && !pathname?.includes('autocompletion')) {
      router.push('/sign-in');
    }
  }, [isLoading, user, pathname, router]);

  if (isLoading) {
    return <Spinner />;
  }

  if (!user && !pathname?.includes('register') && !pathname?.includes('sign-in') && !pathname?.includes('autocompletion')) {
    return <Spinner />; // Assurez-vous qu'aucune autre partie de l'application ne se rend avant la redirection
  }

  const isAuthPage = pathname?.includes('register') || pathname?.includes('sign-in');

  return (
    <ChakraProvider theme={theme}>
      {!isAuthPage && isNewComer && <NewComerModal />}
      {!isAuthPage && needMoreCredits && <NeedMoreCreditsModal />}
      {!isAuthPage && isTrialExpired && <ExpiredTrialModal />}
      {children}
    </ChakraProvider>
  );
}
