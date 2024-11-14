import { Request, Response } from "express";
import Employee from "../Model/Employee";
import logger from "../logger";
import Logger from "../logger";
import Job from "../Model/Job";
import { decryptPassword, encryptedPassword } from "../Middleware/auth";
import { Month } from "../Model/Month";
import { Sequelize } from "sequelize-typescript";
import { getSpreadSheetIdAndRowNumber } from "../utils/getSpreadSheetIdAndRowNumber";
import { createSpreadsheet } from "../utils/spreadSheetService";
import { refreshGoogleTokens } from "../utils/checkAndRefreshToken";
import { updateRowInSheet } from "../utils/updateRowInSheet";

interface GoogleTokens {
  access_token?: string;
  refresh_token?: string;
  scope?: string;
  token_type?: string;
  expiry_date?: number;
}

interface User {
  role: string;
  id: string;
  email: string;
}
interface CustomRequest extends Request {
  user?: User;
}

export const getJobs = async (req: Request, res: Response) => {
  Logger.info("getJobs Function Called");
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;
    const jobs = await Job.findAll({
      limit: limit,
      offset: offset,
    });
    const totalEmployees = await Job.count(); // Get the total number of employees
    const totalPages = Math.ceil(totalEmployees / limit);
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
      logger.error(err.message);
    }
    res.status(500).json({ message: "Error finding jobs", err });
  }
};
export const addEmployee = async (req: Request, res: Response) => {
  Logger.info("addEmployee Function Called");
  const { name, email, password, role } = req.body;
  try {
    const checkEmployee = await Employee.findOne({ where: { email: email } });
    if (checkEmployee) {
      return res.status(302).json({
        message: "An employee is already registered with this email.",
      });
    }
    const hashedPassword = encryptedPassword(password);
    const newEmployee = await Employee.create({
      username: name,
      email: email,
      password: hashedPassword,
      role: role,
    });
    logger.info("Employee created");
    res
      .status(201)
      .json({ message: "Employee added successfully", Employee: newEmployee });
  } catch (err) {
    if (err instanceof Error) {
      logger.error(err.message);
    }
    res.status(500).json({ message: "Error adding user", error: err });
  }
};

/**
 * Update employee job data by ID.
 * @param {CustomRequest} req - Express request object.
 * @param {Response} res - Express response object.
 */
export const updateAdmin = async (req: CustomRequest, res: Response) => {
  logger.info("UpdateAdmin Function Called");
  const id = req.user?.id;
  const { name, email, password } = req.body;
  try {
    const hashedPassword = encryptedPassword(password);
    await Employee.update(
      {
        username: name,
        email: email,
        password: hashedPassword,
      },
      {
        where: {
          id,
        },
      },
    );
    logger.info("Employee updated");
    res.status(200).json({ message: "Employee updated successfully" });
  } catch (err) {
    if (err instanceof Error) {
      logger.error(err.message);
    }
    res.status(500).json({ message: "Error updating employee", err });
  }
};

