import { User } from "@/types";
import { AuthError } from "./error";
import * as actions from "./actions";

export type AuthState = {
  user: User | null;
  error: AuthError | null;
  isLoading: boolean;
  isAuthenticated: boolean;
};

export type AuthContextValue = AuthState & {
  updateAuthState: (newState: Partial<AuthState>) => void;
};

export type AuthHook = Partial<{
  [Key in keyof typeof actions]: (typeof actions)[Key];
}> &
  AuthContextValue;

export type LoginPayload = {
  email: string;
  password: string;
};

export type SignupPayload = {
  email: string;
  username: string;
  password: string;
};
