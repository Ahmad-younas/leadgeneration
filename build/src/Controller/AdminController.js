"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEmployee = exports.getAllJobStatus = exports.authWithDropBox = exports.getEmployeeJobInfo = exports.getEmployeeById = exports.deleteAllJobs = exports.updateEmployeeJob = exports.deleteSelectedJobs = exports.deleteSelectedEmployees = exports.getEmployeeWithJobInfo = exports.getEmployeeInfoAndEmployeeJobInfo = exports.getMonthlyJobCounts = exports.deleteEmployee = exports.findAllEmployee = exports.updateAdmin = exports.addEmployee = exports.getJobs = void 0;
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
    logger_2.default.info("getJobs Function Called");
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
        res.status(200).json({
            jobs,
            meta: {
                totalItems: totalEmployees,
                currentPage: page,
                totalPages: totalPages,
                itemsPerPage: limit,
            },
        });
    }
    catch (err) {
        if (err instanceof Error) {
            logger_1.default.error(err.message);
        }
        res.status(500).json({ message: "Error finding jobs", err });
    }
};
exports.getJobs = getJobs;
const addEmployee = async (req, res) => {
    logger_2.default.info("addEmployee Function Called");
    const { name, email, password, role } = req.body;
    try {
        const checkEmployee = await Employee_1.default.findOne({ where: { email: email } });
        if (checkEmployee) {
            return res.status(302).json({
                message: "An employee is already registered with this email.",
            });
        }
        const hashedPassword = (0, auth_1.encryptedPassword)(password);
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
    }
    catch (err) {
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
const updateAdmin = async (req, res) => {
    logger_1.default.info("UpdateAdmin Function Called");
    const id = req.user?.id;
    const { name, email, password } = req.body;
    try {
        const hashedPassword = (0, auth_1.encryptedPassword)(password);
        await Employee_1.default.update({
            username: name,
            email: email,
            password: hashedPassword,
        }, {
            where: {
                id,
            },
        });
        logger_1.default.info("Employee updated");
        res.status(200).json({ message: "Employee updated successfully" });
    }
    catch (err) {
        if (err instanceof Error) {
            logger_1.default.error(err.message);
        }
        res.status(500).json({ message: "Error updating employee", err });
    }
};
exports.updateAdmin = updateAdmin;
const findAllEmployee = async (req, res) => {
    logger_2.default.info("findAllEmployee Function Called");
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const employees = await Employee_1.default.findAll({
            where: { role: "employee" },
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
    }
    catch (err) {
        if (err instanceof Error) {
            logger_1.default.error(err.message);
        }
        res.status(500).json({ message: "Error finding employee", err });
    }
};
exports.findAllEmployee = findAllEmployee;
const deleteEmployee = async (req, res) => {
    logger_2.default.info("deleteEmployee Function Called");
    const { id } = req.body;
    try {
        const deleted = await Employee_1.default.destroy({
            where: { id },
        });
        if (deleted) {
            logger_1.default.info(`Employee with id ${id} deleted successfully`);
            return res.status(200).json({ message: "Employee deleted successfully" });
        }
        else {
            logger_1.default.error(`Employee with id ${id} not found`);
            return res.status(404).json({ message: "Employee not found" });
        }
    }
    catch (err) {
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
    logger_2.default.info("getMonthlyJobCounts Function Called");
    try {
        const results = await Month_1.Month.findAll({
            attributes: [
                [
                    sequelize_typescript_1.Sequelize.fn("COUNT", sequelize_typescript_1.Sequelize.col("jobs.id")),
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
    }
    catch (err) {
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
    logger_2.default.info("getEmployeeInfoAndEmployeeJobInfo Function Called");
    const { employeeJobId, employeeId } = req.body;
    try {
        const employeeInfo = await Employee_1.default.findByPk(employeeId);
        const employeeJobInfo = await Job_1.default.findByPk(employeeJobId);
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
    catch (err) {
        // Handle any unexpected errors
        if (err instanceof Error) {
            logger_2.default.error("Error", err);
        }
        res
            .status(500)
            .json({ message: "Error retrieving employee information", err });
    }
};
exports.getEmployeeInfoAndEmployeeJobInfo = getEmployeeInfoAndEmployeeJobInfo;
const getEmployeeWithJobInfo = async (req, res) => {
    logger_2.default.info("getEmployeeWithJobInfo Function Called");
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
        res.status(200).json(usersWithJobs);
    }
    catch (error) {
        logger_2.default.error("Error fetching employee with job info:", error);
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
    logger_2.default.info("deleteSelectedEmployees Function Called");
    const { employeeIds } = req.body; // Expecting an array of employee IDs from the request body
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
    }
    catch (error) {
        logger_2.default.error("Error deleting selected employees:", error);
        res.status(500).json({ error: "Failed to delete selected employees." });
    }
};
exports.deleteSelectedEmployees = deleteSelectedEmployees;
const deleteSelectedJobs = async (req, res) => {
    logger_2.default.info("deleteSelectedJobs Function Called");
    const { jobIds } = req.body; // Expecting an array of employee IDs from the request body
    try {
        await Job_1.default.destroy({
            where: {
                id: jobIds, // `id` matches the employee IDs passed in the array
            },
        });
        res.status(200).json({ message: "Selected Deleted deleted successfully." });
    }
    catch (error) {
        logger_2.default.error("Error deleting selected employees:", error);
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
    logger_2.default.info("updateEmployeeJob Function Called");
    const { id, title, firstName, lastName, dateOfBirth, email, contactNumber, address, postcode, landlordName, landlordContactNumber, landlordEmail, agentName, agentContactNumber, agentEmail, heatingType, propertyType, epcRating, serviceType, assessmentDate, notes, month, year, epcBand, waterType, } = req.body;
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
        await Job_1.default.update({
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
            status: req.body.status && req.body.status.trim() != ""
                ? req.body.status
                : "Booked",
            epcBand,
            waterType,
        }, {
            where: {
                id: id,
            },
        });
        const response = await (0, getSpreadSheetIdAndRowNumber_1.getSpreadSheetIdAndRowNumber)(id, userId);
        if (!response || !response.googleTokens) {
            logger_2.default.info("Employee or googleToken not found");
            return res
                .status(404)
                .json({ error: "Employee not authenticated with Google" });
        }
        let spreadsheetId = response.spreadSheetId;
        if (!spreadsheetId) {
            logger_2.default.info("spreadSheet is empty");
            spreadsheetId = await (0, spreadSheetService_1.createSpreadsheet)(response.googleTokens);
            await Employee_1.default.update({ spreadsheetId }, { where: { id: id } }); // Save the updated employee record
            logger_2.default.info("spreadSheet is created");
        }
        let googleTokens = typeof response.googleTokens === "string"
            ? JSON.parse(response.googleTokens)
            : response.googleTokens;
        if (googleTokens.expiry_date != undefined) {
            if (Date.now() >= googleTokens.expiry_date) {
                googleTokens = await (0, checkAndRefreshToken_1.refreshGoogleTokens)(googleTokens);
                await Employee_1.default.update({ googleTokens: JSON.stringify(googleTokens) }, {
                    where: { id: id },
                });
            }
            logger_1.default.info("GoogleToken in DB successfully Updated");
        }
        else {
            logger_1.default.error("Token expiry date is undefined.");
        }
        await (0, updateRowInSheet_1.updateRowInSheet)(dataToUpdate, googleTokens, response.spreadSheetId, response.rowNumber);
        return res.status(200).json({
            message: "Employee job updated successfully",
        });
    }
    catch (error) {
        logger_2.default.error("Error updating employee job:", error);
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
    logger_2.default.info("deleteAllJobs Function Called");
    try {
        // Deleting all jobs
        const deletedCount = await Job_1.default.destroy({
            where: {}, // Empty condition to match all records
        });
        if (deletedCount > 0) {
            return res.status(200).json({
                message: `${deletedCount} jobs were successfully deleted.`,
            });
        }
        else {
            return res.status(404).json({
                message: "No jobs found to delete.",
            });
        }
    }
    catch (error) {
        logger_2.default.error("Error deleting all jobs:", error);
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
    logger_2.default.info("getEmployeeById Function Called");
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
    }
    catch (error) {
        logger_2.default.error("Error fetching employee:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.getEmployeeById = getEmployeeById;
const getEmployeeJobInfo = async (req, res) => {
    logger_2.default.info("getEmployeeJobInfo Function Called");
    const jobId = req.params.id;
    try {
        const job = await Job_1.default.findByPk(jobId);
        if (!job) {
            return res.status(404).json({ error: "Job not found" });
        }
        res.json(job);
    }
    catch (error) {
        res.status(500).json({ error: "Error fetching job details" });
    }
};
exports.getEmployeeJobInfo = getEmployeeJobInfo;
const authWithDropBox = async (req, res) => {
    logger_2.default.info("authWithDropBox Function Called");
    const id = req.user?.id;
    const user = await Employee_1.default.findByPk(id);
    if (user?.dataValues.dropboxAccessToken) {
        logger_1.default.info("Already authenticated With Dropbox");
        res.status(201).json({ message: "Already authenticated With Dropbox" });
    }
    else {
        res.status(204).json({ message: "Link Not Found" });
    }
};
exports.authWithDropBox = authWithDropBox;
const getAllJobStatus = async (req, res) => {
    logger_2.default.info("getAllJobStatus Function Called");
    try {
        const allUserJobs = await Job_1.default.findAll({
            attributes: [
                "id",
                "title",
                "status",
                "job_creation_date", // Make sure this matches the exact column name in your database
            ],
        });
        res.status(200).json(allUserJobs);
    }
    catch (error) {
        logger_2.default.error("Error retrieving job statuses:", error);
        res.status(500).json({ error: "Failed to retrieve job statuses." });
    }
};
exports.getAllJobStatus = getAllJobStatus;
/**
 * Update employee job data by ID.
 * @param {CustomRequest} req - Express request object.
 * @param {Response} res - Express response object.
 */
const updateEmployee = async (req, res) => {
    logger_1.default.info("UpdateEmployee Function Called");
    const { id, name, email, password, role } = req.body;
    try {
        const hashedPassword = (0, auth_1.encryptedPassword)(password);
        await Employee_1.default.update({
            username: name,
            email: email,
            password: hashedPassword,
            role: role,
        }, {
            where: {
                id,
            },
        });
        logger_1.default.info("Employee updated");
        res.status(200).json({ message: "Employee updated successfully" });
    }
    catch (err) {
        if (err instanceof Error) {
            logger_1.default.error(err.message);
        }
        res.status(500).json({ message: "Error updating employee", err });
    }
};
exports.updateEmployee = updateEmployee;
