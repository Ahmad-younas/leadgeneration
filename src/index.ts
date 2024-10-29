import dotenv from "dotenv";
import Server from "./App";
import sequelize from "../src/DbConnection";
import logger from "./logger";

dotenv.config();
sequelize
  .authenticate()
  .then(() => {
    logger.info(
      `Connection has been established successfully in ${process.env.NODE_ENV || "development"} mode`,
    );
  })
  .catch((err) => {
    logger.info(
      `Unable to connect to the database in ${process.env.NODE_ENV || "development"} mode`,
      err,
    );
  });
const port = process.env.PORT || 3002;
console.log(port);
Server.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
