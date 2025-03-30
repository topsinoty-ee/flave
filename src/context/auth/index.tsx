"use client";

import { createContext, useEffect, useState } from "react";

import { User } from "@/types";

import * as actions from "./actions";
import { AuthContextType, LoginPayload, SignupPayload } from "./types";

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetchUser = async () => {
    try {
      const response = await actions.getCurrentUser();
      setUser(response.data);
      setError(null);
    } catch (error) {
      setUser(null);
      setError(error instanceof Error ? error.message : "Failed to fetch user");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refetchUser();
  }, []);

  const login = async (credentials: LoginPayload) => {
    try {
      setIsLoading(true);
      const response = await actions.login(credentials);
      setUser(response.data);
      setError(null);
    } catch (error) {
      setUser(null);
      setError(error instanceof Error ? error.message : "Login failed");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (credentials: SignupPayload) => {
    try {
      setIsLoading(true);
      const response = await actions.signup(credentials);
      setUser(response.data);
      setError(null);
    } catch (error) {
      setUser(null);
      setError(error instanceof Error ? error.message : "Signup failed");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await actions.logout();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Logout failed");
    } finally {
      setUser(null);
      setError(null);
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        error,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        signup,
        refetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export * from "./hook";
