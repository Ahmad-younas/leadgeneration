import { google, sheets_v4 } from "googleapis";
import dotenv from "dotenv";
import Logger from "../logger";

type GoogleTokens = {
  access_token?: string;
  refresh_token?: string;
  scope?: string;
  token_type?: string;
  expiry_date?: number;
};

dotenv.config();
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  process.env.REDIRECT_URI!, // Can be left null if not using redirection
);
export const updateRowInSheet = async (
  data: (string | number)[], // The new data to update
  tokens: GoogleTokens, // OAuth2 tokens
  spreadsheetId: string | undefined, // Spreadsheet ID
  rowNumber: number | undefined, // Row number to update (from the DB)
): Promise<void> => {
  Logger.info("updateRowInSheet Function Called");
  oauth2Client.setCredentials(tokens);

  const sheets: sheets_v4.Sheets = google.sheets({
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

      Logger.info(`Row ${rowNumber} updated successfully.`);
    } else {
      Logger.error(`Row ${rowNumber} does not exist. No update performed.`);
    }
  } catch (error) {
    Logger.error(`Error updating row ${rowNumber}:`, error);
    throw new Error(`Failed to update row ${rowNumber}`);
  }
};
