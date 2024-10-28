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
router.get(
  "/all-jobs",
  AdminController_1.getJobs,
  (0, auth_1.authorizeRole)("admin"),
);
router.post(
  "/add-employee",
  auth_1.authenticateJWT,
  (0, auth_1.authorizeRole)("admin"),
  AdminController_1.addEmployee,
);
router.patch(
  "/update-employee",
  auth_1.authenticateJWT,
  AdminController_1.updateEmployee,
  (0, auth_1.authorizeRole)("admin"),
);
router.get(
  "/all-employee",
  AdminController_1.findAllEmployee,
  (0, auth_1.authorizeRole)("admin"),
);
router.delete(
  "/delete-employee",
  AdminController_1.deleteEmployee,
  (0, auth_1.authorizeRole)("admin"),
);
router.get(
  "/get-monthly-count-job",
  AdminController_1.getMonthlyJobCounts,
  (0, auth_1.authorizeRole)("admin"),
);
router.post(
  "/get-Employee-Info-And-Employee-Job-Info",
  AdminController_1.getEmployeeInfoAndEmployeeJobInfo,
  (0, auth_1.authorizeRole)("admin"),
);
router.get(
  "/getEmployeeWithJobInfo",
  AdminController_1.getEmployeeWithJobInfo,
  (0, auth_1.authorizeRole)("admin"),
);
router.post(
  "/deleteSelectedEmployees",
  AdminController_1.deleteSelectedEmployees,
);
router.post("/deleteSelectedJobs", AdminController_1.deleteSelectedJobs);
router.put(
  "/updateEmployeeJob",
  auth_1.authenticateJWT,
  AdminController_1.updateEmployeeJob,
);
router.post(
  "/deleteAllJobs",
  auth_1.authenticateJWT,
  AdminController_1.deleteAllJobs,
);
router.get(
  "/getEmployeeById",
  auth_1.authenticateJWT,
  AdminController_1.getEmployeeById,
);
router.get(
  "/getEmployeeJobInfo/:id",
  auth_1.authenticateJWT,
  AdminController_1.getEmployeeJobInfo,
);
exports.default = router;
