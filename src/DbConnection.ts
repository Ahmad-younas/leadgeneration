import { Sequelize } from "sequelize-typescript";
import { Month } from "./Model/Month";

const sequelize = new Sequelize({
  database: "leadgeneration",
  username: "root",
  password: "root",
  host: "localhost",
  dialect: "mysql",
  models: [Month],
});
export default sequelize;
