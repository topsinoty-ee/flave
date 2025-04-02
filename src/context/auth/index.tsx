"use client";

import {
  createContext,
  ReactNode,
  useEffect,
  useState,
  useCallback,
} from "react";
import { AuthContextValue, AuthState } from "./types";
import { AuthError } from "./error";
import { getCurrentUser, validateSession } from "./actions";

const initialState: AuthState = {
  user: null,
  error: null,
  isLoading: true,
  isAuthenticated: false,
};

export const AuthContext = createContext<AuthContextValue | null>(null);
export * from "./hook";
export * from "./guard";
export * from "./error";
export * from "./types";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>(initialState);

  const updateAuthState = useCallback((newState: Partial<AuthState>) => {
    setState((prev) => ({ ...prev, ...newState }));
  }, []);

  const checkSession = useCallback(async () => {
    try {
      const user = await getCurrentUser();
      const isValid = await validateSession();

      updateAuthState({
        user,
        isAuthenticated: isValid,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      updateAuthState({
        isLoading: false,
        isAuthenticated: false,
        error: AuthError.fromError(error),
      });
    }
  }, [updateAuthState]);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  return (
    <AuthContext.Provider value={{ ...state, updateAuthState }}>
      {children}
    </AuthContext.Provider>
  );
};
