import { google, sheets_v4 } from "googleapis";
import { Credentials } from "google-auth-library";
import Logger from "../logger";
import dotenv from "dotenv";

dotenv.config();

// Define the type for the Google Tokens, assuming they are stored as JSON objects
interface GoogleTokens {
  access_token?: string;
  refresh_token?: string;
  scope?: string;
  token_type?: string;
}

function parseTokens(tokens: string | Credentials): Credentials {
  Logger.info("ParseToken function called");
  if (typeof tokens === "string") {
    try {
      return JSON.parse(tokens) as Credentials;
    } catch (error) {
      throw new Error("Failed to parse tokens: Invalid JSON format");
    }
  }
  return tokens;
}

// Function to create a new Google Spreadsheet
export async function createSpreadsheet(
  tokens: string | Credentials,
): Promise<string> {
  Logger.info("CreateSpreadSheet Function called ");
  console.log("Token", tokens);
  const oauth2Client = new google.auth.OAuth2({
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  });
  const parsedTokens = parseTokens(tokens);
  console.log("parsedTokens", parsedTokens);
  oauth2Client.setCredentials(parsedTokens); // Use stored tokens from OAuth2

  const sheets: sheets_v4.Sheets = google.sheets({
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
      Logger.info("Failed to create spreadsheet: Spreadsheet ID not found");
      throw new Error("Failed to create spreadsheet: Spreadsheet ID not found");
    }

    console.log("Spreadsheet ID:", spreadsheetId);

    return spreadsheetId; // Return the ID for further use (e.g., store in database)
  } catch (error) {
    console.error("Error creating spreadsheet:", error);
    throw error;
  }
}
