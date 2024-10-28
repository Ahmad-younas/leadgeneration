import { Request, Response } from "express";
import { dropboxAuth } from "../Config/dropbox";
import dotenv from "dotenv";
import { Dropbox } from "dropbox";
import { Employee } from "../Model/model";
import Logger from "../logger"; // Step 1: Redirect user to Dropbox for authentication
dotenv.config();

// Step 1: Redirect user to Dropbox for authentication
export const getDropboxAuthUrl = (req: Request, res: Response) => {
  Logger.info("getDropboxAuthUrl Triggered");
  const redirectUri = process.env.DROPBOX_REDIRECT_URI!;
  dropboxAuth.setClientId(process.env.DROPBOX_APPKEY!);
  dropboxAuth
    .getAuthenticationUrl(redirectUri)
    .then((authUrl) => {
      res.json({ url: authUrl });
    })
    .catch((error) => {
      console.error("Error generating Dropbox Auth URL:", error);
      res.status(500).json({ error: "Failed to generate authentication URL" });
    });
};

interface User {
  role: string;
  id: string;
  email: string;
}

interface CustomRequest extends Request {
  user?: User;
}

// Function to handle the callback, create a folder, and generate a shareable link
export const dropboxAuthCallback = async (
  req: CustomRequest,
  res: Response,
) => {
  Logger.info("dropboxAuthCallback Triggered");
  const user = req.user;
  const { accessToken } = req.body; // Access token sent from the client side
  try {
    // Initialize the Dropbox client with the access token
    const dbx = new Dropbox({ accessToken: accessToken });

    // Define the folder path. Modify it according to your requirement.
    const folderPath = `/Employee_Folders/NewEmployeeFolder`; // You can make this dynamic based on employee data

    // Create the folder in Dropbox
    const response = await dbx.filesCreateFolderV2({ path: folderPath });

    // Extract the folder path from the response
    const createdFolderPath = response.result.metadata.path_display;

    // Generate a shareable link for the created folder
    const linkResponse = await dbx.sharingCreateSharedLinkWithSettings({
      path: createdFolderPath!,
    });

    // Extract the full URL of the shared link
    const fullLink = linkResponse.result.url;
    const job = await Employee.findOne({ where: { id: user?.id } });
    if (!job) {
      return res.status(404).json({ error: "Job not found for the user." });
    }
    await job.update({ link: fullLink });
    // Send the shareable link back to the client
    res.status(200).json({
      message: "Folder created successfully in Dropbox.",
    });
  } catch (error) {
    console.error(
      "Error creating folder or generating link in Dropbox:",
      error,
    );
    res
      .status(500)
      .json({ error: "Failed to create folder or generate link in Dropbox." });
  }
};
