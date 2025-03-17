import { User } from '@/types';

import { LoginPayload, SignupPayload } from './payload';

export type AuthContextType = {
  user: User | null;
  error: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
  signup: (credentials: SignupPayload) => Promise<void>;
  refetchUser: () => Promise<void>;
};

export * from "./payload";
