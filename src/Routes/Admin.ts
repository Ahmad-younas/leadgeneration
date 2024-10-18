import express from "express";
import { authenticateJWT, authorizeRole } from "../Middleware/auth";
import {
  addEmployee,
  deleteAllJobs,
  deleteEmployee,
  deleteSelectedEmployees,
  deleteSelectedJobs,
  findAllEmployee,
  getEmployeeById,
  getEmployeeInfoAndEmployeeJobInfo,
  getEmployeeWithJobInfo,
  getJobs,
  getMonthlyJobCounts,
  updateEmployee,
  updateEmployeeJob,
} from "../Controller/AdminController";

const router = express.Router();

router.get("/all-jobs", getJobs, authorizeRole("admin"));
router.post(
  "/add-employee",
  authenticateJWT,
  authorizeRole("admin"),
  addEmployee,
);
router.patch(
  "/update-employee",
  authenticateJWT,
  updateEmployee,
  authorizeRole("admin"),
);
router.get("/all-employee", findAllEmployee, authorizeRole("admin"));
router.delete("/delete-employee", deleteEmployee, authorizeRole("admin"));
router.get(
  "/get-monthly-count-job",
  getMonthlyJobCounts,
  authorizeRole("admin"),
);
router.post(
  "/get-Employee-Info-And-Employee-Job-Info",
  getEmployeeInfoAndEmployeeJobInfo,
  authorizeRole("admin"),
);

router.get(
  "/getEmployeeWithJobInfo",
  getEmployeeWithJobInfo,
  authorizeRole("admin"),
);
router.post("/deleteSelectedEmployees", deleteSelectedEmployees);

router.post("/deleteSelectedJobs", deleteSelectedJobs);
router.put("/updateEmployeeJob", authenticateJWT, updateEmployeeJob);
router.post("/deleteAllJobs", authenticateJWT, deleteAllJobs);
router.get("/getEmployeeById", authenticateJWT, getEmployeeById);
export default router;
