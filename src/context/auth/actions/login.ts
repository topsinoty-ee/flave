import { API } from "@/api";
import { LoginPayload } from "../types";
import { User } from "@/types";
import { ApiError } from "@/api/error";
import { setCookiesFromHeader } from "../utils";
import { AuthError } from "../error";

export async function login(payload: LoginPayload) {
  try {
    API.enableDebug();
    const { headers, data } = await API.post<{ user: User }>(
      "/users/login",
      payload,
      { includeHeaders: true }
    );
    API.enableDebug();

    const cookies = headers.get("set-cookie");
    console.log(headers);
    if (cookies) {
      await setCookiesFromHeader(cookies);
      console.log("It found cookies...check if they being set");
    }

    return data.user;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    } else if (error instanceof AuthError) {
      throw error;
    }
    throw new ApiError("Login failed", 0, "LOGIN_FAILED", String(error));
  }
}
