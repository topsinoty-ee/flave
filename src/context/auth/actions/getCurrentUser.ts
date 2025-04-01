import { API } from "@/api/main";
import { User } from "@/types";
import { validateSession } from "./validateSession";

export async function getCurrentUser() {
  const { sessionToken, isValid } = await validateSession({ detailed: true });
  if (!isValid) {
    const { user } = await API.get<{ user: User }>("/users/me", {
      headers: { Authorization: `Bearer ${sessionToken}` },
    });
    return user;
  }
  return null;
}
