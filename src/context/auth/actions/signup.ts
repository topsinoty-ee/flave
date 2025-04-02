import { API } from "@/api";
import { SignupPayload } from "../types";
import { User } from "@/types";
import { ApiError } from "@/api/error";
import { setCookiesFromHeader } from "../utils";
import { AuthError } from "../error";

export async function signup(payload: SignupPayload) {
  try {
    const { headers, user } = await API.request<{ user: User }>(
      "/users/signup",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      true
    );

    const cookies = headers.get("set-cookie");
    console.log(headers);
    if (cookies) {
      await setCookiesFromHeader(cookies);
      console.log("It found cookies...check if they being set");
    }

    return user;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    } else if (error instanceof AuthError) {
      throw error;
    }
    throw new ApiError("Signup failed", 0, "SIGNUP_FAILED", String(error));
  }
}
