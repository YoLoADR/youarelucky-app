'use client';
import React, { ReactNode, useEffect } from 'react';
import '@/styles/App.css';
import { ChakraProvider } from '@chakra-ui/react';
import { useRouter, usePathname } from 'next/navigation';
import { auth } from '@/firebase';
import theme from '@/theme/theme';
import useUserStore from '@/store/userStore';
import Spinner from '@/components/Spinner';

export default function AppWrapper({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading, setUser, setLoading } = useUserStore();

  // Définir isPublicPage avant son utilisation
  const isPublicPage = () => {
    return pathname?.includes('sign-up') || pathname?.includes('sign-in') || pathname?.includes('fill-your-profile');
  };

  useEffect(() => {
    const initializeApp = async () => {
      setLoading(true);
      try {
        const unsubscribeAuth = auth.onAuthStateChanged(async (firebaseUser) => {
          if (firebaseUser) {
            await handleFirebaseUser(firebaseUser);
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

    const handleFirebaseUser = async (firebaseUser) => {
      const { displayName, phoneNumber, photoURL, uid, providerData, email } = firebaseUser;
      // Données utilisateur actuelles depuis le store Zustand
      const currentUser = useUserStore.getState().user;
    
      // Fusionner les nouvelles données utilisateur avec l'état actuel
      const updatedUser = {
        ...currentUser,
        email: email || currentUser.email,
        displayName: displayName || currentUser.displayName,
        phoneNumber: phoneNumber || currentUser.phoneNumber,
        photoURL: photoURL || currentUser.photoURL,
        uid: uid || currentUser.uid,
        providerData: providerData || currentUser.providerData,
      };
    
      setUser(updatedUser);
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
