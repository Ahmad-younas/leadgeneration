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
router.get(
  "/dashboard",
  auth_1.authenticateJWT,
  EmployeeController_1.getLeads,
  (0, auth_1.authorizeRole)("employee"),
);
router.post(
  "/add-job",
  auth_1.authenticateJWT,
  EmployeeController_1.addLeads,
  (0, auth_1.authorizeRole)("employee"),
);
router.post(
  "/updateLeads",
  EmployeeController_1.updateLeads,
  (0, auth_1.authorizeRole)("employee"),
);
router.get(
  "/getJobInfoOfEmployee/:id",
  EmployeeController_1.getJobInfoOfEmployee,
  (0, auth_1.authorizeRole)("employee"),
);
router.get(
  "/getJobInfoOfEmployeeWithPagination",
  EmployeeController_1.getJobInfoOfEmployeeWithPagination,
  (0, auth_1.authorizeRole)("employee"),
);
router.post(
  "/getIndividualEmployeeWithJobInfo",
  EmployeeController_1.getIndividualEmployeeWithJobInfo,
  (0, auth_1.authorizeRole)("employee"),
);
router.get(
  "/getMonthlyJobCountOfEmployee",
  EmployeeController_1.getMonthlyJobCountOfEmployee,
  (0, auth_1.authorizeRole)("employee"),
);
router.get(
  "/getStatusCountOfJobs",
  EmployeeController_1.getStatusCountOfJobs,
  (0, auth_1.authorizeRole)("employee"),
);
router.get(
  "/getEmployeeJobs",
  EmployeeController_1.getEmployeeJobs,
  (0, auth_1.authorizeRole)("employee"),
);
router.get(
  "/getJobStatusById",
  auth_1.authenticateJWT,
  EmployeeController_1.getJobStatusById,
  (0, auth_1.authorizeRole)("employee"),
);
exports.default = router;
