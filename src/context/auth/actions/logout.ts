"use server";

import { request } from "@/axios/request";

export const logout = async () => {
  await request({ method: "POST", endpoint: "/users/logout" });
};
