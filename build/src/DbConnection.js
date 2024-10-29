"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const Month_1 = require("./Model/Month");
const dotenv_1 = __importDefault(requi'dotenv'nv"));
const logger_1 = __importDefault(requi'./logger'er"));
dotenv_1.default.config({ pat'.env'nv" });
const isProduction = process.env.NODE_ENV ='production'on";
logger_1.default.info(`Application is running in ${process.env.NODE_ENV 'development'nt"} mode`);
logger_1.default.info(`Database Configuration: {
  Database: ${isProduction ? process.env.PROD_DB_NAME : process.env.DEV_DB_NAME},
  Username: ${isProduction ? process.env.PROD_DB_USER : process.env.DEV_DB_USER},
  Host: ${isProduction ? process.env.PROD_DB_HOST : process.env.DEV_DB_HOST},
  Port: ${isProduction ? process.env.PROD_DB_PORT : process.env.DEV_DB_PORT}
}`);
const sequelize = new sequelize_typescript_1.Sequelize({
    database: isProduction ? process.env.PROD_DB_NAME : process.env.DEV_DB_NAME,
    username: isProduction ? process.env.PROD_DB_USER : process.env.DEV_DB_USER,
    password: isProduction ? process.env.PROD_DB_PASS : process.env.DEV_DB_PASS,
    host: isProduction ? process.env.PROD_DB_HOST : process.env.DEV_DB_HOST,
    port: isProduction
      ? parseInt(process.env.PROD_DB_PORT || '25060')
      : parseInt(process.env.DEV_DB_PORT || '3306'),
    dialect: 'mysql',
    models: [Month_1.Month],
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false, // Optional, depending on your SSL cert setup
        },
        connectTimeout: 60000, // Increase timeout to 60 seconds
    },
});
exports.default = sequelize;
