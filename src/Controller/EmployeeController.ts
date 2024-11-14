import { Request, Response } from "express";
import { Employee, Job, Month } from "../Model/model";
import logger from "../logger";
import Logger from "../logger";
import { Sequelize } from "sequelize-typescript";
import { Op, WhereOptions } from "sequelize";
import { google, sheets_v4 } from "googleapis";
import { createSpreadsheet } from "../utils/spreadSheetService";
import dotenv from "dotenv";
import { refreshGoogleTokens } from "../utils/checkAndRefreshToken";

dotenv.config();
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  process.env.REDIRECT_URI!, // Can be left null if not using redirection
);

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

async function appendToSheet(
  data: (string | number)[],
  tokens: GoogleTokens,
  spreadsheetId: string,
): Promise<number> {
  Logger.info("Append to Sheet function called");

  oauth2Client.setCredentials(tokens); // Use stored tokens

  const sheets: sheets_v4.Sheets = google.sheets({
    version: "v4",
    auth: oauth2Client,
  });

  // Define the header
  const headers = [
    "Title",
    "First Name",
    "Last Name",
    "Date of Birth",
    "Email",
    "Contact Number",
    "Address",
    "Postcode",
    "Landlord Name",
    "Landlord Contact Number",
    "Landlord Email",
    "Agent Name",
    "Agent Contact Number",
    "Agent Email",
    "Heating Type",
    "Property Type",
    "EPC Rating",
    "EPC Band",
    "Water Type",
    "Service Type",
    "Assessment Date",
    "Notes",
    "Month",
    "Year",
    "Status",
  ];

  // Range for the header (top row)
  const headerRange = "Sheet1!A1:Y1"; // Adjust range based on the number of columns

  // Step 1: Check if the header already exists
  const existingHeaderResponse = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: headerRange,
  });

  const existingHeader = existingHeaderResponse.data.values;

  // Step 2: If no header exists, append the header
  if (!existingHeader || existingHeader.length === 0) {
    Logger.info("Header is missing. Appending the header.");

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: headerRange,
      valueInputOption: "RAW",
      requestBody: {
        values: [headers],
      },
    });

    Logger.info("Header appended to the sheet.");
  } else {
    Logger.info("Header already exists. Skipping header append.");
  }

  // Step 3: Append the data below the header (after the header)
  const dataRange = "Sheet1!A2"; // Assuming appending starts from row 2 onwards

  const response = await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: dataRange,
    valueInputOption: "RAW",
    requestBody: {
      values: [data], // Data to append
    },
  });
  const patter = /A(\d+)/;
  const match = response.data.updates?.updatedRange?.match(patter);
  const rowNumber: string | null = match ? match[1] : null;
  return rowNumber ? parseInt(rowNumber) : NaN;
}

