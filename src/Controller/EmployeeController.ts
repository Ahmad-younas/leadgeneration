import { Request, Response } from "express";
import { Employee, Job, Month } from "../Model/model";
import logger from "../logger";
import Logger from "../logger";
import { Sequelize } from "sequelize-typescript";
import { Op, WhereOptions } from "sequelize";
import { google, sheets_v4 } from "googleapis";
import { Dropbox } from "dropbox";

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

//This function Get all the Jobs
export const getLeads = (req: Request, res: Response) => {
  res.send("Leads Add Successfully").status(201);
};
export const updateLeads = (req: Request, res: Response) => {
  res.send("Update Add Successfully").status(201);
};

// Send Data to Google Sheet After Authorization
async function appendToSheet(
  data: (string | number)[],
  tokens: GoogleTokens,
  spreadsheetId: string,
): Promise<void> {
  Logger.info("Append to Sheet function called");
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials(tokens); // Use stored tokens

  const sheets: sheets_v4.Sheets = google.sheets({
    version: "v4",
    auth: oauth2Client,
  });

  // Replace with your actual spreadsheet ID
  const range = "Sheet1!A1"; // Adjust range as needed

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: "RAW",
    requestBody: {
      values: [data],
    },
  });
}

// Function End

//This function is used to Store the Jobs into the DB
export const addLeads = async (req: CustomRequest, res: Response) => {
  Logger.info("Add Jobs function Triggered");
  const id = req.user?.id;
  console.log("req", req);
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
  const currentDate = new Date();
  const monthIndex = currentDate.getMonth();
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
  } = req.body;
  try {
    // const employee = await Employee.findByPk(user_id);
    // const googleToken = employee?.googleTokens;
    // if (!employee || !employee.googleTokens) {
    //   Logger.info("Employee or googleToken not found");
    //   return res
    //     .status(404)
    //     .json({ error: "Employee not found or not authenticated" });
    // }
    //
    // if (!googleToken) {
    //   throw new Error("Google tokens are missing for the employee.");
    // }
    // Check if the employee already has a spreadsheet
    // let spreadsheetId = employee.spreadsheetId;

    // If the spreadsheet doesn't exist, create a new one
    // if (!spreadsheetId) {
    //   Logger.info("spreadSheet is empty");
    //   spreadsheetId = await createSpreadsheet(googleToken);
    //   employee.spreadsheetId = spreadsheetId; // Save the new spreadsheet ID to the employee record
    //   await employee.save(); // Save the updated employee record
    //   Logger.info("spreadSheet is created");
    // }
    // const googleTokens: GoogleTokens =
    //   typeof employee.googleTokens === "string"
    //     ? JSON.parse(employee.googleTokens)
    //     : employee.googleTokens;

    // const dataArray = [
    //   title,
    //   firstName,
    //   lastName, // Combine first and last names
    //   dateOfBirth,
    //   email,
    //   contactNumber,
    //   address,
    //   postcode,
    //   landlordName,
    //   landlordContactNumber,
    //   landlordEmail,
    //   agentName,
    //   agentContactNumber,
    //   agentEmail,
    //   heatingType,
    //   propertyType,
    //   epcRating,
    //   serviceType,
    //   assessmentDate,
    //   notes,
    //   user_id,
    // ];
    //await appendToSheet(dataArray, googleTokens, spreadsheetId);
    const newJob = await Job.create({
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
    });

    const user = await Employee.findByPk(id);
    if (user?.dataValues.link) {
      logger.info("Job created Successfully");
      res.status(201).json({ message: "Job added successfully" });
    } else {
      res.status(204).json({ message: "Link Not Found" });
    }
  } catch (err) {
    if (err instanceof Error) {
      logger.error(err.message);
    }
    res.status(500).json({ message: "Error adding job", error: err });
  }
};
export const getJobInfoOfEmployee = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const offset = (page - 1) * limit;
  const { id } = req.params;
  console.log("id", id);
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
    console.error("Error fetching employee with job info:", error);
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
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const offset = (page - 1) * limit;
  const id = parseInt(req.query.id as string);
  console.log("id", id);
  try {
    // Fetch users with associated employee jobs
    const usersWithJobs = await Job.findAll({
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
    console.error("Error fetching employee with job info:", error);
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
  const { employeeJobId, employeeId } = req.body;
  console.log("employeeJobId", employeeJobId);
  console.log("employeeId", employeeId);
  try {
    // Fetch users with associated employee jobs
    const employeeInfo = await Employee.findByPk(employeeId);
    console.log("employeeInfo", employeeInfo);

    // Fetch the employee job information using employeeJobId
    const employeeJobInfo = await Job.findByPk(employeeJobId);
    console.log("employeeJobInfo", employeeJobInfo);

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
    console.error("Error fetching employee with job info:", error);
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
  // Extract the userId and year from the request query parameters
  const id = parseInt(req.query.id as string);
  console.log("id", id);

  try {
    // Ensure userId and year are provided and valid
    if (!id) {
      return res.status(400).json({
        message: "Missing 'userId' or 'year' query parameter",
      });
    }

    // Perform the Sequelize query to get the monthly job count
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
    console.log(monthlyJobCounts);

    // Send the result as a response
    res.status(200).json(monthlyJobCounts);
  } catch (error) {
    console.error("Error fetching monthly job count:", error);
    res.status(500).json({
      message: "Failed to fetch monthly job count",
      error: error,
    });
  }
};

export const getStatusCountOfJobs = async (req: Request, res: Response) => {
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
    console.error("Error fetching monthly job count:", error);
    res.status(500).json({
      message: "Failed to fetch monthly job count",
      error: error,
    });
  }
};
// Controller function to get employee jobs for Excel Sheet
export const getEmployeeJobs = async (req: Request, res: Response) => {
  const id = req.query.id as string;

  try {
    // Fetch employee jobs where user_id is 3
    const employeeJobs = await Job.findAll({
      where: {
        user_id: id, // Use req.params or req.body to dynamically set user_id if needed
      },
    });

    // Check if jobs were found
    if (employeeJobs.length === 0) {
      return res
        .status(404)
        .json({ message: "No employee jobs found for the specified user." });
    }

    // Respond with the fetched jobs
    res.status(200).json(employeeJobs);
  } catch (error) {
    // Handle any errors during the fetch
    console.error("Error fetching employee jobs:", error);
    res.status(500).json({
      message: "An error occurred while fetching employee jobs.",
      error,
    });
  }
};

// Create a folder for the user
export const createDropboxFolder = async (req: Request, res: Response) => {
  try {
    const { accessToken, employeeId } = req.body; // Use the access token obtained previously

    // Initialize Dropbox client with the user's Access Token
    const dbx = new Dropbox({ accessToken });

    // Create a unique folder name based on employee ID
    const folderName = `/Employee_${employeeId}_Folder`;

    // Create the folder in Dropbox
    const folderResponse = await dbx.filesCreateFolderV2({ path: folderName });

    res.status(201).json({
      message: "Folder created successfully",
      folderId: folderResponse.result.metadata.id,
    });
  } catch (error) {
    console.error("Error creating Dropbox folder:", error);
    res.status(500).json({ error: "Failed to create Dropbox folder" });
  }
};
