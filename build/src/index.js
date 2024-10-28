"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const App_1 = __importDefault(require("./App"));
const DbConnection_1 = __importDefault(require("../src/DbConnection"));
dotenv_1.default.config();
DbConnection_1.default
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });
const port = process.env.PORT || 3002;
console.log(port);
App_1.default.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
