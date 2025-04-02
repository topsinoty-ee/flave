import { ZodSchema } from "zod";
import { Api } from ".";
import { ApiError } from "./error";

interface DebugMetrics {
  duration: number;
  timestamp: number;
  success: boolean;
  status?: number;
}

interface DebugRequestHistoryItem {
  method: string;
  endpoint: string;
  metrics: DebugMetrics;
  request: RequestInit;
  response?: unknown;
  error?: Error;
}

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export class ApiDebugExtension {
  private history: DebugRequestHistoryItem[] = [];
  private activeRequests = new Set<AbortController>();
  private config = {
    maxHistory: 100,
    logLevel: "debug" as "error" | "warn" | "info" | "debug",
    trackMetrics: true,
    trackRequests: true,
  };

  constructor(private api: Api) {}

  // Configuration methods
  configure(config: Partial<typeof this.config>) {
    this.config = { ...this.config, ...config };
    return this;
  }

  enable() {
    this.configure({ logLevel: "debug" });
    return this;
  }

  disable() {
    this.configure({ logLevel: "error" });
    return this;
  }

  // History management
  clearHistory() {
    this.history = [];
  }

  getHistory() {
    return [...this.history];
  }

  // Core debug methods
  private log(method: HttpMethod, endpoint: string, ...args: any[]) {
    if (this.config.logLevel === "debug") {
      console.debug(`[API] ${method} ${endpoint}`, ...args);
    }
  }

  private trackRequest(
    method: HttpMethod,
    endpoint: string,
    request: RequestInit,
    metrics: DebugMetrics,
    response?: unknown,
    error?: Error
  ) {
    if (!this.config.trackRequests) return;

    this.history.push({
      method,
      endpoint,
      metrics: {
        ...metrics,
        success: !error,
        status: error instanceof ApiError ? error.statusCode : undefined,
      },
      request,
      response,
      error,
    });

    // Keep history bounded
    if (this.history.length > this.config.maxHistory) {
      this.history.shift();
    }
  }

  // Wrapper methods with full type safety
  get = <T>(...args: Parameters<Api["get"]>) =>
    this.wrapRequest("GET", this.api.get<T>, args);
  post = <T>(...args: Parameters<Api["post"]>) =>
    this.wrapRequest("POST", this.api.post<T>, args);
  put = <T>(...args: Parameters<Api["put"]>) =>
    this.wrapRequest("PUT", this.api.put<T>, args);
  delete = <T>(...args: Parameters<Api["delete"]>) =>
    this.wrapRequest("DELETE", this.api.delete<T>, args);

  private async wrapRequest<T>(
    method: HttpMethod,
    fn: (...args: any[]) => Promise<T>,
    args: any[]
  ): Promise<T> {
    const [endpoint, ...rest] = args;
    const controller = new AbortController();

    const startTime = Date.now();
    let requestSnapshot: RequestInit = {};
    try {
      this.activeRequests.add(controller);

      this.log(method, endpoint, "Initiated", rest);

      // Clone request to log before potential modifications
      const requestSnapshot = this.cloneRequest(
        rest[rest.length - 1]?.request || {}
      );

      const response = await fn(
        ...this.addSignalToArgs(args, controller.signal)
      );
      const duration = Date.now() - startTime;

      this.log(method, endpoint, "Completed", { duration, response });
      this.trackRequest(
        method,
        endpoint,
        requestSnapshot,
        { duration, timestamp: startTime, success: true },
        response
      );

      return response;
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      this.log(method, endpoint, "Failed", { duration, error: errorMessage });
      this.trackRequest(
        method,
        endpoint,
        requestSnapshot,
        { duration, timestamp: startTime, success: false },
        undefined,
        error instanceof Error ? error : undefined
      );

      if (this.config.logLevel === "error") {
        console.error(`[API] ${method} ${endpoint} Error:`, error);
      }

      throw error;
    } finally {
      this.activeRequests.delete(controller);
    }
  }

  private cloneRequest(request: RequestInit): RequestInit {
    return {
      ...request,
      headers: { ...request.headers },
    };
  }

  private addSignalToArgs(args: any[], signal: AbortSignal): any[] {
    const lastArg = args[args.length - 1];
    if (
      lastArg &&
      typeof lastArg === "object" &&
      !(lastArg instanceof ZodSchema)
    ) {
      return [...args.slice(0, -1), { ...lastArg, signal }];
    }
    return [...args, { signal }];
  }

  // Advanced features
  async retry<T>(
    request: DebugRequestHistoryItem,
    options: { attempts?: number; delay?: number } = {}
  ): Promise<T> {
    const { attempts = 3, delay = 1000 } = options;
    let lastError: Error | undefined;

    for (let i = 0; i < attempts; i++) {
      try {
        const response = await this.api.request(
          request.endpoint,
          request.request,
          ...this.getSchemaFromHistory(request)
        );
        return response as T;
      } catch (error) {
        lastError = error as Error;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
    throw lastError ?? new Error("Retry failed");
  }

  private getSchemaFromHistory(request: DebugRequestHistoryItem) {
    // Implementation to extract schema from original request
    // This would depend on your specific request structure
    return [];
  }

  abortAll() {
    this.activeRequests.forEach((controller) => controller.abort());
    this.activeRequests.clear();
  }
}
