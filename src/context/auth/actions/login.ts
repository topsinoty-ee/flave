"use server";

import { API } from "@/api";
import { LoginPayload } from "../types";
import { User } from "@/types";
import { ApiError } from "@/api/error";
import { setCookiesFromHeader } from "../utils";
import { AuthError } from "../error";

export async function login(payload: LoginPayload) {
  try {
    const {
      headers,
      data: { user },
    } = await API.post<{ user: User }>("/users/login", payload, {
      includeHeaders: true,
    });
    const cookies = headers.get("set-cookie");
    if (cookies) {
      await setCookiesFromHeader(cookies);
    }

    return user;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    } else if (error instanceof AuthError) {
      throw error;
    }
    throw new ApiError("Login failed", 0, "LOGIN_FAILED", String(error));
  }
}
