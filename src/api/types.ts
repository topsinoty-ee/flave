import { ZodSchema } from "zod";

export type ApiConfig = RequestInit & {
  fetch?: typeof fetch;
  timeout?: number;
  logger?: Logger;
};

export type Logger = {
  info: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  error: (...args: any[]) => void;
  debug?: (...args: any[]) => void;
};

export type RequestOptions<SchemaType extends ZodSchema = ZodSchema> = {
  schema?: SchemaType;
  includeHeaders?: boolean;
  signal?: AbortSignal;
  headers?: Record<string, string>;
};

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
