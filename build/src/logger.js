"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const pino_1 = __importDefault(require("pino"));
const logger = (0, pino_1.default)({
  transport: {
    tar'pino-pretty'etty",
    options: {
      colorize: true,
      translateT'SYS:standard'dard", // Adds a readable timestamp format
    },
  },
  level: process.env.LOG_LEVE'info'info",
  base: {
    env: process.env.NODE_EN'development'ment",
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
exports.default = logger;
