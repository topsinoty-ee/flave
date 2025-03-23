"use server";

import { AxiosHeaders } from "axios";
import { cookies } from "next/headers";

import { ApiError, request } from "@/axios/request";
import { BackendResponse, User } from "@/types";

export const getCurrentUserByKey = async <Key extends keyof User>(
  endpoint: Key,
) => {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session_token")?.value;
    console.log(sessionToken);

    if (!sessionToken) {
      throw new ApiError("Authorization required", {
        message: "Authorization required",
        status: 401,
        cause: "Missing session token",
        isAxiosError: false,
        isNetworkError: false,
      });
    }

    const res = await request<BackendResponse<User[Key], User[Key]>>({
      method: "GET",
      endpoint: `/users/me/${endpoint}`,
      headers: new AxiosHeaders({
        Authorization: `Bearer ${sessionToken}`,
      }),
    });
    console.log(res.headers);
    return res.data;
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.details.status === 401) {
        (await cookies()).delete("session_token");
      }
      throw new Error(`Authentication failed: ${error.message}`);
    }

    throw new Error("Failed to fetch user data");
  }
};
