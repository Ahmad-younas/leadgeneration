"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJobStatusById = exports.getEmployeeJobs = exports.getStatusCountOfJobs = exports.getMonthlyJobCountOfEmployee = exports.getIndividualEmployeeWithJobInfo = exports.getJobInfoOfEmployeeWithPagination = exports.getJobInfoOfEmployee = exports.addLeads = void 0;
const model_1 = require("../Model/model");
const logger_1 = __importDefault(require("../logger"));
const logger_2 = __importDefault(require("../logger"));
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_1 = require("sequelize");
const googleapis_1 = require("googleapis");
const spreadSheetService_1 = require("../utils/spreadSheetService");
const dotenv_1 = __importDefault(require("dotenv"));
const checkAndRefreshToken_1 = require("../utils/checkAndRefreshToken");
dotenv_1.default.config();
const oauth2Client = new googleapis_1.google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.REDIRECT_URI);
async function appendToSheet(data, tokens, spreadsheetId) {
    logger_2.default.info("Append to Sheet function called");
    oauth2Client.setCredentials(tokens); // Use stored tokens
    const sheets = googleapis_1.google.sheets({
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
        logger_2.default.info("Header is missing. Appending the header.");
        await sheets.spreadsheets.values.update({
            spreadsheetId,
            range: headerRange,
            valueInputOption: "RAW",
            requestBody: {
                values: [headers],
            },
        });
        logger_2.default.info("Header appended to the sheet.");
    }
    else {
        logger_2.default.info("Header already exists. Skipping header append.");
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
    const rowNumber = match ? match[1] : null;
    return rowNumber ? parseInt(rowNumber) : NaN;
}
//This function is used to Store the Jobs into the DB
const addLeads = async (req, res) => {
    logger_2.default.info("Add Jobs function Triggered");
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
    const { title, firstName, lastName, dateOfBirth, email, contactNumber, address, postcode, landlordName, landlordContactNumber, landlordEmail, agentName, agentContactNumber, agentEmail, heatingType, propertyType, epcRating, serviceType, assessmentDate, notes, user_id, waterType, epcBand, } = req.body;
    try {
        const employee = await model_1.Employee.findByPk(user_id);
        const googleToken = employee?.dataValues.googleTokens;
        if (!employee || !employee?.dataValues.googleTokens) {
            logger_2.default.info("Employee or googleToken not found");
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
            logger_2.default.info("spreadSheet is empty");
            spreadsheetId = await (0, spreadSheetService_1.createSpreadsheet)(googleToken);
            await model_1.Employee.update({ spreadsheetId }, { where: { id: employee.dataValues.id } }); // Save the updated employee record
            logger_2.default.info("spreadSheet is created");
        }
        let googleTokens = typeof employee.dataValues.googleTokens === "string"
            ? JSON.parse(employee.dataValues.googleTokens)
            : employee.dataValues.googleTokens;
        if (googleTokens.expiry_date != undefined) {
            if (Date.now() >= googleTokens.expiry_date) {
                googleTokens = await (0, checkAndRefreshToken_1.refreshGoogleTokens)(googleTokens);
                const googleTokensString = JSON.stringify(googleTokens);
                await model_1.Employee.update({ googleTokens: googleTokensString }, {
                    where: { id: id },
                });
            }
        }
        else {
            logger_1.default.error("Token expiry date is undefined.");
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
        const sheetRowNumber = await appendToSheet(dataArray, googleTokens, spreadsheetId);
        await model_1.Job.create({
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
        logger_1.default.info("Job Successfully added into Database and GoogleSheet");
        res.status(201).json({
            message: "Job Successfully added into Database and GoogleSheet",
        });
    }
    catch (err) {
        if (err instanceof Error) {
            logger_1.default.error("Error", err.message);
        }
        res.status(500).json({ message: "Error adding job", error: err });
    }
};
exports.addLeads = addLeads;
const getJobInfoOfEmployee = async (req, res) => {
    logger_1.default.info("getJobInfoOfEmployee function Called");
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const { id } = req.params;
    try {
        // Fetch users with associated employee jobs
        const usersWithJobs = await model_1.Job.findAll({
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
        const totalEmployees = await model_1.Job.count({
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
    }
    catch (error) {
        logger_2.default.error("Error fetching employee with job info:", error);
        res.status(500).json({
            message: "Failed to fetch employee with job information",
            error: error,
        });
    }
};
exports.getJobInfoOfEmployee = getJobInfoOfEmployee;
const getJobInfoOfEmployeeWithPagination = async (req, res) => {
    logger_1.default.info("getJobInfoOfEmployeeWithPagination function Called");
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const id = parseInt(req.query.id);
    try {
        // Fetch users with associated employee jobs
        const usersWithJobs = await model_1.Job.findAll({
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
        const totalEmployees = await model_1.Job.count({
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
    }
    catch (error) {
        logger_2.default.error("Error fetching employee with job info:", error);
        res.status(500).json({
            message: "Failed to fetch employee with job information",
            error: error,
        });
    }
};
exports.getJobInfoOfEmployeeWithPagination = getJobInfoOfEmployeeWithPagination;
const getIndividualEmployeeWithJobInfo = async (req, res) => {
    logger_1.default.info("getIndividualEmployeeWithJobInfo function Called");
    const { employeeJobId, employeeId } = req.body;
    try {
        // Fetch users with associated employee jobs
        const employeeInfo = await model_1.Employee.findByPk(employeeId);
        // Fetch the employee job information using employeeJobId
        const employeeJobInfo = await model_1.Job.findByPk(employeeJobId);
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
    }
    catch (error) {
        logger_2.default.error("Error fetching employee with job info:", error);
        res.status(500).json({
            message: "Failed to fetch employee with job information",
            error: error,
        });
    }
};
exports.getIndividualEmployeeWithJobInfo = getIndividualEmployeeWithJobInfo;
const getMonthlyJobCountOfEmployee = async (req, res) => {
    logger_1.default.info("getMonthlyJobCountOfEmployee function Called");
    const id = parseInt(req.query.id);
    try {
        if (!id) {
            return res.status(400).json({
                message: "Missing 'userId' or 'year' query parameter",
            });
        }
        const monthlyJobCounts = await model_1.Month.findAll({
            attributes: [
                "month_name",
                [
                    sequelize_typescript_1.Sequelize.fn("COUNT", sequelize_typescript_1.Sequelize.col("jobs.id")),
                    "total_jobs_on_each_month",
                ], // Count the total jobs for each month
            ],
            include: [
                {
                    model: model_1.Job,
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
    }
    catch (error) {
        logger_2.default.error("Error fetching monthly job count:", error);
        res.status(500).json({
            message: "Failed to fetch monthly job count",
            error: error,
        });
    }
};
exports.getMonthlyJobCountOfEmployee = getMonthlyJobCountOfEmployee;
const getStatusCountOfJobs = async (req, res) => {
    logger_1.default.info("getStatusCountOfJobs function Called");
    const id = parseInt(req.query.user_id);
    try {
        // Ensure userId and year are provided and valid
        if (!id) {
            return res.status(400).json({
                message: "Missing 'userId' or 'year' query parameter",
            });
        }
        // Perform the Sequelize query to get the monthly job count
        const monthlyJobCounts = await model_1.Job.findAll({
            attributes: [
                "status",
                [sequelize_typescript_1.Sequelize.fn("COUNT", sequelize_typescript_1.Sequelize.col("status")), "status_count"],
            ],
            where: {
                status: {
                    [sequelize_1.Op.ne]: null, // Exclude null statuses
                },
                user_id: id, // Filter by user_id = '3'
            },
            group: ["status"], // Group by the 'status' column
        });
        // Send the result as a response
        res.status(200).json(monthlyJobCounts);
    }
    catch (error) {
        logger_2.default.error("Error fetching monthly job count:", error);
        res.status(500).json({
            message: "Failed to fetch monthly job count",
            error: error,
        });
    }
};
exports.getStatusCountOfJobs = getStatusCountOfJobs;
// Controller function to get employee jobs for Excel Sheet
const getEmployeeJobs = async (req, res) => {
    logger_1.default.info("getEmployeeJobs function Called");
    const id = req.query.id;
    try {
        const employeeJobs = await model_1.Job.findAll({
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
    }
    catch (error) {
        // Handle any errors during the fetch
        logger_2.default.error("Error fetching employee jobs:", error);
        res.status(500).json({
            message: "An error occurred while fetching employee jobs.",
            error,
        });
    }
};
exports.getEmployeeJobs = getEmployeeJobs;
const getJobStatusById = async (req, res) => {
    logger_1.default.info("getJobStatusById function Called");
    const id = req.user?.id;
    try {
        const usersWithJobs = await model_1.Job.findAll({
            attributes: ["id", "title", "status", "job_creation_date"],
            where: {
                user_id: id, // Replace '1' with the actual user ID you are filtering by
            },
        });
        res.status(200).json({ usersWithJobs });
    }
    catch (error) {
        logger_2.default.error("Error fetching employee with job info:", error);
        res.status(500).json({
            message: "Failed to fetch employee with job information",
            error: error,
        });
    }
};
exports.getJobStatusById = getJobStatusById;
