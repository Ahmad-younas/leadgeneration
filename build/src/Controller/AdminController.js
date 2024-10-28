"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmployeeJobInfo =
  exports.getEmployeeById =
  exports.deleteAllJobs =
  exports.updateEmployeeJob =
  exports.deleteSelectedJobs =
  exports.deleteSelectedEmployees =
  exports.getEmployeeWithJobInfo =
  exports.getEmployeeInfoAndEmployeeJobInfo =
  exports.getMonthlyJobCounts =
  exports.deleteEmployee =
  exports.findAllEmployee =
  exports.updateEmployee =
  exports.addEmployee =
  exports.getJobs =
    void 0;
const Employee_1 = __importDefault(require("../Model/Employee"));
const logger_1 = __importDefault(require("../logger"));
const logger_2 = __importDefault(require("../logger"));
const Job_1 = __importDefault(require("../Model/Job"));
const auth_1 = require("../Middleware/auth");
const Month_1 = require("../Model/Month");
const sequelize_typescript_1 = require("sequelize-typescript");
const getSpreadSheetIdAndRowNumber_1 = require("../utils/getSpreadSheetIdAndRowNumber");
const spreadSheetService_1 = require("../utils/spreadSheetService");
const checkAndRefreshToken_1 = require("../utils/checkAndRefreshToken");
const updateRowInSheet_1 = require("../utils/updateRowInSheet");
const getJobs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const jobs = await Job_1.default.findAll({
      limit: limit,
      offset: offset,
    });
    const totalEmployees = await Job_1.default.count(); // Get the total number of employees
    const totalPages = Math.ceil(totalEmployees / limit);
    //const totalJobs = await Job.count();
    res.status(200).json({
      jobs,
      meta: {
        totalItems: totalEmployees,
        currentPage: page,
        totalPages: totalPages,
        itemsPerPage: limit,
      },
    });
  } catch (err) {
    if (err instanceof Error) {
      logger_1.default.error(err.message);
    }
    res.status(500).json({ message: "Error finding jobs", err });
  }
};
exports.getJobs = getJobs;
const addEmployee = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const hashedPassword = (0, auth_1.encryptedPassword)(password);
    console.log(hashedPassword);
    const newEmployee = await Employee_1.default.create({
      username: name,
      email: email,
      password: hashedPassword,
      role: role,
    });
    logger_1.default.info("Employee created");
    res
      .status(201)
      .json({ message: "Employee added successfully", Employee: newEmployee });
  } catch (err) {
    if (err instanceof Error) {
      logger_1.default.error(err.message);
    }
    res.status(500).json({ message: "Error adding user", error: err });
  }
};
exports.addEmployee = addEmployee;
/**
 * Update employee job data by ID.
 * @param {CustomRequest} req - Express request object.
 * @param {Response} res - Express response object.
 */
