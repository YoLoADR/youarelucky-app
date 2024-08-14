'use client';
import React, { ReactNode, useEffect } from 'react';
import '@/styles/App.css';
import { ChakraProvider } from '@chakra-ui/react';
import { useRouter, usePathname } from 'next/navigation';
import { auth, db } from '@/firebase';
import theme from '@/theme/theme';
import useUserStore from '@/store/userStore';
import Spinner from '@/components/Spinner';

export default function AppWrapper({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading, setUser, setLoading } = useUserStore();

  const isPublicPage = () => {
    return pathname?.includes('sign-up') || pathname?.includes('sign-in') || pathname?.includes('fill-your-profile');
  };

  useEffect(() => {
    const initializeApp = async () => {
      setLoading(true);
      try {
        const unsubscribeAuth = auth.onAuthStateChanged(async (firebaseUser) => {
          if (firebaseUser) {
            await fetchUserData(firebaseUser.uid);
          } else {
            handleNoFirebaseUser();
          }
          setLoading(false);
        });

        return () => unsubscribeAuth();
      } catch (error) {
        console.error("Initialization error:", error);
        setLoading(false);
      }
    };

    const fetchUserData = async (uid: string) => {
      try {
        const userDoc = await db.collection('users').doc(uid).get();
        if (userDoc.exists) {
          const firestoreUserData = userDoc.data();
          if (firestoreUserData) {
            // Données utilisateur actuelles depuis le store Zustand
            const currentUser = useUserStore.getState().user;

            // Fusionner les données utilisateur actuelles avec celles récupérées de Firestore
            const updatedUser = {
              ...currentUser,
              ...firestoreUserData,
              uid, // S'assurer que l'UID est bien conservé
            };

            setUser(updatedUser);
          }
        } else {
          console.warn("No user data found in Firestore for uid:", uid);
        }
      } catch (error) {
        console.error("Error fetching user data from Firestore:", error);
      }
    };

    const handleNoFirebaseUser = () => {
      setUser(null);
      if (!isPublicPage()) {
        router.push('/sign-in');
      }
    };

    initializeApp();
  }, [router, pathname, setLoading, setUser]);

  useEffect(() => {
    if (!isLoading && !user && !isPublicPage()) {
      router.push('/sign-in');
    }
  }, [isLoading, user, pathname, router]);

  if (isLoading) {
    return <Spinner />;
  }

  if (!user && !isPublicPage()) {
    return <Spinner />;
  }

  return (
    <ChakraProvider theme={theme}>
      {children}
    </ChakraProvider>
  );
}
