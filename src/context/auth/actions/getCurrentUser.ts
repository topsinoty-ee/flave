import { API } from "@/api";
import { User } from "@/types";
import { validateSession } from "./validateSession";

export async function getCurrentUser() {
  const { sessionToken, isValid } = await validateSession({ detailed: true });
  if (isValid) {
    console.log("Valid", sessionToken);
    const { user } = await API.get<{ user: User }>("/users/me", {
      headers: { Authorization: `Bearer ${sessionToken}` },
    });
    return user;
  }
  console.log("yikes bro");
  return null;
}
