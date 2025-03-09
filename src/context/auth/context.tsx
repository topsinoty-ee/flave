"use client";

import {
  createContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import type { User } from "@/types";

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

interface LoginResponse {
  token: string;
  user: User;
}

interface SignupResponse {
  token: string;
  user: User;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

const backendUrl = process.env.BACKEND_URL;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    const token = Cookies.get("token");
    const user = Cookies.get("user");

    if (token && user) {
      setState((prev) => ({
        ...prev,
        token,
        user: JSON.parse(user),
      }));
    }
  }, []);

  const handleRequest = async <T,>(func: () => Promise<T>) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      return await func();
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      setState((prev) => ({
        ...prev,
        error: error.response?.data?.message || "Authentication failed",
      }));
      throw error;
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    await handleRequest(async () => {
      const response = await axios.post<LoginResponse>(
        `${backendUrl}/users/login`,
        { email, password }
      );
      Cookies.set("token", response.data.token);
      Cookies.set("user", JSON.stringify(response.data.user));
      setState((prev) => ({
        ...prev,
        user: response.data.user,
        token: response.data.token,
      }));
    });
  }, []);

  const signup = useCallback(
    async (
      firstName: string,
      lastName: string,
      email: string,
      password: string
    ) => {
      await handleRequest(async () => {
        const response = await axios.post<SignupResponse>(
          `${backendUrl}/users/signup`,
          {
            firstName,
            lastName,
            email,
            password,
          }
        );
        Cookies.set("token", response.data.token);
        Cookies.set("user", JSON.stringify(response.data.user));
        setState((prev) => ({
          ...prev,
          user: response.data.user,
          token: response.data.token,
        }));
      });
    },
    []
  );

  const logout = useCallback(async () => {
    await handleRequest(async () => {
      await axios.get(`${backendUrl}/users/logout`);
      Cookies.remove("token");
      Cookies.remove("user");
      setState((prev) => ({
        ...prev,
        user: null,
        token: null,
      }));
    });
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return (
    <AuthContext.Provider
      value={{ ...state, login, signup, logout, clearError }}
    >
      {children}
    </AuthContext.Provider>
  );
};
