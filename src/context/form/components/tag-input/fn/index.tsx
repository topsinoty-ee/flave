"use server";

import { API } from "@/api";
import { Tag } from "@/types";
import { validateSession } from "@/context/auth/actions";

export async function fetchTags() {
  const { sessionToken } = await validateSession({ detailed: true });
  const suggestions = await API.get<Tag[]>("/tags", {
    headers: {
      Authorization: `Bearer ${sessionToken}`,
    },
  });

  return suggestions.map((tag) => tag.value);
}
