import { createContext, Dispatch, SetStateAction } from 'react';
import { User } from '@/types/user';

type UserContextType = {
  user: User | undefined;
  setUser: Dispatch<SetStateAction<User | undefined>>;
  isTrialExpired: any;
  needMoreCredits: boolean;
  isSubActive: boolean;
  isTrialActive: boolean;
  isNewcComer: boolean;
};

export const UserContext = createContext<UserContextType | null>(null);
