"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRowInSheet = void 0;
const googleapis_1 = require("googleapis");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const oauth2Client = new googleapis_1.google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.REDIRECT_URI);
const updateRowInSheet = async (data, // The new data to update
tokens, // OAuth2 tokens
spreadsheetId, // Spreadsheet ID
rowNumber) => {
    console.info(`Update Row function called for row ${rowNumber}`);
    oauth2Client.setCredentials(tokens);
    const sheets = googleapis_1.google.sheets({
        version: "v4",
        auth: oauth2Client,
    });
    // Define the range based on the rowNumber
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
            console.info(`Updating row ${rowNumber} with new data.`);
            await sheets.spreadsheets.values.update({
                spreadsheetId,
                range: rowRange,
                valueInputOption: "RAW",
                requestBody: {
                    values: [data],
                },
            });
            console.info(`Row ${rowNumber} updated successfully.`);
        }
        else {
            console.warn(`Row ${rowNumber} does not exist. No update performed.`);
        }
    }
    catch (error) {
        console.error(`Error updating row ${rowNumber}:`, error);
        throw new Error(`Failed to update row ${rowNumber}`);
    }
};
exports.updateRowInSheet = updateRowInSheet;
