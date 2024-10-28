import Logger from "../logger";
import dotenv from "dotenv";
import { google } from "googleapis";

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

export const refreshGoogleTokens = async (
  googleTokens: GoogleTokens,
): Promise<GoogleTokens> => {
  oauth2Client.setCredentials(googleTokens);

  // Check if the access token has expired
  if (googleTokens.expiry_date && Date.now() > googleTokens.expiry_date) {
    Logger.info("Access token expired. Refreshing token...");
    console.log("GoogleToken", googleTokens);
    const newTokens = await oauth2Client.refreshAccessToken();
    oauth2Client.setCredentials(newTokens.credentials);

    googleTokens.access_token = newTokens.credentials.access_token!;
    googleTokens.expiry_date = newTokens.credentials.expiry_date!;
    googleTokens.refresh_token = newTokens.credentials.refresh_token!; // Keep the old refresh_token if not provided

    Logger.info("Tokens refreshed successfully.");
  }
  return googleTokens;
};
