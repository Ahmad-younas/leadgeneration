"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRowInSheet = void 0;
const googleapis_1 = require("googleapis");
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = __importDefault(require("../logger"));
dotenv_1.default.config();
const oauth2Client = new googleapis_1.google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.REDIRECT_URI);
const updateRowInSheet = async (data, // The new data to update
tokens, // OAuth2 tokens
spreadsheetId, // Spreadsheet ID
rowNumber) => {
    logger_1.default.info("updateRowInSheet Function Called");
    oauth2Client.setCredentials(tokens);
    const sheets = googleapis_1.google.sheets({
        version: "v4",
        auth: oauth2Client,
    });
    const rowRange = `Sheet1!A${rowNumber}:Y${rowNumber}`; // Adjust to match your column count
    try {
        // Step 1: Check if the row already exists
        const existingRowResponse = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: rowRange,
        });
        const existingRow = existingRowResponse.data.values;
        // Step 2: If the row exists, update it with new data
        if (existingRow && existingRow.length > 0) {
            await sheets.spreadsheets.values.update({
                spreadsheetId,
                range: rowRange,
                valueInputOption: "RAW",
                requestBody: {
                    values: [data],
                },
            });
            logger_1.default.info(`Row ${rowNumber} updated successfully.`);
        }
        else {
            logger_1.default.error(`Row ${rowNumber} does not exist. No update performed.`);
        }
    }
    catch (error) {
        logger_1.default.error(`Error updating row ${rowNumber}:`, error);
        throw new Error(`Failed to update row ${rowNumber}`);
    }
};
exports.updateRowInSheet = updateRowInSheet;
