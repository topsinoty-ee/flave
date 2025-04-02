import { Logger } from "./types";

export class ApiLogger {
  private logger: Logger;

  constructor(logger?: Logger) {
    this.logger = logger || {
      info: console.log,
      warn: console.warn,
      error: console.error,
      debug: process.env.NODE_ENV === "development" ? console.debug : undefined,
    };
  }

  logRequest(url: string, caller: string) {
    this.logger.info(`API Request: ${url} initiated from ${caller}`);
  }

  logSuccess(url: string, caller: string) {
    this.logger.info(`API Success: ${url} from ${caller}`);
  }

  logError(url: string, caller: string, error: unknown) {
    this.logger.error(`API Error: ${url} from ${caller}`, error);
  }

  getCallerInfo(): string {
    if (typeof window !== "undefined") return "client-side";

    const stack = new Error().stack?.split("\n") || [];
    for (let i = 3; i < stack.length; i++) {
      const line = stack[i]?.trim() || "";
      if (!line.includes("Api.") && !line.includes("node_modules")) {
        const match = line.match(/at (.+?) \((.+?):(\d+):(\d+)\)/);
        if (match) {
          const [_, method, file, line] = match;
          return `${file}:${line} (${method})`;
        }
        return line;
      }
    }
    return "unknown-origin";
  }
}
