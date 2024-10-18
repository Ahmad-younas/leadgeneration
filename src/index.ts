import dotenv from "dotenv";
import Server from "./App";
import sequelize from "../src/DbConnection";

dotenv.config();
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });
const port = process.env.PORT || 3000;
console.log(port);
Server.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
