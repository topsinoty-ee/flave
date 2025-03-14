import { request } from "@/axios/request";
import { AuthResponse, User } from "@/types";

export type LoginPayload = {
  email: string;
  password: string;
};

export const login = async (data: LoginPayload) => {
  await request<AuthResponse<User>>("POST", "/users/login", data);
};
