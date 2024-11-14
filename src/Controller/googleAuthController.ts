import { Request, Response } from "express";
import { Employee } from "../Model/model";
import Logger from "../logger";
import { google } from "googleapis";
import dotenv from "dotenv";
import jwt, { JwtPayload } from "jsonwebtoken";

dotenv.config();
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.REDIRECT_URI,
);
export const getAuthUrl = (req: Request, res: Response) => {
  Logger.info("getAuthUrl function called");
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline", // Required to get a refresh token
    scope: ["https://www.googleapis.com/auth/spreadsheets"], // Only Google Sheets API scope
    prompt: "consent",
    redirect_uri: process.env.REDIRECT_URI,
    client_id: process.env.GOOGLE_CLIENT_ID,
  });
  res.json({ url: authUrl });
};

export const oauth2Callback = async (
  req: Request,
  res: Response,
): Promise<void> => {
  Logger.info("Get oauth2Callback function is called");
  const { code } = req.body;
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.REDIRECT_URI;
  if (!clientId || !clientSecret || !redirectUri) {
    Logger.error(
      "Missing required environment variables: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, or REDIRECT_URI",
    );
    res
      .status(500)
      .send("Server configuration error. Please check environment variables.");
    return;
  }
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Authorization token missing or invalid" });
    return;
  }
  const token = authHeader.split(" ")[1];
  const secretKey = process.env.JWT_SECRET || "your-secret-key"; // Replace with your actual secret key
  const decoded = jwt.verify(token, secretKey) as JwtPayload;
  try {
    // Ensure code is a string
    if (typeof code !== "string") {
      throw new Error("Invalid authorization code received.");
    }
    // Correctly call getToken with GetTokenOptions
    const tokensResponse = await oauth2Client.getToken(code);
    const tokens = tokensResponse?.tokens;
    if (!tokens) {
      throw new Error("Failed to retrieve tokens from Google.");
    }
    oauth2Client.setCredentials(tokens);
    const tokensString = JSON.stringify(tokens);
    // Update employee record with Google tokens
    await Employee.update(
      { googleTokens: tokensString },
      { where: { id: decoded.id } },
    );
    Logger.info("Google Token Successfully Stored in the Database");
    res.status(200).json("Google Token Successfully Stored in the Database");
  } catch (error) {
    Logger.error(`Error during OAuth2 callback: ${error}`);
    res.status(500).send("Authentication failed");
  }
};
