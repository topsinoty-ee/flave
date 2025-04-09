export class SecurityHelper {
  static validateUrl(url: string): URL {
    if (
      typeof window === "undefined" &&
      process.env.NODE_ENV === "production"
    ) {
      if (!url.startsWith("https://")) {
        throw new Error("Insecure protocol in production environment");
      }
    }
    return new URL(url);
  }

  static getSecureHeaders(): Record<string, string> {
    return {
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      ...(process.env.NODE_ENV === "production" && {
        "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
      }),
    };
  }

  static sanitizeHeaders(
    headers: Record<string, unknown>,
  ): Record<string, string> {
    return Object.fromEntries(
      Object.entries(headers)
        .filter(([_, value]) => value !== undefined && value !== null)
        .map(([key, value]) => [key, String(value)]),
    );
  }
}
