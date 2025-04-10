import { ZodSchema, infer as ZodInfer } from "zod";
import { ApiError } from "./error";
import { ValidationError } from "@/lib/validation-error";
import { Api } from ".";

const DEFAULT_TIMEOUT = 10000;

type ApiConfig = RequestInit & {
  fetch?: typeof fetch;
  timeout?: number;
};

/**
 * @deprecated This class is deprecated in favor of {@link Api} in the index. imma get back to it later
 */
class OldApi {
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
    schema: SchemaType,
    includeHeaders: true
  ): Promise<{ data: ZodInfer<SchemaType>; headers: Headers }>;

  async request<SchemaType extends ZodSchema>(
    endpoint: string,
    options: RequestInit,
    schema: SchemaType,
    includeHeaders?: false
  ): Promise<ZodInfer<SchemaType>>;

  async request<SchemaType extends ZodSchema>(
    endpoint: string,
    options: RequestInit,
    schema: SchemaType
  ): Promise<ZodInfer<SchemaType>>;

  async request(
    endpoint: string,
    options: RequestInit,
    includeHeaders: true
  ): Promise<{ data: unknown; headers: Headers }>;

  async request(
    endpoint: string,
    options?: RequestInit,
    includeHeaders?: false
  ): Promise<unknown>;

  async request<RequestedType>(
    endpoint: string,
    options?: RequestInit,
    includeHeaders?: boolean
  ): Promise<RequestedType & { headers: never }>;

  async request<RequestedType>(
    endpoint: string,
    options?: RequestInit,
    includeHeaders?: true
  ): Promise<RequestedType & { headers: Headers }>;

  async request<SchemaType extends ZodSchema>(
    endpoint: string,
    options: RequestInit = {},
    schemaOrIncludeHeaders?: SchemaType | boolean,
    includeHeadersFlag?: boolean
  ): Promise<unknown> {
    const url = new URL(endpoint, this.baseUrl);
    const controller = new AbortController();

    let schema: SchemaType | undefined;
    let includeHeaders = false;

    if (typeof schemaOrIncludeHeaders === "boolean") {
      includeHeaders = schemaOrIncludeHeaders;
    } else if (schemaOrIncludeHeaders instanceof ZodSchema) {
      schema = schemaOrIncludeHeaders;
      includeHeaders = includeHeadersFlag ?? false;
    }

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

        let parsedData: unknown = responseData;
        if (schema) {
          const parseResult = schema.safeParse(responseData);
          if (!parseResult.success) {
            throw new ValidationError(
              `Response validation failed for ${url.href}`,
              parseResult.error.issues
            );
          }
          parsedData = parseResult.data;
        }

        if (includeHeaders) {
          return { data: parsedData, headers: response.headers };
        }
        return parsedData;
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
  ): Promise<T>;

  async get<T>(
    endpoint: string,
    options?: RequestInit,
    includeHeaders?: boolean
  ): Promise<T>;

  async get<T>(
    endpoint: string,
    schemaOrOptions?: ZodSchema<T> | RequestInit,
    optionsOrIncludeHeaders?: RequestInit | boolean
  ): Promise<T> {
    if (schemaOrOptions instanceof ZodSchema) {
      return this.request(
        endpoint,
        (optionsOrIncludeHeaders as RequestInit) ?? {},
        schemaOrOptions,
        false
      );
    }
    return this.request(
      endpoint,
      (schemaOrOptions as RequestInit) ?? {},
      (optionsOrIncludeHeaders as boolean) ?? false
    );
  }

  async post<T>(
    endpoint: string,
    body: unknown,
    schema?: ZodSchema<T>,
    options?: RequestInit
  ): Promise<T>;

  async post<T>(
    endpoint: string,
    body: unknown,
    options?: RequestInit,
    includeHeaders?: true
  ): Promise<T & { headers: Headers }>;

  async post<T>(
    endpoint: string,
    body: unknown,
    schemaOrOptions?: ZodSchema<T> | RequestInit,
    optionsOrIncludeHeaders?: RequestInit | boolean
  ): Promise<T> {
    const mergedOptions: RequestInit = {
      method: "POST",
      body: JSON.stringify(body),
    };

    if (schemaOrOptions instanceof ZodSchema) {
      return this.request(
        endpoint,
        { ...mergedOptions, ...(optionsOrIncludeHeaders as RequestInit) },
        schemaOrOptions,
        false
      );
    }
    return this.request(
      endpoint,
      { ...mergedOptions, ...(schemaOrOptions as RequestInit) },
      (optionsOrIncludeHeaders as boolean) ?? false
    );
  }

  async put<T>(
    endpoint: string,
    body: unknown,
    schema?: ZodSchema<T>,
    options?: RequestInit
  ): Promise<T>;

  async put<T>(
    endpoint: string,
    body: unknown,
    options?: RequestInit,
    includeHeaders?: boolean
  ): Promise<T>;

  async put<T>(
    endpoint: string,
    body: unknown,
    schemaOrOptions?: ZodSchema<T> | RequestInit,
    optionsOrIncludeHeaders?: RequestInit | boolean
  ): Promise<T> {
    const mergedOptions: RequestInit = {
      method: "PUT",
      body: JSON.stringify(body),
    };

    if (schemaOrOptions instanceof ZodSchema) {
      return this.request(
        endpoint,
        { ...mergedOptions, ...(optionsOrIncludeHeaders as RequestInit) },
        schemaOrOptions,
        false
      );
    }
    return this.request(
      endpoint,
      { ...mergedOptions, ...(schemaOrOptions as RequestInit) },
      (optionsOrIncludeHeaders as boolean) ?? false
    );
  }

  async delete<T>(
    endpoint: string,
    schema?: ZodSchema<T>,
    options?: RequestInit
  ): Promise<T>;

  async delete<T>(
    endpoint: string,
    options?: RequestInit,
    includeHeaders?: boolean
  ): Promise<T>;

  async delete<T>(
    endpoint: string,
    schemaOrOptions?: ZodSchema<T> | RequestInit,
    optionsOrIncludeHeaders?: RequestInit | boolean
  ): Promise<T> {
    if (schemaOrOptions instanceof ZodSchema) {
      return this.request(
        endpoint,
        (optionsOrIncludeHeaders as RequestInit) ?? {},
        schemaOrOptions,
        false
      );
    }
    return this.request(
      endpoint,
      (schemaOrOptions as RequestInit) ?? {},
      (optionsOrIncludeHeaders as boolean) ?? false
    );
  }

  private cleanHeaders(
    headers: Record<string, unknown>
  ): Record<string, string> {
    return Object.fromEntries(
      Object.entries(headers)
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
export const API = new OldApi(
  process.env.BACKEND_URL || "https://api.flave.ee"
);
