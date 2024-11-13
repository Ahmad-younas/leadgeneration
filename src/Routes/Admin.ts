import express from "express";
import { authenticateJWT, authorizeRole } from "../Middleware/auth";
import {
  addEmployee,
  authWithDropBox,
  deleteAllJobs,
  deleteEmployee,
  deleteSelectedEmployees,
  deleteSelectedJobs,
  findAllEmployee,
  getAllJobStatus,
  getEmployeeById,
  getEmployeeInfoAndEmployeeJobInfo,
  getEmployeeJobInfo,
  getEmployeeWithJobInfo,
  getJobs,
  getMonthlyJobCounts,
  updateAdmin,
  updateEmployee,
  updateEmployeeJob,
} from "../Controller/AdminController";
import { createFolderInDropBox } from "../Controller/dropboxController";
const router = express.Router();
router.get("/all-jobs", authenticateJWT, getJobs, authorizeRole("admin"));
router.post(
  "/add-employee",
  authenticateJWT,
  addEmployee,
  authorizeRole("admin"),
);
router.patch(
  "/update-admin",
  authenticateJWT,
  updateAdmin,
  authorizeRole("admin"),
);
router.get(
  "/all-employee",
  authenticateJWT,
  findAllEmployee,
  authorizeRole("admin"),
);
router.delete(
  "/delete-employee",
  authenticateJWT,
  deleteEmployee,
  authorizeRole("admin"),
);
router.get(
  "/get-monthly-count-job",
  authenticateJWT,
  getMonthlyJobCounts,
  authorizeRole("admin"),
);
router.post(
  "/get-Employee-Info-And-Employee-Job-Info",
  authenticateJWT,
  getEmployeeInfoAndEmployeeJobInfo,
  authorizeRole("admin"),
);
router.get(
  "/getEmployeeWithJobInfo",
  authenticateJWT,
  getEmployeeWithJobInfo,
  authorizeRole("admin"),
);
router.post(
  "/deleteSelectedEmployees",
  authenticateJWT,
  deleteSelectedEmployees,
);
router.post("/deleteSelectedJobs", authenticateJWT, deleteSelectedJobs);
router.put("/updateEmployeeJob", authenticateJWT, updateEmployeeJob);
router.post("/deleteAllJobs", authenticateJWT, deleteAllJobs);
router.get("/getEmployeeById", authenticateJWT, getEmployeeById);
router.get("/getEmployeeJobInfo/:id", authenticateJWT, getEmployeeJobInfo);
router.get("/authWithDropBox", authenticateJWT, authWithDropBox);
router.post(
  "/createFolderInDropBox/:id",
  authenticateJWT,
  createFolderInDropBox,
);
router.patch("/updateEmployee", authenticateJWT, updateEmployee);
router.get("/getAllJobStatus", authenticateJWT, getAllJobStatus);
export default router;
