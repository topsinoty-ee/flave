import { cookies } from "next/headers";

export const getTokenFromCookies = async () => {
  const cookieStore = await cookies();
  return cookieStore.get("token")?.value;
};
