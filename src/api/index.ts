import { ZodSchema, infer as ZodInfer } from "zod";
import { ApiError } from "./error";
import { ValidationError } from "@/lib/validation-error";
import { ApiDebugExtension } from "./debug";

const DEFAULT_TIMEOUT = 10000;

type ApiConfig = RequestInit & {
  fetch?: typeof fetch;
  timeout?: number;
};

export class Api {
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

  public debug = new ApiDebugExtension(this);
  private debugMode = false;
  enableDebug() {
    this.debugMode = true;
    return this;
  }

  disableDebug() {
    this.debugMode = false;
    return this;
  }

  private logRequest(method: string, endpoint: string, options: RequestInit) {
    if (!this.debugMode) return;

    console.debug(`[API] ${method} ${endpoint}`, {
      headers: options.headers,
      body: options.body,
      mode: options.mode,
      credentials: options.credentials,
    });
  }

  private async logResponse(
    method: string,
    endpoint: string,
    response: Response,
    duration: number
  ) {
    if (!this.debugMode) return;

    console.debug(
      `[API] ${method} ${endpoint} → ${response.status} (${duration}ms)`,
      {
        headers: Object.fromEntries(response.headers.entries()),
        statusText: response.statusText,
        body: await response.clone().json(),
      }
    );
  }

