import { ZodSchema } from "zod";

export type ApiConfig = RequestInit & {
  fetch?: typeof fetch;
  timeout?: number;
};

export type RequestOptions<SchemaType extends ZodSchema = ZodSchema> = {
  schema?: SchemaType;
  includeHeaders?: boolean;
  signal?: AbortSignal;
  headers?: Record<string, string>;
};

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
