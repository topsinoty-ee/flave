import {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  Method,
  AxiosHeaders,
} from "axios";
import { client } from "./client";

type RequestOptions = {
  method: Method;
  endpoint: string;
  data?: unknown;
  params?: unknown;
  headers?: AxiosHeaders;
  timeout?: number;
};

type ErrorInfo = {
  message: string;
  code?: string;
  cause?: string;
  status?: number;
  isAxiosError?: boolean;
  isNetworkError?: boolean;
  config?: AxiosRequestConfig;
  data?: unknown;
};

export class ApiError extends Error {
  public readonly code: string;
  status!: number;
  url!: string;

  constructor(
    public override message: string,
    public details: ErrorInfo,
    code?: string,
  ) {
    super(message);
    this.name = "ApiError";
    this.code = code || "GENERIC_API_ERROR";
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

const DEFAULT_TIMEOUT = 10000;

export const request = async <T = unknown>({
  method,
  endpoint,
  data,
  params,
  headers,
  timeout = DEFAULT_TIMEOUT,
}: RequestOptions): Promise<AxiosResponse<T>> => {
  if (!endpoint || typeof endpoint !== "string") {
    throw new ApiError("Invalid endpoint provided", {
      message: "Endpoint must be a valid string",
      isAxiosError: false,
      isNetworkError: false,
    });
  }

  const cleanedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  try {
    const config: AxiosRequestConfig = {
      method,
      url: cleanedEndpoint,
      headers: headers?.toJSON() || {},
      timeout,
      params,
      validateStatus: (status) => status >= 200 && status < 300,
    };

    if (data && method !== "GET") {
      config.data = data;
    }

    // console.log(config);
    return await client.request<T>(config);
  } catch (error) {
    const axiosError = error as AxiosError;

    const errorInfo: ErrorInfo = {
      message: axiosError.message,
      code: axiosError.code,
      status: axiosError.response?.status,
      isAxiosError: axiosError.isAxiosError || false,
      isNetworkError: !axiosError.response,
      config: axiosError.config,
      data: axiosError.response?.data,
    };

    console.error("Request failed:", {
      method,
      endpoint: cleanedEndpoint,
      error: errorInfo,
    });

    throw new ApiError(
      axiosError.response?.data &&
      typeof axiosError.response.data === "object" &&
      "message" in axiosError.response.data
        ? (axiosError.response.data as { message: string }).message
        : axiosError.message,
      errorInfo,
    );
  }
};
