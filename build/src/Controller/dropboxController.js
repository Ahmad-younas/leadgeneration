"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFolderInDropBox = exports.dropboxAuthCallback = exports.getDropboxAuthUrl = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const model_1 = require("../Model/model");
const logger_1 = __importDefault(require("../logger"));
const dropbox_1 = require("dropbox");
const axios_1 = __importDefault(require("axios"));
const calculateTokenExpiry_1 = require("../utils/calculateTokenExpiry");
const Job_1 = __importDefault(require("../Model/Job"));
dotenv_1.default.config();
const dropboxAuth = new dropbox_1.DropboxAuth({
    clientId: process.env.DROPBOX_APPKEY,
    clientSecret: process.env.DROPBOX_SECRET, // Ensure you add this in your .env file
});
// Step 1: Redirect user to Dropbox for authentication
const getDropboxAuthUrl = (req, res) => {
    logger_1.default.info("getDropboxAuthUrl Triggered");
    const redirectUri = process.env.DROPBOX_REDIRECT_URI;
    dropboxAuth.setClientId(process.env.DROPBOX_APPKEY);
    dropboxAuth
        .getAuthenticationUrl(redirectUri, undefined, "code", "offline")
        .then((authUrl) => {
        console.log("authUrl", authUrl);
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
    const { code } = req.body; // Access token sent from the client side
    const redirectUri = process.env.DROPBOX_REDIRECT_URI;
    const tokenUrl = "https://api.dropboxapi.com/oauth2/token";
    try {
        const response = await axios_1.default.post(tokenUrl, new URLSearchParams({
            code: code,
            grant_type: "authorization_code",
            client_id: process.env.DROPBOX_APPKEY,
            client_secret: process.env.DROPBOX_SECRET,
            redirect_uri: redirectUri,
        }));
        const tokenExpireIn = (0, calculateTokenExpiry_1.calculateTokenExpiry)(response.data.expires_in);
        const accessToken = {
            access_token: response.data.access_token,
            token_type: response.data.token_type,
            refresh_token: response.data.refresh_token,
            scope: response.data.scope,
            uid: response.data.uid,
            account_id: response.data.account_id,
            expires_in: tokenExpireIn,
        };
        const job = await model_1.Employee.findOne({ where: { id: user?.id } });
        if (!job) {
            return res.status(404).json({ error: "Job not found for the user." });
        }
        await job.update({ dropboxAccessToken: JSON.stringify(accessToken) });
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
const createFolderInDropBox = async (req, res) => {
    logger_1.default.info("createFolderInDropbox triggered");
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
        await Job_1.default.update({ dropboxFolderLink: linkResponse.result.url }, { where: { id: req.params.id } });
        res.status(200).json({
            message: "Folder created successfully in Dropbox.",
            link: linkResponse.result.url,
        });
        logger_1.default.info("Folder successfully created");
    }
    catch (error) {
        if (error.status === 409) {
            logger_1.default.warn("Folder already exists in Dropbox");
            return res.status(409).json({ message: "Folder already exists" });
        }
        console.log("error", error);
        logger_1.default.error("Error creating folder in Dropbox:", error);
        res.status(500).json({ error: error.message });
    }
};
exports.createFolderInDropBox = createFolderInDropBox;
const getAccessToken = async (userId) => {
    logger_1.default.info("getAccessToken Function Called");
    const employee = await model_1.Employee.findOne({ where: { id: userId } });
    if (!employee || !employee.dataValues.dropboxAccessToken) {
        throw new Error("Access token not found.");
    }
    return JSON.parse(employee.dataValues.dropboxAccessToken);
};
// Helper to refresh the Dropbox access token
const refreshAccessToken = async (refreshToken) => {
    logger_1.default.info("refreshAccessToken Function Called");
    const tokenUrl = "https://api.dropboxapi.com/oauth2/token";
    const response = await axios_1.default.post(tokenUrl, new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: process.env.DROPBOX_APPKEY,
        client_secret: process.env.DROPBOX_SECRET,
    }));
    logger_1.default.info("Token refreshed successfully");
    return response.data;
};
const initializeDropboxClient = async (userId, accessToken) => {
    logger_1.default.info("initializeDropboxClient Function Called");
    const { access_token, refresh_token, expires_in } = accessToken;
    if (new Date() >= new Date(expires_in)) {
        const newAccessToken = await refreshAccessToken(refresh_token);
        await model_1.Employee.update({
            dropboxAccessToken: JSON.stringify({
                ...accessToken,
                access_token: newAccessToken.access_token,
                expires_in: (0, calculateTokenExpiry_1.calculateTokenExpiry)(newAccessToken.expires_in),
            }),
        }, { where: { id: userId } });
        return new dropbox_1.Dropbox({ accessToken: newAccessToken.access_token });
    }
    else {
        logger_1.default.info("Token has not expired yet");
        return new dropbox_1.Dropbox({ accessToken: access_token });
    }
};
