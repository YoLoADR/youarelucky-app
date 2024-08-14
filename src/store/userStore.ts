import { create } from 'zustand';

interface UserState {
  user: any | null;
  subscriptions: any[];
  isLoading: boolean;
  setUser: (user: any | null) => void;
  setSubscriptions: (subscriptions: any[]) => void;
  setLoading: (isLoading: boolean) => void;
  scheduleGenerations: number;
  setScheduleGenerations: (generations: number) => void;
}

const useUserStore = create<UserState>((set) => ({
  user: {
    fullName: '',
    email: '',
    nickname: '',
    phoneNumber: '',
    photoURL: '',
    gender: 'other',
    role: 'DOCTOR',
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
  scheduleGenerations: 0,
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
  setScheduleGenerations: (generations) => set({ scheduleGenerations: generations }),
}));

export default useUserStore;
