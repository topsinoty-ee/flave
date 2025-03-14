import { request } from "@/axios/request";

export const logout = async () => {
  await request("POST", "/users/logout");
};
