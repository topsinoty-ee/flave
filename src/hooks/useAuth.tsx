// hooks/useAuth.tsx
"use client";
import { useContext, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context";
import { LoginPayload, SignupPayload } from "@/context/auth/actions";
import { AxiosError } from "axios";
import { Maybe } from "@/types/util";
import { Resource } from "@/types/";
import { isResource } from "@/types/guard/";

class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  const router = useRouter();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [signupError, setSignupError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState({
    login: false,
    signup: false,
    logout: false,
  });

  if (!context) throw new Error("useAuth must be used within AuthProvider");

  const enhancedLogin = useCallback(
    async (credentials: LoginPayload, redirectTo = "/recipes/browse") => {
      setLoginError(null);
      setAuthLoading((prev) => ({ ...prev, login: true }));

      try {
        await context.login(credentials);
        router.push(redirectTo);
        return true;
      } catch (error) {
        let errorMessage = "Login failed";

        if (error instanceof AuthError) {
          errorMessage = error.message;
        } else if (error instanceof AxiosError) {
          errorMessage = error.response?.data?.message || error.message;
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }

        setLoginError(errorMessage);
        return false;
      } finally {
        setAuthLoading((prev) => ({ ...prev, login: false }));
      }
    },
    [context, router]
  );

  const enhancedSignup = useCallback(
    async (credentials: SignupPayload, redirectTo = "/dashboard") => {
      setSignupError(null);
      setAuthLoading((prev) => ({ ...prev, signup: true }));

      try {
        await context.signup(credentials);
        router.push(redirectTo);
        return true;
      } catch (error) {
        let errorMessage = "Signup failed";

        if (error instanceof AuthError) {
          errorMessage = error.message;
        } else if (error instanceof AxiosError) {
          errorMessage = error.response?.data?.message || error.message;
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }

        setSignupError(errorMessage);
        return false;
      } finally {
        setAuthLoading((prev) => ({ ...prev, signup: false }));
      }
    },
    [context, router]
  );

  const enhancedLogout = useCallback(
    async (redirectTo = "/login") => {
      setAuthLoading((prev) => ({ ...prev, logout: true }));

      try {
        await context.logout();
        router.push(redirectTo);
      } catch (error) {
        if (error instanceof Error) {
          console.error("Logout error:", error.message);
        }
      } finally {
        setAuthLoading((prev) => ({ ...prev, logout: false }));
      }
    },
    [context, router]
  );

  const isOwner = useCallback(
    (resource: Maybe<string | Resource>): boolean => {
      if (!context.user) return false;

      if (typeof resource === "string") {
        return context.user._id === resource;
      }

      if (isResource(resource)) {
        return context.user._id === resource.user._id;
      }

      return false;
    },
    [context.user]
  );

  const isLoading = context.isLoading;
  const isAuthenticated = context.isAuthenticated;
  const user = context.user;

  return {
    user,
    isLoading,
    isAuthenticated,
    loginError,
    signupError,
    authLoading,
    login: enhancedLogin,
    signup: enhancedSignup,
    logout: enhancedLogout,
    isOwner,
  };
};
