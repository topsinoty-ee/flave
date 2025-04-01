import { ApiError } from "@/api/error";
import { API } from "@/api/main";
import { User } from "@/types";
import { cookies } from "next/headers";
import { AuthError } from "../error";

export function validateSession(): Promise<boolean>;

export function validateSession(options: { detailed: true }): Promise<{
  isValid: boolean;
  sessionToken: string | null;
}>;

export async function validateSession(options?: {
  detailed: boolean;
}): Promise<boolean | { isValid: boolean; sessionToken?: string | null }> {
  try {
    const sessionToken = (await cookies()).get("session_token")?.value;
    if (!sessionToken) {
      return options?.detailed ? { isValid: false, sessionToken: null } : false;
    }

    const { user } = await API.get<{ user: User }>("users/me", {
      headers: { Authorization: `Bearer ${sessionToken}` },
    });

    const isValid = !!user;
    return options?.detailed ? { isValid, sessionToken } : isValid;
  } catch (error) {
    if (error instanceof ApiError || error instanceof AuthError) {
      throw error;
    }
    throw new ApiError(
      "Session validation failed",
      0,
      "SESSION_INVALID",
      String(error)
    );
  }
}
