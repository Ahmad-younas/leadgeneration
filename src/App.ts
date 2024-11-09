import bodyParser from "body-parser";
import express from "express";
import cors, { CorsOptions } from "cors";
import adminRoutes from "./Routes/Admin";
import EmployeeRoutes from "./Routes/Employee";
import LoginRoutes from "./Routes/Login";

const app = express();
const corsOptions: CorsOptions = {
  origin: "http://localhost:3000", // Replace with the origin of your Flutter app
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(express.static(path.join(__dirname, "../build")));
app.use(cors(corsOptions));
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    uptime: process.uptime(), // uptime in seconds
    timestamp: new Date().toISOString(), // current timestamp
  });
});

app.use("/api/", EmployeeRoutes);
app.use("/api/", LoginRoutes);
app.use("/api", adminRoutes);

export default app;
