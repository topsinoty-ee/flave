"use server";
import { API } from "@/api";
import { validateSession } from "./validateSession";
export async function addToFaves(_id: string) {
  const { sessionToken, isValid } = await validateSession({
    detailed: true,
  });
  if (isValid && sessionToken) {
    API.get(`/recipes/${_id}/favourite`, {
      headers: { Authorization: `Bearer ${sessionToken}` },
    });
  }
}
