import { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { client } from "./client";

export const request = async <T = unknown>(
  requestMethod: "GET" | "POST" | "PUT" | "DELETE",
  endpoint: string,
  payloadDataType?: unknown,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  try {
    const response = await client.request<T>({
      method: requestMethod,
      url: endpoint,
      ...config,
      data: payloadDataType,
    });
    return response;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        console.error("Error response:", error.response.data);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Request setup error:", error.message);
      }
    } else {
      console.error("Unknown error:", error);
    }
    throw error;
  }
};
