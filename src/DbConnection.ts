import { Sequelize } from "sequelize-typescript";
import { Month } from "./Model/Month";
import dotenv from "dotenv";
import logger from "./logger";

dotenv.config();
const isProduction = process.env.NODE_ENV === "production";
logger.info(
  `Application is running in ${process.env.NODE_ENV || "development"} mode`,
);
const sequelize = new Sequelize({
  database: isProduction ? process.env.PROD_DB_NAME : process.env.DEV_DB_NAME,
  username: isProduction ? process.env.PROD_DB_USER : process.env.DEV_DB_USER,
  password: isProduction ? process.env.PROD_DB_PASS : process.env.DEV_DB_PASS,
  host: isProduction ? process.env.PROD_DB_HOST : process.env.DEV_DB_HOST,
  port: 25060,
  dialect: "mysql",
  models: [Month],
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Optional, depending on your SSL cert setup
    },
    connectTimeout: 60000, // Increase timeout to 60 seconds
  },
});
export default sequelize;
