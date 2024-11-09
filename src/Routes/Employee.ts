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
  getJobInfoOfEmployee,
  authorizeRole("employee"),
);
router.get(
  "/getJobInfoOfEmployeeWithPagination",
  getJobInfoOfEmployeeWithPagination,
  authorizeRole("employee"),
);

router.post(
  "/getIndividualEmployeeWithJobInfo",
  getIndividualEmployeeWithJobInfo,
  authorizeRole("employee"),
);
router.get(
  "/getMonthlyJobCountOfEmployee",
  getMonthlyJobCountOfEmployee,
  authorizeRole("employee"),
);

router.get(
  "/getStatusCountOfJobs",
  getStatusCountOfJobs,
  authorizeRole("employee"),
);
router.get("/getEmployeeJobs", getEmployeeJobs, authorizeRole("employee"));

router.get(
  "/getJobStatusById",
  authenticateJWT,
  getJobStatusById,
  authorizeRole("employee"),
);

export default router;
