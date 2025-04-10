"use server";

import { API } from "@/api";
import { validateSession } from "@/context/auth/actions";
import { Recipe } from "@/types/recipe";

export async function fetchRecipes(query: string) {
  const { sessionToken } = await validateSession({ detailed: true });
  // Fixed: Need to convert URLSearchParams to string and proper URL construction
  const endpoint = `/recipes?${query}`;
  console.log("enpoint: ", endpoint);
  API.disableDebug();
  const data = await API.get<Recipe[]>(endpoint, {
    headers: {
      Authorization: `Bearer ${sessionToken}`,
    },
  }).catch(() => []);
  return data;
}
