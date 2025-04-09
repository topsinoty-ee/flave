"use server";

import { API } from "@/api";
import { User } from "@/types";
import { validateSession } from "./validateSession";

export async function getCurrentUser(): Promise<User | null>;
export async function getCurrentUser<Data>(
  endpoint: string,
): Promise<Data | null>;
export async function getCurrentUser<Data = User>(
  endpoint?: string,
): Promise<Data | User | null> {
  // Validate session and get token
  const { sessionToken, isValid, currentUser } = await validateSession({
    detailed: true,
    user: true,
  });

  console.log("Session validation", { isValid, sessionToken });

  if (!isValid || !sessionToken) {
    return null;
  }

  // If no endpoint provided, return basic user info
  if (!endpoint) {
    console.log("Returning current user", currentUser);
    return currentUser;
  }

  // Fetch extended user data for specific endpoint
  try {
    console.log(`Fetching user data from endpoint: ${endpoint}`);
    const data = await API.get<Data>(`/users/me/${endpoint}`, {
      headers: { Authorization: `Bearer ${sessionToken}` },
    });

    console.log("Fetched data:", data);
    return data;
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    return null;
  }
}
