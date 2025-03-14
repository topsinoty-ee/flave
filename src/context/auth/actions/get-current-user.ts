import { request } from "@/axios/request";
import { BackendResponse, User } from "@/types";

export const getCurrentUser = async () => {
  const response = await request<BackendResponse<User>>("GET", "/users/me");
  return response;
};
