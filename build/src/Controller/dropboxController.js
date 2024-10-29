"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dropboxAuthCallback = exports.getDropboxAuthUrl = void 0;
const dropbox_1 = require("../Config/dropbox");
const dotenv_1 = __importDefault(require("dotenv"));
const dropbox_2 = require("dropbox");
const model_1 = require("../Model/model");
const logger_1 = __importDefault(require("../logger")); // Step 1: Redirect user to Dropbox for authentication
dotenv_1.default.config();
// Step 1: Redirect user to Dropbox for authentication
const getDropboxAuthUrl = (req, res) => {
    logger_1.default.info("getDropboxAuthUrl Triggered");
    const redirectUri = process.env.DROPBOX_REDIRECT_URI;
    dropbox_1.dropboxAuth.setClientId(process.env.DROPBOX_APPKEY);
    dropbox_1.dropboxAuth
        .getAuthenticationUrl(redirectUri)
        .then((authUrl) => {
        res.json({ url: authUrl });
    })
        .catch((error) => {
        console.error("Error generating Dropbox Auth URL:", error);
        res.status(500).json({ error: "Failed to generate authentication URL" });
    });
};
exports.getDropboxAuthUrl = getDropboxAuthUrl;
// Function to handle the callback, create a folder, and generate a shareable link
const dropboxAuthCallback = async (req, res) => {
    logger_1.default.info("dropboxAuthCallback Triggered");
    const user = req.user;
    const { accessToken } = req.body; // Access token sent from the client side
    try {
        // Initialize the Dropbox client with the access token
        const dbx = new dropbox_2.Dropbox({ accessToken: accessToken });
        // Define the folder path. Modify it according to your requirement.
        const folderPath = `/Employee_Folders/NewEmployeeFolder`; // You can make this dynamic based on employee data
        // Create the folder in Dropbox
        const response = await dbx.filesCreateFolderV2({ path: folderPath });
        // Extract the folder path from the response
        const createdFolderPath = response.result.metadata.path_display;
        // Generate a shareable link for the created folder
        const linkResponse = await dbx.sharingCreateSharedLinkWithSettings({
            path: createdFolderPath,
        });
        // Extract the full URL of the shared link
        const fullLink = linkResponse.result.url;
        const job = await model_1.Employee.findOne({ where: { id: user?.id } });
        if (!job) {
            return res.status(404).json({ error: "Job not found for the user." });
        }
        await job.update({ link: fullLink });
        // Send the shareable link back to the client
        res.status(200).json({
            message: "Folder created successfully in Dropbox.",
        });
    }
    catch (error) {
        console.error("Error creating folder or generating link in Dropbox:", error);
        res
            .status(500)
            .json({ error: "Failed to create folder or generate link in Dropbox." });
    }
};
exports.dropboxAuthCallback = dropboxAuthCallback;
