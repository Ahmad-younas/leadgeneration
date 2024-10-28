"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const Month_1 = require("./Model/Month");
const sequelize = new sequelize_typescript_1.Sequelize({
  database: "leadgeneration",
  username: "root",
  password: "root",
  host: "localhost",
  dialect: "mysql",
  models: [Month_1.Month],
});
exports.default = sequelize;