//This function is used to Store the Jobs into the DB
export const addLeads = async (req: CustomRequest, res: Response) => {
  Logger.info("Add Jobs function Triggered");
  const id = req.user?.id;
  const currentDate = new Date();
  const monthIndex = currentDate.getMonth();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const {
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
    user_id,
    waterType,
    epcBand,
  } = req.body;
  try {
    const employee = await Employee.findByPk(user_id);
    const googleToken = employee?.dataValues.googleTokens;
    if (!employee || !employee?.dataValues.googleTokens) {
      Logger.info("Employee or googleToken not found");
      return res
        .status(404)
        .json({ error: "Employee not authenticated with Google" });
    }
    if (!googleToken) {
      throw new Error("Google tokens are missing for the employee.");
    }
    // Check if the employee already has a spreadsheet
    let spreadsheetId = employee.dataValues.spreadsheetId;
    // If the spreadsheet doesn't exist, create a new one
    if (!spreadsheetId) {
      Logger.info("spreadSheet is empty");
      spreadsheetId = await createSpreadsheet(googleToken);
      await Employee.update(
        { spreadsheetId },
        { where: { id: employee.dataValues.id } },
      ); // Save the updated employee record
      Logger.info("spreadSheet is created");
    }
    let googleTokens: GoogleTokens =
      typeof employee.dataValues.googleTokens === "string"
        ? JSON.parse(employee.dataValues.googleTokens)
        : employee.dataValues.googleTokens;

    if (googleTokens.expiry_date != undefined) {
      if (Date.now() >= googleTokens.expiry_date) {
        googleTokens = await refreshGoogleTokens(googleTokens);
        const googleTokensString = JSON.stringify(googleTokens);
        await Employee.update(
          { googleTokens: googleTokensString },
          {
            where: { id: id },
          },
        );
      }
    } else {
      logger.error("Token expiry date is undefined.");
    }

    const dataArray = [
      title,
      firstName,
      lastName, // Combine first and last names
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
      epcBand,
      waterType,
      serviceType,
      assessmentDate,
      notes,
      monthNames[monthIndex],
      new Date().getFullYear().toString(),
      "Booked",
    ];
    const sheetRowNumber = await appendToSheet(
      dataArray,
      googleTokens,
      spreadsheetId,
    );
    await Job.create({
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
      user_id,
      month: monthNames[monthIndex],
      year: new Date().getFullYear().toString(),
      status: "Booked",
      rowNumber: sheetRowNumber,
      waterType,
      epcBand,
    });
    logger.info("Job Successfully added into Database and GoogleSheet");
    res.status(201).json({
      message: "Job Successfully added into Database and GoogleSheet",
    });
  } catch (err) {
    if (err instanceof Error) {
      logger.error("Error", err.message);
    }
    res.status(500).json({ message: "Error adding job", error: err });
  }
};
export const getJobInfoOfEmployee = async (req: Request, res: Response) => {
  logger.info("getJobInfoOfEmployee function Called");
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const offset = (page - 1) * limit;
  const { id } = req.params;
  try {
    // Fetch users with associated employee jobs
    const usersWithJobs = await Job.findAll({
      attributes: [
        "id",
        "user_id",
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
        "dropboxFolderLink",
      ],
      where: {
        user_id: id, // Replace '1' with the actual user ID you are filtering by
      },
      limit: limit,
      offset: offset,
    });
    const totalEmployees = await Job.count({
      where: {
        user_id: id, // Ensure 'id' is defined and represents the actual user ID
      },
    });
    const totalPages = Math.ceil(totalEmployees / limit);
    res.status(200).json({
      usersWithJobs,
      meta: {
        totalItems: totalEmployees,
        currentPage: page,
        totalPages: totalPages,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    Logger.error("Error fetching employee with job info:", error);
    res.status(500).json({
      message: "Failed to fetch employee with job information",
      error: error,
    });
  }
};

export const getJobInfoOfEmployeeWithPagination = async (
  req: Request,
  res: Response,
) => {
  logger.info("getJobInfoOfEmployeeWithPagination function Called");
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const offset = (page - 1) * limit;
  const id = parseInt(req.query.id as string);
  try {
    // Fetch users with associated employee jobs
    const usersWithJobs = await Job.findAll({
      attributes: [
        "id",
        "title",
        "user_id",
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
        "dropboxFolderLink",
      ],
      where: {
        user_id: id, // Replace '1' with the actual user ID you are filtering by
      },
      limit: limit,
      offset: offset,
    });
    const totalEmployees = await Job.count({
      where: {
        user_id: id, // Ensure 'id' is defined and represents the actual user ID
      },
    });
    const totalPages = Math.ceil(totalEmployees / limit);
    res.status(200).json({
      usersWithJobs,
      meta: {
        totalItems: totalEmployees,
        currentPage: page,
        totalPages: totalPages,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    Logger.error("Error fetching employee with job info:", error);
    res.status(500).json({
      message: "Failed to fetch employee with job information",
      error: error,
    });
  }
};

export const getIndividualEmployeeWithJobInfo = async (
  req: Request,
  res: Response,
) => {
  logger.info("getIndividualEmployeeWithJobInfo function Called");
  const { employeeJobId, employeeId } = req.body;
  try {
    // Fetch users with associated employee jobs
    const employeeInfo = await Employee.findByPk(employeeId);
    // Fetch the employee job information using employeeJobId
    const employeeJobInfo = await Job.findByPk(employeeJobId);
    // Check if both employeeInfo and employeeJobInfo exist
    if (!employeeInfo || !employeeJobInfo) {
      return res.status(404).json({
        message: "Employee or Employee Job not found",
      });
    }
    res.status(200).json({
      employeeInfo,
      employeeJobInfo,
    });
  } catch (error) {
    Logger.error("Error fetching employee with job info:", error);
    res.status(500).json({
      message: "Failed to fetch employee with job information",
      error: error,
    });
  }
};
export const getMonthlyJobCountOfEmployee = async (
  req: Request,
  res: Response,
) => {
  logger.info("getMonthlyJobCountOfEmployee function Called");
  const id = parseInt(req.query.id as string);
  try {
    if (!id) {
      return res.status(400).json({
        message: "Missing 'userId' or 'year' query parameter",
      });
    }

    const monthlyJobCounts = await Month.findAll({
      attributes: [
        "month_name",
        [
          Sequelize.fn("COUNT", Sequelize.col("jobs.id")),
          "total_jobs_on_each_month",
        ], // Count the total jobs for each month
      ],
      include: [
        {
          model: Job,
          as: "jobs", // Use the alias defined in the association
          attributes: [], // Exclude all attributes from Job, only need the count
          where: {
            year: new Date().getFullYear(), // Filter by year
            user_id: id, // Filter by the provided user ID
          },
          required: false, // Ensures a LEFT JOIN
        },
      ],
      group: ["Month.month_name"], // Group by the month_name column
      raw: true, // Use raw SQL for more control
    });

    res.status(200).json(monthlyJobCounts);
  } catch (error) {
    Logger.error("Error fetching monthly job count:", error);
    res.status(500).json({
      message: "Failed to fetch monthly job count",
      error: error,
    });
  }
};

export const getStatusCountOfJobs = async (req: Request, res: Response) => {
  logger.info("getStatusCountOfJobs function Called");
  const id = parseInt(req.query.user_id as string);
  try {
    // Ensure userId and year are provided and valid
    if (!id) {
      return res.status(400).json({
        message: "Missing 'userId' or 'year' query parameter",
      });
    }
    // Perform the Sequelize query to get the monthly job count
    const monthlyJobCounts = await Job.findAll({
      attributes: [
        "status",
        [Sequelize.fn("COUNT", Sequelize.col("status")), "status_count"],
      ],
      where: {
        status: {
          [Op.ne]: null, // Exclude null statuses
        },
        user_id: id, // Filter by user_id = '3'
      } as WhereOptions,
      group: ["status"], // Group by the 'status' column
    });

    // Send the result as a response
    res.status(200).json(monthlyJobCounts);
  } catch (error) {
    Logger.error("Error fetching monthly job count:", error);
    res.status(500).json({
      message: "Failed to fetch monthly job count",
      error: error,
    });
  }
};
// Controller function to get employee jobs for Excel Sheet
export const getEmployeeJobs = async (req: Request, res: Response) => {
  logger.info("getEmployeeJobs function Called");
  const id = req.query.id as string;
  try {
    const employeeJobs = await Job.findAll({
      where: {
        user_id: id, // Use req.params or req.body to dynamically set user_id if needed
      },
    });

    if (employeeJobs.length === 0) {
      return res
        .status(404)
        .json({ message: "No employee jobs found for the specified user." });
    }
    // Respond with the fetched jobs
    res.status(200).json(employeeJobs);
  } catch (error) {
    // Handle any errors during the fetch
    Logger.error("Error fetching employee jobs:", error);
    res.status(500).json({
      message: "An error occurred while fetching employee jobs.",
      error,
    });
  }
};

export const getJobStatusById = async (req: CustomRequest, res: Response) => {
  logger.info("getJobStatusById function Called");
  const id = req.user?.id;
  try {
    const usersWithJobs = await Job.findAll({
      attributes: ["id", "title", "status", "job_creation_date"],
      where: {
        user_id: id, // Replace '1' with the actual user ID you are filtering by
      },
    });
    res.status(200).json({ usersWithJobs });
  } catch (error) {
    Logger.error("Error fetching employee with job info:", error);
    res.status(500).json({
      message: "Failed to fetch employee with job information",
      error: error,
    });
  }
};
