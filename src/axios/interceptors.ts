import { client } from "./client";

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

// In your axios/request setup
client.interceptors.request.use(async (config) => {
  if (typeof window === "undefined") {
    // Server-side
    const { cookies } = await import("next/headers");
    const sessionToken = (await cookies()).get("session_token")?.value;

    if (sessionToken) {
      config.headers.Authorization = `Bearer ${sessionToken}`;
    }
  } else {
    // Client-side
    const sessionToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("session_token="))
      ?.split("=")[1];

    if (sessionToken) {
      config.headers.Authorization = `Bearer ${sessionToken}`;
    }
  }

  return config;
});
