import create from 'zustand';

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
    photoURL:'',
    gender:'other',
    dateOfBirth:'',
    region: '', // Add region here
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