const updateEmployee = async (req, res) => {
  const id = req.user?.id;
  const { name, email, password, role } = req.body;
  try {
    const hashedPassword = (0, auth_1.encryptedPassword)(password);
    const updateEmployee = await Employee_1.default.update(
      {
        username: name,
        email: email,
        password: hashedPassword,
        role: role,
      },
      {
        where: {
          id,
        },
      },
    );
    console.log("updated Employee", updateEmployee);
    logger_1.default.info("Employee updated");
    res
      .status(200)
      .json({ message: "Employee updated successfully", updateEmployee });
  } catch (err) {
    if (err instanceof Error) {
      logger_1.default.error(err.message);
    }
    res.status(500).json({ message: "Error updating employee", err });
  }
};
exports.updateEmployee = updateEmployee;
const findAllEmployee = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const employees = await Employee_1.default.findAll({
      limit: limit,
      offset: offset,
    });
    const totalEmployees = await Employee_1.default.count(); // Get the total number of employees
    const totalPages = Math.ceil(totalEmployees / limit);
    const employeeData = employees.map((row) => {
      const password = row.dataValues.password
        ? (0, auth_1.decryptPassword)(row.dataValues.password)
        : undefined;
      return {
        username: row.dataValues.username,
        email: row.dataValues.email,
        password: password,
        role: row.dataValues.role,
        id: row.dataValues.id,
        link: row.dataValues.link,
      };
    });
    res.status(200).json({
      data: employeeData,
      meta: {
        totalItems: totalEmployees,
        currentPage: page,
        totalPages: totalPages,
        itemsPerPage: limit,
      },
    });
  } catch (err) {
    if (err instanceof Error) {
      console.log("err", err);
      logger_1.default.error(err.message);
    }
    res.status(500).json({ message: "Error finding employee", err });
  }
};
exports.findAllEmployee = findAllEmployee;
const deleteEmployee = async (req, res) => {
  const { id } = req.body;
  try {
    const deleted = await Employee_1.default.destroy({
      where: { id },
    });
    if (deleted) {
      logger_1.default.info(`Employee with id ${id} deleted successfully`);
      return res.status(200).json({ message: "Employee deleted successfully" });
    } else {
      logger_1.default.error(`Employee with id ${id} not found`);
      return res.status(404).json({ message: "Employee not found" });
    }
  } catch (err) {
    if (err instanceof Error) {
      logger_1.default.error(err.message);
      return res
        .status(500)
        .json({ message: "Error deleting employee", error: err.message });
    }
    return res
      .status(500)
      .json({ message: "Unknown error occurred while deleting employee" });
  }
};
exports.deleteEmployee = deleteEmployee;
const getMonthlyJobCounts = async (req, res) => {
  try {
    const results = await Month_1.Month.findAll({
      attributes: [
        [
          sequelize_typescript_1.Sequelize.fn(
            "COUNT",
            sequelize_typescript_1.Sequelize.col("jobs.id"),
          ),
          "total_jobs_on_each_month",
        ],
      ],
      include: [
        {
          model: Job_1.default,
          as: "jobs",
          attributes: [], // We don't need to select any specific job fields here
          required: false, // LEFT JOIN behavior
          where: {
            year: new Date().getFullYear(),
          },
        },
      ],
      group: ["Month.month_name"],
      order: [["id", "ASC"]],
    });
    res.status(200).json(results);
  } catch (err) {
    if (err instanceof Error) {
      logger_1.default.error(err.message);
    }
    res
      .status(500)
      .json({ message: "Error fetching job counts by month", err });
  }
};
exports.getMonthlyJobCounts = getMonthlyJobCounts;
const getEmployeeInfoAndEmployeeJobInfo = async (req, res) => {
  const { employeeJobId, employeeId } = req.body;
  console.log("employeeJobid", employeeJobId);
  console.log("employeeId", employeeId);
  try {
    // Fetch the employee information using employeeId
    const employeeInfo = await Employee_1.default.findByPk(employeeId);
    console.log("EmployeeInfo", employeeInfo);
    // Fetch the employee job information using employeeJobId
    const employeeJobInfo = await Job_1.default.findByPk(employeeJobId);
    console.log("EmployeeJobInfo", employeeJobInfo);
    if (!employeeInfo || !employeeJobInfo) {
      return res.status(404).json({
        message: "Employee or Employee Job not found",
      });
    }
    res.status(200).json({
      employeeInfo,
      employeeJobInfo,
    });
  } catch (err) {
    // Handle any unexpected errors
    if (err instanceof Error) {
      console.error(err.message);
    }
    res
      .status(500)
      .json({ message: "Error retrieving employee information", err });
  }
};
exports.getEmployeeInfoAndEmployeeJobInfo = getEmployeeInfoAndEmployeeJobInfo;
const getEmployeeWithJobInfo = async (req, res) => {
  try {
    const usersWithJobs = await Employee_1.default.findAll({
      attributes: ["username", "password", "role", "email"], // Specify the fields from the Users table
      include: [
        {
          model: Job_1.default,
          as: "jobs", // Include the EmployeeJobs model
          attributes: [
            "title",
            "firstName",
            "lastName",
            "dateOfBirth",
            "email",
            "contactNumber",
            "address",
            "postcode",
            "landlordName",
            "landlordContactNumber",
            "landlordEmail",
            "heatingType",
            "propertyType",
            "epcRating",
            "serviceType",
            "assessmentDate",
            "notes",
            "user_id",
            "month",
            "year",
          ],
          required: true, // Performs an INNER JOIN
        },
      ],
    });
    // Send the result as a response
    res.status(200).json(usersWithJobs);
  } catch (error) {
    console.error("Error fetching employee with job info:", error);
    res.status(500).json({
      message: "Failed to fetch employee with job information",
      error: error,
    });
  }
};
exports.getEmployeeWithJobInfo = getEmployeeWithJobInfo;
/**
 * @param req - The request object, containing employee IDs in the body.
 * @param res - The response object to send the status back.
 */
const deleteSelectedEmployees = async (req, res) => {
  const { employeeIds } = req.body; // Expecting an array of employee IDs from the request body
  logger_2.default.info(`employeeIds->${employeeIds}`);
  try {
    await Job_1.default.destroy({
      where: {
        user_id: employeeIds, // Assuming the foreign key in Job is named `employeeId`
      },
    });
    // Deleting multiple employees based on their IDs using Sequelize
    await Employee_1.default.destroy({
      where: {
        id: employeeIds, // `id` matches the employee IDs passed in the array
      },
    });
    res
      .status(200)
      .json({ message: "Selected employees deleted successfully." });
  } catch (error) {
    console.error("Error deleting selected employees:", error);
    res.status(500).json({ error: "Failed to delete selected employees." });
  }
};
exports.deleteSelectedEmployees = deleteSelectedEmployees;
const deleteSelectedJobs = async (req, res) => {
  const { jobIds } = req.body; // Expecting an array of employee IDs from the request body
  logger_2.default.info(`employeeIds->${jobIds}`);
  try {
    await Job_1.default.destroy({
      where: {
        id: jobIds, // `id` matches the employee IDs passed in the array
      },
    });
    res.status(200).json({ message: "Selected Deleted deleted successfully." });
  } catch (error) {
    console.error("Error deleting selected employees:", error);
    res.status(500).json({ error: "Failed to delete selected employees." });
  }
};
exports.deleteSelectedJobs = deleteSelectedJobs;
/**
 * Update employee job data by ID.
 * @param {CustomRequest} req - Express request object.
 * @param {Response} res - Express response object.
 */
