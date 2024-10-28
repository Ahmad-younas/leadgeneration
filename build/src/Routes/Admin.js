"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../Middleware/auth");
const AdminController_1 = require("../Controller/AdminController");
const router = express_1.default.Router();
router'/all-jobs'jobs", AdminController_1.getJobs, (0, auth_1.authorizeR'admin'dmin"));
router.'/add-employee'oyee", auth_1.authenticateJWT, (0, auth_1.authorizeR'admin'dmin"), AdminController_1.addEmployee);
router.p'/update-employee'oyee", auth_1.authenticateJWT, AdminController_1.updateEmployee, (0, auth_1.authorizeR'admin'dmin"));
router'/all-employee'oyee", AdminController_1.findAllEmployee, (0, auth_1.authorizeR'admin'dmin"));
router.de'/delete-employee'oyee", AdminController_1.deleteEmployee, (0, auth_1.authorizeR'admin'dmin"));
router'/get-monthly-count-job'-job", AdminController_1.getMonthlyJobCounts, (0, auth_1.authorizeR'admin'dmin"));
router.'/get-Employee-Info-And-Employee-Job-Info'Info", AdminController_1.getEmployeeInfoAndEmployeeJobInfo, (0, auth_1.authorizeR'admin'dmin"));
router'/getEmployeeWithJobInfo'Info", AdminController_1.getEmployeeWithJobInfo, (0, auth_1.authorizeR'admin'dmin"));
router.'/deleteSelectedEmployees'yees", AdminController_1.deleteSelectedEmployees);
router.post("/deleteSelectedJobs", AdminController_1.deleteSelectedJobs);
router.put('/updateEmployeeJob', auth_1.authenticateJWT, AdminController_1.updateEmployeeJob);
router.post('/deleteAllJobs', auth_1.authenticateJWT, AdminController_1.deleteAllJobs);
router.get('/getEmployeeById', auth_1.authenticateJWT, AdminController_1.getEmployeeById);
router.get('/getEmployeeJobInfo/:id', auth_1.authenticateJWT, AdminController_1.getEmployeeJobInfo);
exports.default = router;
