"use server";

import { API } from "@/api";
import { log } from "console";

export async function createRecipe(formdata: FormData, sessionToken: string) {
  const res = await API.post("/recipes", formdata, {
    headers: {
      Authorization: `Bearer ${sessionToken}`,
      "Content-Type": "multipart/form-data",
    },
    credentials: "include",
  });
  log(res);
}
