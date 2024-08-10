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
  user: null,
  subscriptions: [],
  isLoading: false,
  setUser: (user) => set({ user }),
  setSubscriptions: (subscriptions) => set({ subscriptions }),
  setLoading: (isLoading) => set({ isLoading }),
}));

export default useUserStore;
