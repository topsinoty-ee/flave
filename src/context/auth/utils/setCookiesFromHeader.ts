"use server";

import { cookies } from "next/headers";

export async function setCookiesFromHeader(
  setCookieHeader: string | string[] | undefined
) {
  if (!setCookieHeader) return;

  const cookieStrings = Array.isArray(setCookieHeader)
    ? setCookieHeader
    : [setCookieHeader];
  const cookieStore = await cookies();

  for (const cookieString of cookieStrings) {
    try {
      const parts = cookieString.split(";");
      const [nameValuePart, ...attributeParts] = parts;
      if (!nameValuePart) continue;

      const [name, ...valueParts] = nameValuePart.split("=");
      const value = valueParts.join("=");
      if (!name) continue;

      const attributes = attributeParts.reduce(
        (acc, part) => {
          const trimmedPart = part.trim();
          const [attrName, ...attrValueParts] = trimmedPart.split("=");
          const attrKey = attrName?.toLowerCase();
          if (attrKey) {
            acc[attrKey] =
              attrValueParts.length > 0 ? attrValueParts.join("=") : "true";
          }
          return acc;
        },
        {} as Record<string, string>
      );

      const options = {
        httpOnly: Boolean(attributes.httpOnly),
        secure: Boolean(attributes.secure),
        sameSite: attributes.samesite?.toLowerCase() as
          | "lax"
          | "strict"
          | "none"
          | undefined,
        path: attributes.path || "/",
        maxAge: attributes["max-age"]
          ? parseInt(attributes["max-age"], 10)
          : undefined,
        expires: attributes.expires ? new Date(attributes.expires) : undefined,
      };

      cookieStore.set(name, value, options);
    } catch (error) {
      console.error("Failed to set cookie:", error);
    }
  }
}
