/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import dotenv from "dotenv";
import { Employee } from "../Model/model";
import Logger from "../logger";
import { Dropbox, DropboxAuth } from "dropbox";
import axios from "axios";
import { calculateTokenExpiry } from "../utils/calculateTokenExpiry";
import Job from "../Model/Job";

dotenv.config();

interface User {
  role: string;
  id: string;
  email: string;
}

interface CustomRequest extends Request {
  user?: User;
}

const dropboxAuth = new DropboxAuth({
  clientId: process.env.DROPBOX_APPKEY!,
  clientSecret: process.env.DROPBOX_SECRET!, // Ensure you add this in your .env file
});

// Step 1: Redirect user to Dropbox for authentication
export const getDropboxAuthUrl = (req: Request, res: Response) => {
  Logger.info("getDropboxAuthUrl Triggered");
  const redirectUri = process.env.DROPBOX_REDIRECT_URI!;
  dropboxAuth.setClientId(process.env.DROPBOX_APPKEY!);
  dropboxAuth
    .getAuthenticationUrl(redirectUri, undefined, "code", "offline")
    .then((authUrl) => {
      res.json({ url: authUrl });
    })
    .catch((error) => {
      Logger.error("Error generating Dropbox Auth URL:", error);
      res.status(500).json({ error: "Failed to generate authentication URL" });
    });
};

// Function to handle the callback, create a folder, and generate a shareable link
export const dropboxAuthCallback = async (
  req: CustomRequest,
  res: Response,
) => {
  Logger.info("dropboxAuthCallback Triggered");
  const user = req.user;
  const { code } = req.body; // Access token sent from the client side
  const redirectUri = process.env.DROPBOX_REDIRECT_URI!;
  const tokenUrl = "https://api.dropboxapi.com/oauth2/token";
  try {
    const response = await axios.post(
      tokenUrl,
      new URLSearchParams({
        code: code,
        grant_type: "authorization_code",
        client_id: process.env.DROPBOX_APPKEY!,
        client_secret: process.env.DROPBOX_SECRET!,
        redirect_uri: redirectUri,
      }),
    );
    const tokenExpireIn = calculateTokenExpiry(response.data.expires_in);
    const accessToken = {
      access_token: response.data.access_token,
      token_type: response.data.token_type,
      refresh_token: response.data.refresh_token,
      scope: response.data.scope,
      uid: response.data.uid,
      account_id: response.data.account_id,
      expires_in: tokenExpireIn,
    };

    const job = await Employee.findOne({ where: { id: user?.id } });
    if (!job) {
      return res.status(404).json({ error: "Job not found for the user." });
    }
    await job.update({ dropboxAccessToken: JSON.stringify(accessToken) });
    res.status(200).json({
      message: "Folder created successfully in Dropbox.",
    });
  } catch (error) {
    Logger.error("Error creating folder or generating link in Dropbox:", error);
    res
      .status(500)
      .json({ error: "Failed to create folder or generate link in Dropbox." });
  }
};

export const createFolderInDropBox = async (
  req: CustomRequest,
  res: Response,
) => {
  Logger.info("createFolderInDropbox triggered");
  const userId = req.user?.id ? parseInt(req.user.id) : undefined;
  const jobAddress = req.body.address;
  if (!userId) {
    return res.status(400).json({ error: "Invalid user ID." });
  }
  try {
    const accessToken = await getAccessToken(userId);
    const dbx = await initializeDropboxClient(userId, accessToken);

    const folderPath = `/Admin/${jobAddress}`;
    const response = await dbx.filesCreateFolderV2({ path: folderPath });

    const createdFolderPath = response.result.metadata.path_display;
    if (!createdFolderPath) {
      return res.status(500).json({ error: "Failed to retrieve folder path." });
    }

    const linkResponse = await dbx.sharingCreateSharedLinkWithSettings({
      path: createdFolderPath,
    });
    await Job.update(
      { dropboxFolderLink: linkResponse.result.url },
      { where: { id: req.params.id } },
    );

    res.status(200).json({
      message: "Folder created successfully in Dropbox.",
      link: linkResponse.result.url,
    });
    Logger.info("Folder successfully created");
  } catch (error: any) {
    if (error.status === 409) {
      Logger.warn("Folder already exists in Dropbox");
      return res.status(409).json({ message: "Folder already exists" });
    }
    Logger.error("Error creating folder in Dropbox:", error);
    res.status(500).json({ error: error.message });
  }
};

const getAccessToken = async (userId: number) => {
  Logger.info("getAccessToken Function Called");
  const employee = await Employee.findOne({ where: { id: userId } });
  if (!employee || !employee.dataValues.dropboxAccessToken) {
    throw new Error("Access token not found.");
  }
  return JSON.parse(employee.dataValues.dropboxAccessToken);
};

// Helper to refresh the Dropbox access token
const refreshAccessToken = async (refreshToken: string) => {
  Logger.info("refreshAccessToken Function Called");
  const tokenUrl = "https://api.dropboxapi.com/oauth2/token";
  const response = await axios.post(
    tokenUrl,
    new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: process.env.DROPBOX_APPKEY!,
      client_secret: process.env.DROPBOX_SECRET!,
    }),
  );
  Logger.info("Token refreshed successfully");
  return response.data;
};

const initializeDropboxClient = async (userId: number, accessToken: any) => {
  Logger.info("initializeDropboxClient Function Called");
  const { access_token, refresh_token, expires_in } = accessToken;
  if (new Date() >= new Date(expires_in)) {
    const newAccessToken = await refreshAccessToken(refresh_token);
    await Employee.update(
      {
        dropboxAccessToken: JSON.stringify({
          ...accessToken,
          access_token: newAccessToken.access_token,
          expires_in: calculateTokenExpiry(newAccessToken.expires_in),
        }),
      },
      { where: { id: userId } },
    );
    return new Dropbox({ accessToken: newAccessToken.access_token });
  } else {
    Logger.info("Token has not expired yet");
    return new Dropbox({ accessToken: access_token });
  }
};
