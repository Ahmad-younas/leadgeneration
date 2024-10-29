"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const App_1 = __importDefault(require("./App"));
const DbConnection_1 = __importDefault(require("../src/DbConnection"));
const logger_1 = __importDefault(require("./logger"));
dotenv_1.default.config();
DbConnection_1.default
    .authenticate()
    .then(() => {
    logger_1.default.info(`Connection has been established successfully in ${process.env.NODE_ENV || "development"} mode`);
})
    .catch((err) => {
    logger_1.default.error(`Unable to connect to the database in ${process.env.NODE_ENV || "development"} mode`, err);
    console.log(`Unable to connect to the database:${err}`);
});
const port = process.env.PORT || 3002;
console.log(port);
App_1.default.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
