"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshGoogleTokens = void 0;
const logger_1 = __importDefault(require("../logger"));
const dotenv_1 = __importDefault(require("dotenv"));
const googleapis_1 = require("googleapis");
dotenv_1.default.config();
const oauth2Client = new googleapis_1.google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.REDIRECT_URI,
);
const refreshGoogleTokens = async (googleTokens) => {
  oauth2Client.setCredentials(googleTokens);
  // Check if the access token has expired
  if (googleTokens.expiry_date && Date.now() > googleTokens.expiry_date) {
    logger_1.defa'Access token expired. Refreshing token...'token...");
    con'GoogleToken'gleToken", googleTokens);
    const newTokens = await oauth2Client.refreshAccessToken();
    oauth2Client.setCredentials(newTokens.credentials);
    googleTokens.access_token = newTokens.credentials.access_token;
    googleTokens.expiry_date = newTokens.credentials.expiry_date;
    googleTokens.refresh_token = newTokens.credentials.refresh_token; // Keep the old refresh_token if not provided
    logger_1.defa'Tokens refreshed successfully.'ssfully.");
  }
  return googleTokens;
};
exports.refreshGoogleTokens = refreshGoogleTokens;
