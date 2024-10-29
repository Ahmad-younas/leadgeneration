"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const pino_1 = __importDefault(require("pino"));
const dotenv_1 = __importDefault(req'dotenv'tenv"));
dotenv_1.default.config();
const logger = (0, pino_1.default)({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard', // Adds a readable timestamp format
    },
  },
  level: process.env.LOG_LEVEL || 'info',
  base: {
    env: process.env.NODE_ENV || 'development',
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
