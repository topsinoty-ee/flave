import { request } from "@/axios/request";
import { AuthResponse, User } from "@/types";

export type SignupPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export const signup = async (data: SignupPayload) => {
  await request<AuthResponse<User>>("POST", "/users/signup", data);
};
