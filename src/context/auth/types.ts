import { User } from "@/types";
import { AuthError } from "./error";

export interface AuthenticationResponse<ResponseData = unknown> {
  result?: ResponseData;
  error?: AuthError;
  redirectPath?: string;
}

export type BareActionFunction<
  ActionParameters extends unknown[] = unknown[],
  ActionResult = unknown,
> = (...args: ActionParameters) => Promise<ActionResult>;

export type EnhancedActionFunction<
  ActionParameters extends unknown[] = unknown[],
  ActionResult = unknown,
> = (
  ...args: ActionParameters
) => Promise<AuthenticationResponse<ActionResult>>;

export type AuthState = {
  user: User | null;
  error: AuthError | null;
  isLoading: boolean;
  isAuthenticated: boolean;
};

export type AuthContextValue = AuthState & {
  updateAuthState: (newState: Partial<AuthState>) => void;
};

export interface AuthActionResponse<Data = unknown> {
  data?: Data;
  error?: AuthError;
  redirect?: string;
}

export type LoginPayload = {
  email: string;
  password: string;
};

export type SignupPayload = {
  email: string;
  username: string;
  password: string;
};
