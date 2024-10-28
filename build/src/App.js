"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const Admin_1 = __importDefault(require("./Routes/Admin"));
const Employee_1 = __importDefault(require("./Routes/Employee"));
const Login_1 = __importDefault(require("./Routes/Login"));
const node_path_1 = __importDefault(require("node:path"));
const app = (0, express_1.default)();
const corsOptions = {
  origin: "http://localhost:3000", // Replace with the origin of your Flutter app
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};
app.use(body_parser_1.default.urlencoded({ extended: false }));
console.log("path=>", node_path_1.default.join(__dirname, "../build"));
app.use(
  express_1.default.static(node_path_1.default.join(__dirname, "../build")),
);
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    uptime: process.uptime(), // uptime in seconds
    timestamp: new Date().toISOString(), // current timestamp
  });
});
app.use("/api/", Employee_1.default);
app.use("/api/", Login_1.default);
app.use("/api", Admin_1.default);
exports.default = app;
