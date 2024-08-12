import { create } from 'zustand';

interface UserState {
  user: any;
  subscriptions: any[];
  isLoading: boolean;
  setUser: (user: any) => void;
  setSubscriptions: (subscriptions: any[]) => void;
  setLoading: (isLoading: boolean) => void;
}

const useUserStore = create<UserState>((set) => ({
  user: {
    fullName: '',
    email: '',
    nickname: '',
    phoneNumber: '',
    photoURL: '',
    gender: 'other',
    dateOfBirth: '',
    region: '', // Région de l'utilisateur
    specialty: '', // Spécialité de l'utilisateur
    experience: '', // Années d'expérience
    address: '', // Adresse du travail
    about: '', // À propos de l'utilisateur
    feeMessaging: '', // Frais de messagerie
    feeVoiceCall: '', // Frais d'appel vocal
    feeVideoCall: '', // Frais d'appel vidéo
    feeInPerson: '', // Frais de consultation en personne
    feeThirdParty: '', // Frais de consultation avec tiers
  },
  setUser: (userData) => set((state) => ({
    user: {
      ...state.user,
      ...userData,
    }
  })),
  subscriptions: [],
  isLoading: false,
  setSubscriptions: (subscriptions) => set({ subscriptions }),
  setLoading: (isLoading) => set({ isLoading }),
}));

export default useUserStore;
