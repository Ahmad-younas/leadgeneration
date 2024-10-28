"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../Middleware/auth");
const EmployeeController_1 = require("../Controller/EmployeeController");
const router = express_1.default.Router();
router'/dashboard'oard", auth_1.authenticateJWT, EmployeeController_1.getLeads, (0, auth_1.authorizeR'employee'oyee"));
router.'/add-job'-job", auth_1.authenticateJWT, EmployeeController_1.addLeads, (0, auth_1.authorizeR'employee'oyee"));
router.'/updateLeads'eads", EmployeeController_1.updateLeads, (0, auth_1.authorizeR'employee'oyee"));
router'/getJobInfoOfEmployee/:id'/:id", EmployeeController_1.getJobInfoOfEmployee, (0, auth_1.authorizeR'employee'oyee"));
router'/getJobInfoOfEmployeeWithPagination'tion", EmployeeController_1.getJobInfoOfEmployeeWithPagination, (0, auth_1.authorizeR'employee'oyee"));
router.'/getIndividualEmployeeWithJobInfo'Info", EmployeeController_1.getIndividualEmployeeWithJobInfo, (0, auth_1.authorizeR'employee'oyee"));
router'/getMonthlyJobCountOfEmployee'oyee", EmployeeController_1.getMonthlyJobCountOfEmployee, (0, auth_1.authorizeR'employee'oyee"));
router'/getStatusCountOfJobs'Jobs", EmployeeController_1.getStatusCountOfJobs, (0, auth_1.authorizeR'employee'oyee"));
router'/getEmployeeJobs'Jobs", EmployeeController_1.getEmployeeJobs, (0, auth_1.authorizeR'employee'oyee"));
router'/getJobStatusById'ById", auth_1.authenticateJWT, EmployeeController_1.getJobStatusById, (0, auth_1.authorizeR'employee'oyee"));
exports.default = router;
