import { ZodSchema, infer as ZodInfer } from "zod";
import { ApiError } from "./error";
import { ValidationError } from "@/lib/validation-error";

type ApiConfig = RequestInit & {
  fetch?: typeof fetch;
};

class Api {
  private baseUrl: string;
  private defaultOptions: RequestInit;
  private fetch: typeof fetch;

  constructor(baseUrl: string, defaultOptions: ApiConfig = {}) {
    this.baseUrl = baseUrl;
    this.fetch = defaultOptions.fetch || fetch;
    this.defaultOptions = {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...defaultOptions.headers,
      },
      ...defaultOptions,
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
    const mergedOptions: RequestInit = {
      ...this.defaultOptions,
      ...options,
      headers: this.cleanHeaders({
        ...this.defaultOptions.headers,
        ...options.headers,
      }),
    };

    try {
      const response = await this.fetch(url.href, mergedOptions);

      if (!response.ok) {
        throw await ApiError.fromResponse(response);
      }

      const contentType = response.headers.get("Content-Type");
      if (!contentType?.includes("application/json")) {
        throw new ApiError(
          `Non-JSON response from ${url.href}`,
          500,
          "Invalid Content-Type"
        );
      }

      const jsonData = await response.json();
      if (
        typeof jsonData === "object" &&
        jsonData !== null &&
        "data" in jsonData
      ) {
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
      } else {
        throw new ApiError(
          `Invalid response structure from ${url.href}`,
          500,
          "Missing 'data' property in response"
        );
      }
    } catch (error) {
      if (error instanceof ApiError || error instanceof ValidationError) {
        throw error;
      }

      console.error(`Request to ${url.href} failed:`, error);
      throw ApiError.fromError(error);
    }
  }

  async get<T>(endpoint: string, schema: ZodSchema<T>): Promise<T>;
  async get<T>(endpoint: string): Promise<T>;
  async get<T>(endpoint: string, schema?: ZodSchema<T>): Promise<T> {
    return this.request(endpoint, { method: "GET" }, schema!);
  }

  async post<T>(
    endpoint: string,
    body: unknown,
    schema?: ZodSchema<T>
  ): Promise<T> {
    return this.request(
      endpoint,
      {
        method: "POST",
        body: JSON.stringify(body),
      },
      schema!
    );
  }

  async put<T>(
    endpoint: string,
    body: unknown,
    schema?: ZodSchema<T>
  ): Promise<T> {
    return this.request(
      endpoint,
      {
        method: "PUT",
        body: JSON.stringify(body),
      },
      schema!
    );
  }

  async delete<T>(endpoint: string, schema?: ZodSchema<T>): Promise<T> {
    return this.request(endpoint, { method: "DELETE" }, schema!);
  }

  private cleanHeaders(
    headers: Record<string, unknown>
  ): Record<string, string> {
    return Object.fromEntries(
      Object.entries(headers)
        .filter(([_, value]) => value !== undefined)
        .map(([key, value]) => [key, String(value)])
    );
  }
}

if (!process.env.BACKEND_URL) throw new Error("Backend url not set");
export const API = new Api(process.env.BACKEND_URL);
