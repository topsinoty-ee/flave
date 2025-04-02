"use server";

import { ApiError } from "@/api/error";
import { API } from "@/api";
import { cookies } from "next/headers";
import { AuthError } from "../error";

export async function logout() {
  try {
    API.enableDebug();
    await API.get("/users/logout");
    (await cookies()).delete("session_token");
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    } else if (error instanceof AuthError) {
      throw error;
    }
    throw new ApiError("Logout failed", 0, "LOGOUT_FAILED", String(error));
  }
}
