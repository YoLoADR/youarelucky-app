// store/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/types/user';

interface UserState {
  user: User | null;
  isTrialActive: boolean;
  isTrialExpired: boolean;
  isSubActive: boolean;
  needMoreCredits: boolean;
  isNewComer: boolean;
  mockMode: boolean;
  isLoading: boolean; // Ajoutez ceci
}

const initialState: UserState = {
  user: null,
  isTrialActive: false,
  isTrialExpired: false,
  isSubActive: false,
  needMoreCredits: false,
  isNewComer: true,
  mockMode: false,
  isLoading: true, // Ajoutez ceci
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
    },
    setTrialActive(state, action: PayloadAction<boolean>) {
      state.isTrialActive = action.payload;
    },
    setTrialExpired(state, action: PayloadAction<boolean>) {
      state.isTrialExpired = action.payload;
    },
    setSubActive(state, action: PayloadAction<boolean>) {
      state.isSubActive = action.payload;
    },
    setNeedMoreCredits(state, action: PayloadAction<boolean>) {
      state.needMoreCredits = action.payload;
    },
    setNewComer(state, action: PayloadAction<boolean>) {
      state.isNewComer = action.payload;
    },
    updateSubscription(state, action: PayloadAction<any[]>) {
      if (state.user) {
        state.user.subscriptions = action.payload;
      }

      let isNewComer = !state.user?.subscriptions || state.user.subscriptions.length === 0;
      let isTrialActive = false;
      let isTrialExpired = false;
      let needMoreCredits = false;
      let isSubActive = false;

      if (state.user?.subscriptions && state.user.subscriptions.length > 0) {
        const currentDate = new Date();
        let activeSubscription = state.user.subscriptions.find(sub => sub.status === 'active');
        let trialSubscription = state.user.subscriptions.find(sub => sub.status === 'trialing');

        console.log('Active Subscription:', activeSubscription);
        console.log('Trial Subscription:', trialSubscription);
        console.log('state.user.subscriptions:', state.user.subscriptions);

        if (trialSubscription) {
          const trialEndDate = trialSubscription.trial_end ? new Date(trialSubscription.trial_end.seconds * 1000) : null;
          const usedTokens = trialSubscription.trial_tokens_used || 0;
          const trialTokenLimit = 50000;

          isTrialExpired = (trialEndDate && trialEndDate < currentDate) || usedTokens >= trialTokenLimit;
          isTrialActive = !isTrialExpired;

          console.log('Trial Subscription trialEndDate:', trialEndDate);
          console.log('Trial Subscription usedTokens:', usedTokens);
          console.log('Trial Subscription isTrialExpired:', isTrialExpired);
          console.log('Trial Subscription isTrialActive:', isTrialActive);
        }

        if (activeSubscription) {
          const usedTokens = activeSubscription.tokens_used || 0;
          const monthlyTokenLimit = 100000;

          needMoreCredits = usedTokens >= monthlyTokenLimit;
          isSubActive = !needMoreCredits;

          console.log('Active Subscription usedTokens:', usedTokens);
          console.log('Active Subscription needMoreCredits:', needMoreCredits);
          console.log('Active Subscription isSubActive:', isSubActive);
        }

        isNewComer = !isTrialActive && !isSubActive && !isTrialExpired && state.user.subscriptions.length === 0;
      }

      console.log('isTrialActive:', isTrialActive);
      console.log('isTrialExpired:', isTrialExpired);
      console.log('isSubActive:', isSubActive);
      console.log('isNewComer:', isNewComer);
      console.log('needMoreCredits:', needMoreCredits);

      state.isTrialActive = isTrialActive;
      state.isTrialExpired = isTrialExpired;
      state.isSubActive = isSubActive;
      state.needMoreCredits = needMoreCredits;
      state.isNewComer = isNewComer;
    },
    setLoading(state, action: PayloadAction<boolean>) { // Ajoutez ceci
      state.isLoading = action.payload;
    },
    setMockMode(state, action: PayloadAction<boolean>) {
      state.mockMode = action.payload;
    },
    setMockUser(state, action: PayloadAction<{ user: User | null, subscriptions: any[] }>) {
      if (state.mockMode) {
        state.user = action.payload.user;
        state.mockMode = true;
        state.user.subscriptions = action.payload.subscriptions;

        let isNewComer = !state.user?.subscriptions || state.user.subscriptions.length === 0;
        let isTrialActive = false;
        let isTrialExpired = false;
        let needMoreCredits = false;
        let isSubActive = false;

        if (state.user?.subscriptions && state.user.subscriptions.length > 0) {
          const trialEndDate = new Date(state.user.subscriptions[0].trial_end);
          const currentDate = new Date();
          const usedTokens = state.user.subscriptions[0].trial_tokens_used;
          const trialTokenLimit = 10; // Définir votre limite de token d'essai
          const monthlyTokenLimit = 100; // Définir votre limite de token mensuel

          isTrialExpired = trialEndDate < currentDate;
          needMoreCredits = usedTokens >= monthlyTokenLimit;
          console.log('trialEndDate:', trialEndDate);
          console.log('currentDate:', currentDate);
          console.log('usedTokens:', usedTokens);
          console.log('trialTokenLimit:', trialTokenLimit);
          isTrialActive = state.user.subscriptions[0].status === 'trialing' && !isTrialExpired;
          isSubActive = state.user.subscriptions[0].status === 'active' && !needMoreCredits;
          isNewComer = !isTrialActive && !isSubActive && !isTrialExpired && state.user.subscriptions.length === 0;
        }

        console.log('isTrialActive:', isTrialActive);
        console.log('isTrialExpired:', isTrialExpired);
        console.log('isSubActive:', isSubActive);
        console.log('isNewComer:', isNewComer);
        console.log('needMoreCredits:', needMoreCredits);

        state.isTrialActive = isTrialActive;
        state.isTrialExpired = isTrialExpired;
        state.isSubActive = isSubActive;
        state.needMoreCredits = needMoreCredits;
        state.isNewComer = isNewComer;
      }
    },
  },
});

export const { setUser, setTrialActive, setTrialExpired, setSubActive, setNeedMoreCredits, setNewComer, updateSubscription, setMockMode, setMockUser, setLoading } = userSlice.actions; // Ajoutez setLoading
export default userSlice.reducer;
