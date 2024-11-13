import express from "express";
import { authenticateJWT, authorizeRole } from "../Middleware/auth";
import {
  addLeads,
  getEmployeeJobs,
  getIndividualEmployeeWithJobInfo,
  getJobInfoOfEmployee,
  getJobInfoOfEmployeeWithPagination,
  getJobStatusById,
  getMonthlyJobCountOfEmployee,
  getStatusCountOfJobs,
} from "../Controller/EmployeeController";

const router = express.Router();
router.post("/add-job", authenticateJWT, addLeads, authorizeRole("employee"));
router.get(
  "/getJobInfoOfEmployee/:id",
  authenticateJWT,
  getJobInfoOfEmployee,
  authorizeRole("employee"),
);
router.get(
  "/getJobInfoOfEmployeeWithPagination",
  authenticateJWT,
  getJobInfoOfEmployeeWithPagination,
  authorizeRole("employee"),
);
router.post(
  "/getIndividualEmployeeWithJobInfo",
  authenticateJWT,
  getIndividualEmployeeWithJobInfo,
  authorizeRole("employee"),
);
router.get(
  "/getMonthlyJobCountOfEmployee",
  authenticateJWT,
  getMonthlyJobCountOfEmployee,
  authorizeRole("employee"),
);
router.get(
  "/getStatusCountOfJobs",
  authenticateJWT,
  getStatusCountOfJobs,
  authorizeRole("employee"),
);
router.get(
  "/getEmployeeJobs",
  authenticateJWT,
  getEmployeeJobs,
  authorizeRole("employee"),
);
router.get(
  "/getJobStatusById",
  authenticateJWT,
  getJobStatusById,
  authorizeRole("employee"),
);

export default router;
