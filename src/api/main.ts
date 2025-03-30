import { ZodSchema, infer as ZodInfer } from "zod";
import { ApiError } from "./error";
import { ValidationError } from "@/lib/validation-error";

const DEFAULT_TIMEOUT = 10000;

type ApiConfig = RequestInit & {
  fetch?: typeof fetch;
  timeout?: number;
};

class Api {
  private baseUrl: string;
  private defaultOptions: RequestInit;
  private fetch: typeof fetch;
  private defaultTimeout: number;

  constructor(baseUrl: string, config: ApiConfig = {}) {
    this.baseUrl = baseUrl;
    this.fetch = config.fetch || fetch;
    this.defaultTimeout = config.timeout || DEFAULT_TIMEOUT;
    this.defaultOptions = {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...config.headers,
      },
      ...config,
    };
  }

  async request<SchemaType extends ZodSchema>(
    endpoint: string,
    options: RequestInit,
    schema: SchemaType
  ): Promise<ZodInfer<SchemaType>>;

  async request(endpoint: string, options?: RequestInit): Promise<unknown>;

  async request<RequestedType>(
    endpoint: string,
    options?: RequestInit
  ): Promise<RequestedType>;

  async request<SchemaType extends ZodSchema>(
    endpoint: string,
    options: RequestInit = {},
    schema?: SchemaType
  ): Promise<unknown> {
    const url = new URL(endpoint, this.baseUrl);
    const controller = new AbortController();

    const timeoutSignal = AbortSignal.timeout(this.defaultTimeout);
    const combinedSignal = options.signal
      ? AbortSignal.any([options.signal, timeoutSignal])
      : timeoutSignal;

    const mergedOptions: RequestInit = {
      ...this.defaultOptions,
      ...options,
      headers: this.cleanHeaders({
        ...this.defaultOptions.headers,
        ...options.headers,
      }),
      signal: combinedSignal,
    };

    try {
      const response = await this.fetch(url.href, mergedOptions);

      if (!response.ok) {
        throw await ApiError.fromResponse(response.clone());
      }

      const contentType = response.headers.get("Content-Type");
      if (!contentType?.match(/^application\/json/)) {
        throw new ApiError(
          `Non-JSON response from ${url.href}`,
          500,
          "Invalid Content-Type"
        );
      }

      const jsonData = await response.json();
      if (jsonData?.data) {
        const responseData = jsonData.data;

        if (schema) {
          const parseResult = schema.safeParse(responseData);
          if (!parseResult.success) {
            throw new ValidationError(
              `Response validation failed for ${url.href}`,
              parseResult.error.issues
            );
          }
          return parseResult.data;
        }

        return responseData as unknown;
      }

      throw new ApiError(
        `Invalid response structure from ${url.href}`,
        500,
        "Missing 'data' property in response"
      );
    } catch (error) {
      if (error instanceof ApiError || error instanceof ValidationError) {
        throw error;
      }

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new ApiError(`Request to ${url.href} timed out`, 0, "TIMEOUT");
        }
        throw ApiError.fromError(error);
      }

      throw new ApiError(
        "Unknown error occurred",
        0,
        "UNKNOWN_ERROR",
        String(error)
      );
    } finally {
      controller.abort();
    }
  }

  async get<T>(
    endpoint: string,
    schema?: ZodSchema<T>,
    options?: RequestInit
  ): Promise<T> {
    return this.request(endpoint, { ...options, method: "GET" }, schema!);
  }

  async post<T>(
    endpoint: string,
    body: unknown,
    schema?: ZodSchema<T>,
    options?: RequestInit
  ): Promise<T> {
    return this.request(
      endpoint,
      {
        ...options,
        method: "POST",
        body: JSON.stringify(body),
      },
      schema!
    );
  }

  async put<T>(
    endpoint: string,
    body: unknown,
    schema?: ZodSchema<T>,
    options?: RequestInit
  ): Promise<T> {
    return this.request(
      endpoint,
      {
        ...options,
        method: "PUT",
        body: JSON.stringify(body),
      },
      schema!
    );
  }

  async delete<T>(
    endpoint: string,
    schema?: ZodSchema<T>,
    options?: RequestInit
  ): Promise<T> {
    return this.request(endpoint, { ...options, method: "DELETE" }, schema!);
  }

  private cleanHeaders(
    headers: Record<string, unknown>
  ): Record<string, string> {
    return Object.fromEntries(
      Object.entries(headers)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_, value]) => value !== undefined && value !== null)
        .map(([key, value]) => [
          key,
          String(value as NonNullable<typeof value>),
        ])
    );
  }
}

if (typeof window === "undefined" && !process.env.BACKEND_URL) {
  throw new Error("Backend URL not set (server-side)");
}
export const API = new Api(process.env.BACKEND_URL || "https://api.flave.ee");
