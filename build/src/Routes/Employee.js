"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../Middleware/auth");
const EmployeeController_1 = require("../Controller/EmployeeController");
const router = express_1.default.Router();
router.post("/add-job", auth_1.authenticateJWT, EmployeeController_1.addLeads, (0, auth_1.authorizeRole)("employee"));
router.get("/getJobInfoOfEmployee/:id", auth_1.authenticateJWT, EmployeeController_1.getJobInfoOfEmployee, (0, auth_1.authorizeRole)("employee"));
router.get("/getJobInfoOfEmployeeWithPagination", auth_1.authenticateJWT, EmployeeController_1.getJobInfoOfEmployeeWithPagination, (0, auth_1.authorizeRole)("employee"));
router.post("/getIndividualEmployeeWithJobInfo", auth_1.authenticateJWT, EmployeeController_1.getIndividualEmployeeWithJobInfo, (0, auth_1.authorizeRole)("employee"));
router.get("/getMonthlyJobCountOfEmployee", auth_1.authenticateJWT, EmployeeController_1.getMonthlyJobCountOfEmployee, (0, auth_1.authorizeRole)("employee"));
router.get("/getStatusCountOfJobs", auth_1.authenticateJWT, EmployeeController_1.getStatusCountOfJobs, (0, auth_1.authorizeRole)("employee"));
router.get("/getEmployeeJobs", auth_1.authenticateJWT, EmployeeController_1.getEmployeeJobs, (0, auth_1.authorizeRole)("employee"));
router.get("/getJobStatusById", auth_1.authenticateJWT, EmployeeController_1.getJobStatusById, (0, auth_1.authorizeRole)("employee"));
exports.default = router;