const updateEmployeeJob = async (req, res) => {
  const {
    id,
    title,
    firstName,
    lastName,
    dateOfBirth,
    email,
    contactNumber,
    address,
    postcode,
    landlordName,
    landlordContactNumber,
    landlordEmail,
    agentName,
    agentContactNumber,
    agentEmail,
    heatingType,
    propertyType,
    epcRating,
    serviceType,
    assessmentDate,
    notes,
    month,
    year,
    epcBand,
    waterType,
  } = req.body;
  const userId = req.user?.id;
  const dataToUpdate = [
    title,
    firstName,
    lastName,
    dateOfBirth,
    email,
    contactNumber,
    address,
    postcode,
    landlordName,
    landlordContactNumber,
    landlordEmail,
    agentName,
    agentContactNumber,
    agentEmail,
    heatingType,
    propertyType,
    epcRating,
    serviceType,
    assessmentDate,
    notes,
    epcBand,
    waterType,
  ];
  try {
    await Job_1.default.update(
      {
        title,
        firstName,
        lastName,
        dateOfBirth,
        email,
        contactNumber,
        address,
        postcode,
        landlordName,
        landlordContactNumber,
        landlordEmail,
        agentName,
        agentContactNumber,
        agentEmail,
        heatingType,
        propertyType,
        epcRating,
        serviceType,
        assessmentDate,
        notes,
        month,
        year,
        status:
          req.body.status && req.body.status.trim() != ""
            ? req.body.status
            : "Booked",
        epcBand,
        waterType,
      },
      {
        where: {
          id: id,
        },
      },
    );
    const response = await (0,
    getSpreadSheetIdAndRowNumber_1.getSpreadSheetIdAndRowNumber)(id, userId);
    if (!response || !response.googleTokens) {
      logger_2.default.info("Employee or googleToken not found");
      return res
        .status(404)
        .json({ error: "Employee not authenticated with Google" });
    }
    let spreadsheetId = response.spreadSheetId;
    if (!spreadsheetId) {
      logger_2.default.info("spreadSheet is empty");
      spreadsheetId = await (0, spreadSheetService_1.createSpreadsheet)(
        response.googleTokens,
      );
      console.log("spreadsheetID", spreadsheetId);
      await Employee_1.default.update({ spreadsheetId }, { where: { id: id } }); // Save the updated employee record
      logger_2.default.info("spreadSheet is created");
    }
    let googleTokens =
      typeof response.googleTokens === "string"
        ? JSON.parse(response.googleTokens)
        : response.googleTokens;
    googleTokens = await (0, checkAndRefreshToken_1.refreshGoogleTokens)(
      googleTokens,
    );
    await (0, updateRowInSheet_1.updateRowInSheet)(
      dataToUpdate,
      googleTokens,
      response.spreadSheetId,
      response.rowNumber,
    );
    return res.status(200).json({
      message: "Employee job updated successfully",
    });
  } catch (error) {
    console.error("Error updating employee job:", error);
    return res
      .status(500)
      .json({ message: "Failed to update employee job", error });
  }
};
exports.updateEmployeeJob = updateEmployeeJob;
/**
 * Update employee job data by ID.
 * @param {CustomRequest} req - Express request object.
 * @param {Response} res - Express response object.
 */
const deleteAllJobs = async (req, res) => {
  try {
    // Deleting all jobs
    const deletedCount = await Job_1.default.destroy({
      where: {}, // Empty condition to match all records
    });
    console.log("deletedCount", deletedCount);
    // Check if any jobs were deleted
    if (deletedCount > 0) {
      return res.status(200).json({
        message: `${deletedCount} jobs were successfully deleted.`,
      });
    } else {
      return res.status(404).json({
        message: "No jobs found to delete.",
      });
    }
  } catch (error) {
    console.error("Error deleting all jobs:", error);
    return res.status(500).json({
      message: "Failed to delete jobs.",
      error: error,
    });
  }
};
exports.deleteAllJobs = deleteAllJobs;
/**
 * Update employee job data by ID.
 * @param {CustomRequest} req - Express request object.
 * @param {Response} res - Express response object.
 */
const getEmployeeById = async (req, res) => {
  const id = req.user?.id;
  try {
    const employee = await Employee_1.default.findByPk(id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    const customEmployee = {
      username: employee.dataValues.username,
      email: employee.dataValues.email,
      password: (0, auth_1.decryptPassword)(employee.dataValues.password),
    };
    return res.status(200).json({ employee: customEmployee });
  } catch (error) {
    console.error("Error fetching employee:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
exports.getEmployeeById = getEmployeeById;
const getEmployeeJobInfo = async (req, res) => {
  const jobId = req.params.id;
  console.log("jobId", jobId);
  try {
    const job = await Job_1.default.findByPk(jobId);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }
    res.json(job);
  } catch (error) {
    res.status(500).json({ error: "Error fetching job details" });
  }
};
exports.getEmployeeJobInfo = getEmployeeJobInfo;