  private logError(
    method: string,
    endpoint: string,
    error: Error,
    duration: number
  ) {
    if (!this.debugMode) return;

    console.error(`[API] ${method} ${endpoint} → ERROR (${duration}ms)`, {
      errorName: error.name,
      message: error.message,
      stack: error.stack,
    });
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

  async request(
    endpoint: string,
    options: RequestInit,
    includeHeaders: true
  ): Promise<{ data: unknown; headers: Headers }>;

  async request<DataType extends object>(
    endpoint: string,
    options: RequestInit,
    includeHeaders: true
  ): Promise<{ data: DataType; headers: Headers }>;

  async request(
    endpoint: string,
    options?: RequestInit,
    includeHeaders?: boolean
  ): Promise<unknown>;

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
    } else if (schemaOrIncludeHeaders) {
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

    const startTime = Date.now();
    const method = options.method || "GET";

    try {
      this.logRequest(method, endpoint, options);

      const response = await this.fetch(url.href, mergedOptions);

      const duration = Date.now() - startTime;
      this.logResponse(method, endpoint, response, duration);

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
      const responseData = jsonData?.data ?? jsonData;

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
    } catch (error) {
      const duration = Date.now() - startTime;

      this.logError(method, endpoint, error as Error, duration);
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

  async get<T>(endpoint: string, options?: RequestInit): Promise<T>;

  async get<T>(
    endpoint: string,
    options: RequestInit & { includeHeaders: true }
  ): Promise<{ data: T; headers: Headers }>;

  async get<T>(
    endpoint: string,
    schema: ZodSchema<T>,
    options?: RequestInit
  ): Promise<T>;

  async get<T>(
    endpoint: string,
    schema: ZodSchema<T>,
    options: RequestInit & { includeHeaders: true }
  ): Promise<{ data: T; headers: Headers }>;

  async get<T>(
    endpoint: string,
    arg1?: ZodSchema<T> | RequestInit,
    arg2?: RequestInit
  ): Promise<T | { data: T; headers: Headers }> {
    let schema: ZodSchema<T> | undefined;
    let options: RequestInit = {};
    let includeHeaders = false;

    if (arg1 instanceof ZodSchema) {
      schema = arg1;
      options = arg2 ?? {};
      includeHeaders =
        (arg2 as { includeHeaders?: boolean })?.includeHeaders ?? false;
    } else {
      options = arg1 ?? {};
      includeHeaders =
        (arg1 as { includeHeaders?: boolean })?.includeHeaders ?? false;
    }

    return this.request(endpoint, options, includeHeaders) as Promise<
      T | { data: T; headers: Headers }
    >;
  }

  async post<T>(
    endpoint: string,
    body: BodyInit | Record<string, unknown>,
    options?: RequestInit
  ): Promise<T>;

  async post<T>(
    endpoint: string,
    body: BodyInit | Record<string, unknown>,
    options: RequestInit & { includeHeaders: true }
  ): Promise<{ data: T; headers: Headers }>;

  async post<T>(
    endpoint: string,
    body: BodyInit | Record<string, unknown>,
    schema: ZodSchema<T>,
    options?: RequestInit
  ): Promise<T>;

  async post<T>(
    endpoint: string,
    body: BodyInit | Record<string, unknown>,
    schema: ZodSchema<T>,
    options: RequestInit & { includeHeaders: true }
  ): Promise<{ data: T; headers: Headers }>;

  async post<T>(
    endpoint: string,
    body: BodyInit | Record<string, unknown>,
    arg1?: ZodSchema<T> | RequestInit,
    arg2?: RequestInit
  ): Promise<T | { data: T; headers: Headers }> {
    let schema: ZodSchema<T> | undefined;
    let options: RequestInit = {};
    let includeHeaders = false;

    if (arg1 instanceof ZodSchema) {
      schema = arg1;
      options = arg2 ?? {};
      includeHeaders =
        (arg2 as { includeHeaders?: boolean })?.includeHeaders ?? false;
    } else {
      options = arg1 ?? {};
      includeHeaders =
        (arg1 as { includeHeaders?: boolean })?.includeHeaders ?? false;
    }

    const headers = new Headers(
      this.cleanHeaders({
        ...this.defaultOptions.headers,
        ...options.headers,
      })
    );

    const isJson = !(body instanceof FormData) && !headers.has("Content-Type");
    const bodyPayload = JSON.stringify(body);

    if (isJson) {
      headers.set("Content-Type", "application/json");
    }

    const mergedOptions: RequestInit = {
      ...options,
      method: "POST",
      body: bodyPayload,
      headers,
    };

    return this.request(endpoint, mergedOptions, includeHeaders) as Promise<
      T | { data: T; headers: Headers }
    >;
  }

  async put<T>(
    endpoint: string,
    body: BodyInit | Record<string, unknown>,
    options?: RequestInit
  ): Promise<T>;

  async put<T>(
    endpoint: string,
    body: BodyInit | Record<string, unknown>,
    options: RequestInit & { includeHeaders: true }
  ): Promise<{ data: T; headers: Headers }>;

  async put<T>(
    endpoint: string,
    body: BodyInit | Record<string, unknown>,
    schema: ZodSchema<T>,
    options?: RequestInit
  ): Promise<T>;

  async put<T>(
    endpoint: string,
    body: BodyInit | Record<string, unknown>,
    schema: ZodSchema<T>,
    options: RequestInit & { includeHeaders: true }
  ): Promise<{ data: T; headers: Headers }>;

  async put<T>(
    endpoint: string,
    body: BodyInit | Record<string, unknown>,
    arg1?: ZodSchema<T> | RequestInit,
    arg2?: RequestInit
  ): Promise<T | { data: T; headers: Headers }> {
    let schema: ZodSchema<T> | undefined;
    let options: RequestInit = {};
    let includeHeaders = false;

    if (arg1 instanceof ZodSchema) {
      schema = arg1;
      options = arg2 ?? {};
      includeHeaders =
        (arg2 as { includeHeaders?: boolean })?.includeHeaders ?? false;
    } else {
      options = arg1 ?? {};
      includeHeaders =
        (arg1 as { includeHeaders?: boolean })?.includeHeaders ?? false;
    }

    const headers = new Headers(
      this.cleanHeaders({
        ...this.defaultOptions.headers,
        ...options.headers,
      })
    );

    const isJson = !(body instanceof FormData) && !headers.has("Content-Type");
    const bodyPayload = JSON.stringify(body);

    if (isJson) {
      headers.set("Content-Type", "application/json");
    }

    const mergedOptions: RequestInit = {
      ...options,
      method: "PUT",
      body: bodyPayload,
      headers,
    };

    return this.request(endpoint, mergedOptions, includeHeaders) as Promise<
      T | { data: T; headers: Headers }
    >;
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<T>;

  async delete<T>(
    endpoint: string,
    options: RequestInit & { includeHeaders: true }
  ): Promise<{ data: T; headers: Headers }>;

  async delete<T>(
    endpoint: string,
    schema: ZodSchema<T>,
    options?: RequestInit
  ): Promise<T>;

  async delete<T>(
    endpoint: string,
    schema: ZodSchema<T>,
    options: RequestInit & { includeHeaders: true }
  ): Promise<{ data: T; headers: Headers }>;

  async delete<T>(
    endpoint: string,
    arg1?: ZodSchema<T> | RequestInit,
    arg2?: RequestInit
  ): Promise<T | { data: T; headers: Headers }> {
    let schema: ZodSchema<T> | undefined;
    let options: RequestInit = {};
    let includeHeaders = false;

    if (arg1 instanceof ZodSchema) {
      schema = arg1;
      options = arg2 ?? {};
      includeHeaders =
        (arg2 as { includeHeaders?: boolean })?.includeHeaders ?? false;
    } else {
      options = arg1 ?? {};
      includeHeaders =
        (arg1 as { includeHeaders?: boolean })?.includeHeaders ?? false;
    }

    return this.request(
      endpoint,
      { ...options, method: "DELETE" },
      includeHeaders
    ) as Promise<T | { data: T; headers: Headers }>;
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

export const API = new Api(process.env.BACKEND_URL || "https://api.flave.ee");
API.enableDebug();
