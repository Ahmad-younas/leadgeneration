"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../Middleware/auth");
const AdminController_1 = require("../Controller/AdminController");
const dropboxController_1 = require("../Controller/dropboxController");
const router = express_1.default.Router();
router.get("/all-jobs", auth_1.authenticateJWT, AdminController_1.getJobs, (0, auth_1.authorizeRole)("admin"));
router.post("/add-employee", auth_1.authenticateJWT, AdminController_1.addEmployee, (0, auth_1.authorizeRole)("admin"));
router.patch("/update-admin", auth_1.authenticateJWT, AdminController_1.updateAdmin, (0, auth_1.authorizeRole)("admin"));
router.get("/all-employee", auth_1.authenticateJWT, AdminController_1.findAllEmployee, (0, auth_1.authorizeRole)("admin"));
router.delete("/delete-employee", auth_1.authenticateJWT, AdminController_1.deleteEmployee, (0, auth_1.authorizeRole)("admin"));
router.get("/get-monthly-count-job", auth_1.authenticateJWT, AdminController_1.getMonthlyJobCounts, (0, auth_1.authorizeRole)("admin"));
router.post("/get-Employee-Info-And-Employee-Job-Info", auth_1.authenticateJWT, AdminController_1.getEmployeeInfoAndEmployeeJobInfo, (0, auth_1.authorizeRole)("admin"));
router.get("/getEmployeeWithJobInfo", auth_1.authenticateJWT, AdminController_1.getEmployeeWithJobInfo, (0, auth_1.authorizeRole)("admin"));
router.post("/deleteSelectedEmployees", auth_1.authenticateJWT, AdminController_1.deleteSelectedEmployees);
router.post("/deleteSelectedJobs", auth_1.authenticateJWT, AdminController_1.deleteSelectedJobs);
router.put("/updateEmployeeJob", auth_1.authenticateJWT, AdminController_1.updateEmployeeJob);
router.post("/deleteAllJobs", auth_1.authenticateJWT, AdminController_1.deleteAllJobs);
router.get("/getEmployeeById", auth_1.authenticateJWT, AdminController_1.getEmployeeById);
router.get("/getEmployeeJobInfo/:id", auth_1.authenticateJWT, AdminController_1.getEmployeeJobInfo);
router.get("/authWithDropBox", auth_1.authenticateJWT, AdminController_1.authWithDropBox);
router.post("/createFolderInDropBox/:id", auth_1.authenticateJWT, dropboxController_1.createFolderInDropBox);
router.patch("/updateEmployee", auth_1.authenticateJWT, AdminController_1.updateEmployee);
router.get("/getAllJobStatus", auth_1.authenticateJWT, AdminController_1.getAllJobStatus);
exports.default = router;
