import pino from "pino";
import dotenv from "dotenv";

dotenv.config();

const logger = pino({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "SYS:standard", // Adds a readable timestamp format
      ignore: "pid,hostname", // Ignore these fields in the output
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
      // Enhanced error formatting
      if (object.error) {
        if (object.error instanceof Error) {
          return {
            ...object,
            error: {
              message: object.error.message,
              stack: object.error.stack,
              name: object.error.name, // Include error name
            },
          }; // Ensures full error details with name and stack
        } else {
          return {
            ...object,
            error: {
              message: String(object.error), // Convert to string if not an instance of Error
            },
          };
        }
      }
      return object;
    },
  },
});

export default logger;
