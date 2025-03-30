import axios from "axios";

export const client = axios.create({
  baseURL: "https://api.flave.ee",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 10000,
});

client.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error),
);
