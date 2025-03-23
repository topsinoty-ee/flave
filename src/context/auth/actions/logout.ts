"use server";

import { request } from "@/axios/request";
import { cookies } from "next/headers";

export const logout = async () => {
  await request({ method: "POST", endpoint: "/users/logout" });
  (await cookies()).delete("session_token");
  console.log(cookies());
};
