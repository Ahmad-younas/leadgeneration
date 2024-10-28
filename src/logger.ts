import pino from "pino";

const logger = pino({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "SYS:standard", // Adds a readable timestamp format
    },
  },
  level: process.env.LOG_LEVEL || "info",
  base: {
    env: process.env.NODE_ENV || "development",
  },
  formatters: {
    level(label) {
      return { level: label }; // Formats log level as "level: info"
    },
    bindings(bindings) {
      return {
        env: bindings.env,
        app: bindings.app,
      };
    },
    log(object) {
      if (object.error && object.error instanceof Error) {
        return {
          ...object,
          error: { message: object.error.message, stack: object.error.stack },
        }; // Ensures full error details
      }
      return object;
    },
  },
});
export default logger;
