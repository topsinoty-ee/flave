"use server";

import { ApiError } from "@/api/error";
import { API } from "@/api";
import { isUser, User } from "@/types";
import { cookies } from "next/headers";
import { AuthError } from "../error";

// Overload signatures
export function validateSession(): Promise<boolean>;
export function validateSession(options: { detailed: true }): Promise<{
  isValid: boolean;
  sessionToken: string | null;
}>;
export function validateSession(options: {
  detailed: true;
  user: true;
}): Promise<{
  isValid: boolean;
  sessionToken: string | null;
  currentUser: User | null;
}>;
export function validateSession(options: { user: true }): Promise<{
  currentUser: User | null;
}>;

// Implementation
export async function validateSession(options?: {
  detailed?: boolean;
  user?: boolean;
}): Promise<
  | boolean
  | {
      isValid: boolean;
      sessionToken: string | null;
    }
  | {
      currentUser: User | null;
    }
> {
  try {
    const sessionToken = (await cookies()).get("session_token")?.value ?? null;
    console.log("I have Session Token", sessionToken);

    if (!sessionToken) {
      console.log("I don't have Session Token");
      return options?.detailed
        ? options?.user
          ? { isValid: false, sessionToken: null, currentUser: null }
          : { isValid: false, sessionToken: null }
        : false;
    }

    API.enableDebug();
    const currentUser = await API.get("users/me", {
      headers: { Authorization: `Bearer ${sessionToken}` },
    });
    console.log("Current User", currentUser);

    const isValid = !!currentUser && isUser(currentUser);
    API.disableDebug();

    if (options?.detailed) {
      return options?.user
        ? {
            isValid,
            sessionToken,
            currentUser: isValid ? currentUser : null,
          }
        : { isValid, sessionToken };
    }

    return isValid;
  } catch (error) {
    //   if (error instanceof ApiError || error instanceof AuthError) {
    //     throw error;
    //   }
    //   throw new ApiError(
    //     "Session validation failed",
    //     0,
    //     "SESSION_INVALID",
    //     String(error)
    //   );
    // }
    console.log("validation failed", error);

    if (options?.detailed) {
      return options?.user
        ? { isValid: false, sessionToken: null, currentUser: null }
        : { isValid: false, sessionToken: null };
    }

    return false;
  }
}
