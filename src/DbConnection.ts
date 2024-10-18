// import { Sequelize } from "sequelize";
//
// const sequelize = new Sequelize("leadgenerationfrontend", "root", "root", {
//   host: "localhost",
//   dialect: "mysql",
// });
//
// export default sequelize;

import { Sequelize } from "sequelize-typescript";
import { Month } from "./Model/Month";

const sequelize = new Sequelize({
  database: "leadgeneration",
  username: "root",
  password: "root",
  host: "localhost",
  dialect: "mysql",
  models: [Month], // Register all your models here
});
export default sequelize;
