"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSpreadsheet = createSpreadsheet;
const googleapis_1 = require("googleapis");
const logger_1 = __importDefault(require("../logger"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function parseTokens(tokens) {
    logger_1.default.info("ParseToken function called");
    if (typeof tokens === "string") {
        try {
            return JSON.parse(tokens);
        }
        catch (error) {
            throw new Error("Failed to parse tokens: Invalid JSON format");
        }
    }
    return tokens;
}
// Function to create a new Google Spreadsheet
async function createSpreadsheet(tokens) {
    logger_1.default.info("CreateSpreadSheet Function called ");
    console.log("Token", tokens);
    const oauth2Client = new googleapis_1.google.auth.OAuth2({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    });
    const parsedTokens = parseTokens(tokens);
    console.log("parsedTokens", parsedTokens);
    oauth2Client.setCredentials(parsedTokens); // Use stored tokens from OAuth2
    const sheets = googleapis_1.google.sheets({
        version: "v4",
        auth: oauth2Client,
    });
    try {
        // Create a new spreadsheet
        const response = await sheets.spreadsheets.create({
            requestBody: {
                properties: {
                    title: "Employee Job Data", // Customize the title
                },
                sheets: [
                    {
                        properties: {
                            title: "Sheet1", // Name of the first sheet
                        },
                    },
                ],
            },
        });
        const spreadsheetId = response.data.spreadsheetId; // Get the spreadsheet ID
        if (!spreadsheetId) {
            logger_1.default.info("Failed to create spreadsheet: Spreadsheet ID not found");
            throw new Error("Failed to create spreadsheet: Spreadsheet ID not found");
        }
        console.log("Spreadsheet ID:", spreadsheetId);
        return spreadsheetId; // Return the ID for further use (e.g., store in database)
    }
    catch (error) {
        console.error("Error creating spreadsheet:", error);
        throw error;
    }
}
