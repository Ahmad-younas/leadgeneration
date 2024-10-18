import { NextFunction, Request, Response } from "express";
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
  console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
  console.log("GOOGLE_CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET);
  console.log("REDIRECT_URI:", process.env.REDIRECT_URI);
  Logger.info("getAuthUrl function called");
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline", // Required to get a refresh token
    scope: ["https://www.googleapis.com/auth/spreadsheets"], // Only Google Sheets API scope
    redirect_uri: process.env.REDIRECT_URI,
    client_id: process.env.GOOGLE_CLIENT_ID,
  });
  Logger.info(`Auth URL Created: ${authUrl}`);
  console.log("authUrl", authUrl);
  res.json({ url: authUrl });
};

export const oauth2Callback = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  Logger.info("Get oauth2Callback function is called");
  const { code } = req.body;
  console.log("Code", code);
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
  console.log("decodedId", decoded.id);
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

    Logger.info(`Tokens received: ${JSON.stringify(tokens)}`);
    oauth2Client.setCredentials(tokens);

    const employeeId = (req.session as any).employeeId;
    console.log("employeeId", employeeId);
    const tokensString = JSON.stringify(tokens);
    console.log("GOOGLE TOKEN:", tokensString);
    Logger.info(`GoogleToken: ${tokensString}`);

    // Update employee record with Google tokens
    await Employee.update(
      { googleTokens: tokensString },
      { where: { id: decoded.id } },
    );

    // Redirect to success page
    // res.redirect("/success"); // Ensure this path matches your frontend setup
    next();
  } catch (error) {
    Logger.error(`Error during OAuth2 callback: ${error}`);
    console.error("Error during OAuth2 callback:", error);
    res.status(500).send("Authentication failed");
  }
};