export const findAllEmployee = async (req: Request, res: Response) => {
  Logger.info("findAllEmployee Function Called");
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;
    const employees = await Employee.findAll({
      where: { role: "employee" },
      limit: limit,
      offset: offset,
    });
    const totalEmployees = await Employee.count(); // Get the total number of employees
    const totalPages = Math.ceil(totalEmployees / limit);
    const employeeData = employees.map((row) => {
      const password = row.dataValues.password
        ? decryptPassword(row.dataValues.password)
        : undefined;
      return {
        username: row.dataValues.username,
        email: row.dataValues.email,
        password: password,
        role: row.dataValues.role,
        id: row.dataValues.id,
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
      logger.error(err.message);
    }
    res.status(500).json({ message: "Error finding employee", err });
  }
};

export const deleteEmployee = async (req: Request, res: Response) => {
  Logger.info("deleteEmployee Function Called");
  const { id } = req.body;
  try {
    const deleted = await Employee.destroy({
      where: { id },
    });

    if (deleted) {
      logger.info(`Employee with id ${id} deleted successfully`);
      return res.status(200).json({ message: "Employee deleted successfully" });
    } else {
      logger.error(`Employee with id ${id} not found`);
      return res.status(404).json({ message: "Employee not found" });
    }
  } catch (err) {
    if (err instanceof Error) {
      logger.error(err.message);
      return res
        .status(500)
        .json({ message: "Error deleting employee", error: err.message });
    }
    return res
      .status(500)
      .json({ message: "Unknown error occurred while deleting employee" });
  }
};
export const getMonthlyJobCounts = async (req: Request, res: Response) => {
  Logger.info("getMonthlyJobCounts Function Called");
  try {
    const results = await Month.findAll({
      attributes: [
        [
          Sequelize.fn("COUNT", Sequelize.col("jobs.id")),
          "total_jobs_on_each_month",
        ],
      ],
      include: [
        {
          model: Job,
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
      logger.error(err.message);
    }
    res
      .status(500)
      .json({ message: "Error fetching job counts by month", err });
  }
};

export const getEmployeeInfoAndEmployeeJobInfo = async (
  req: Request,
  res: Response,
) => {
  Logger.info("getEmployeeInfoAndEmployeeJobInfo Function Called");
  const { employeeJobId, employeeId } = req.body;
  try {
    const employeeInfo = await Employee.findByPk(employeeId);
    const employeeJobInfo = await Job.findByPk(employeeJobId);
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
      Logger.error("Error", err);
    }
    res
      .status(500)
      .json({ message: "Error retrieving employee information", err });
  }
};

export const getEmployeeWithJobInfo = async (req: Request, res: Response) => {
  Logger.info("getEmployeeWithJobInfo Function Called");
  try {
    const usersWithJobs = await Employee.findAll({
      attributes: ["username", "password", "role", "email"], // Specify the fields from the Users table
      include: [
        {
          model: Job,
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

    res.status(200).json(usersWithJobs);
  } catch (error) {
    Logger.error("Error fetching employee with job info:", error);
    res.status(500).json({
      message: "Failed to fetch employee with job information",
      error: error,
    });
  }
};

/**
 * @param req - The request object, containing employee IDs in the body.
 * @param res - The response object to send the status back.
 */
export const deleteSelectedEmployees = async (req: Request, res: Response) => {
  Logger.info("deleteSelectedEmployees Function Called");
  const { employeeIds } = req.body; // Expecting an array of employee IDs from the request body
  try {
    await Job.destroy({
      where: {
        user_id: employeeIds, // Assuming the foreign key in Job is named `employeeId`
      },
    });
    // Deleting multiple employees based on their IDs using Sequelize
    await Employee.destroy({
      where: {
        id: employeeIds, // `id` matches the employee IDs passed in the array
      },
    });

    res
      .status(200)
      .json({ message: "Selected employees deleted successfully." });
  } catch (error) {
    Logger.error("Error deleting selected employees:", error);
    res.status(500).json({ error: "Failed to delete selected employees." });
  }
};

export const deleteSelectedJobs = async (req: Request, res: Response) => {
  Logger.info("deleteSelectedJobs Function Called");
  const { jobIds } = req.body; // Expecting an array of employee IDs from the request body
  try {
    await Job.destroy({
      where: {
        id: jobIds, // `id` matches the employee IDs passed in the array
      },
    });

    res.status(200).json({ message: "Selected Deleted deleted successfully." });
  } catch (error) {
    Logger.error("Error deleting selected employees:", error);
    res.status(500).json({ error: "Failed to delete selected employees." });
  }
};

/**
 * Update employee job data by ID.
 * @param {CustomRequest} req - Express request object.
 * @param {Response} res - Express response object.
 */
export const updateEmployeeJob = async (req: CustomRequest, res: Response) => {
  Logger.info("updateEmployeeJob Function Called");
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
    await Job.update(
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
    const response = await getSpreadSheetIdAndRowNumber(id, userId);
    if (!response || !response.googleTokens) {
      Logger.info("Employee or googleToken not found");
      return res
        .status(404)
        .json({ error: "Employee not authenticated with Google" });
    }

    let spreadsheetId = response.spreadSheetId;
    if (!spreadsheetId) {
      Logger.info("spreadSheet is empty");
      spreadsheetId = await createSpreadsheet(response.googleTokens);
      await Employee.update({ spreadsheetId }, { where: { id: id } }); // Save the updated employee record
      Logger.info("spreadSheet is created");
    }

    let googleTokens: GoogleTokens =
      typeof response.googleTokens === "string"
        ? JSON.parse(response.googleTokens)
        : response.googleTokens;

    if (googleTokens.expiry_date != undefined) {
      if (Date.now() >= googleTokens.expiry_date) {
        googleTokens = await refreshGoogleTokens(googleTokens);
        await Employee.update(
          { googleTokens: JSON.stringify(googleTokens) },
          {
            where: { id: id },
          },
        );
      }
      logger.info("GoogleToken in DB successfully Updated");
    } else {
      logger.error("Token expiry date is undefined.");
    }

    await updateRowInSheet(
      dataToUpdate,
      googleTokens,
      response.spreadSheetId,
      response.rowNumber,
    );
    return res.status(200).json({
      message: "Employee job updated successfully",
    });
  } catch (error) {
    Logger.error("Error updating employee job:", error);
    return res
      .status(500)
      .json({ message: "Failed to update employee job", error });
  }
};

/**
 * Update employee job data by ID.
 * @param {CustomRequest} req - Express request object.
 * @param {Response} res - Express response object.
 */
export const deleteAllJobs = async (req: CustomRequest, res: Response) => {
  Logger.info("deleteAllJobs Function Called");
  try {
    // Deleting all jobs
    const deletedCount = await Job.destroy({
      where: {}, // Empty condition to match all records
    });
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
    Logger.error("Error deleting all jobs:", error);
    return res.status(500).json({
      message: "Failed to delete jobs.",
      error: error,
    });
  }
};

/**
 * Update employee job data by ID.
 * @param {CustomRequest} req - Express request object.
 * @param {Response} res - Express response object.
 */
export const getEmployeeById = async (req: CustomRequest, res: Response) => {
  Logger.info("getEmployeeById Function Called");
  const id = req.user?.id;
  try {
    const employee = await Employee.findByPk(id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    const customEmployee = {
      username: employee.dataValues.username,
      email: employee.dataValues.email,
      password: decryptPassword(employee.dataValues.password),
    };

    return res.status(200).json({ employee: customEmployee });
  } catch (error) {
    Logger.error("Error fetching employee:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getEmployeeJobInfo = async (req: Request, res: Response) => {
  Logger.info("getEmployeeJobInfo Function Called");
  const jobId = req.params.id;
  try {
    const job = await Job.findByPk(jobId);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }
    res.json(job);
  } catch (error) {
    res.status(500).json({ error: "Error fetching job details" });
  }
};
export const authWithDropBox = async (req: CustomRequest, res: Response) => {
  Logger.info("authWithDropBox Function Called");
  const id = req.user?.id;
  const user = await Employee.findByPk(id);
  if (user?.dataValues.dropboxAccessToken) {
    logger.info("Already authenticated With Dropbox");
    res.status(201).json({ message: "Already authenticated With Dropbox" });
  } else {
    res.status(204).json({ message: "Link Not Found" });
  }
};
export const getAllJobStatus = async (req: Request, res: Response) => {
  Logger.info("getAllJobStatus Function Called");
  try {
    const allUserJobs = await Job.findAll({
      attributes: [
        "id",
        "title",
        "status",
        "job_creation_date", // Make sure this matches the exact column name in your database
      ],
    });
    res.status(200).json(allUserJobs);
  } catch (error) {
    Logger.error("Error retrieving job statuses:", error);
    res.status(500).json({ error: "Failed to retrieve job statuses." });
  }
};
/**
 * Update employee job data by ID.
 * @param {CustomRequest} req - Express request object.
 * @param {Response} res - Express response object.
 */
export const updateEmployee = async (req: CustomRequest, res: Response) => {
  logger.info("UpdateEmployee Function Called");
  const { id, name, email, password, role } = req.body;
  try {
    const hashedPassword = encryptedPassword(password);
    await Employee.update(
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
    logger.info("Employee updated");
    res.status(200).json({ message: "Employee updated successfully" });
  } catch (err) {
    if (err instanceof Error) {
      logger.error(err.message);
    }
    res.status(500).json({ message: "Error updating employee", err });
  }
};
