"use server";

import { ApiError, request } from "@/axios/request";
import { AuthResponse, User } from "@/types";
import { setCookiesFromHeader } from "@/util/cookies";

export type LoginPayload = {
  email: string;
  password: string;
};

export const login = async (data: LoginPayload) => {
  try {
    const req = await request<AuthResponse<User>>({
      method: "POST",
      endpoint: "/users/login",
      data,
    });

    await setCookiesFromHeader(req.headers["set-cookie"]);

    return req.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || "Login failed");
    } else if (error instanceof ApiError) {
      throw new ApiError(error.message, {
        message: error.message,
        cause: typeof error.cause === "string" ? error.cause : undefined,
      });
    }
    throw new Error("An unexpected error occurred during login");
  }
};
