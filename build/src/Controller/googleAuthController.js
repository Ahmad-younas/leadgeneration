"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.oauth2Callback = exports.getAuthUrl = void 0;
const model_1 = require("../Model/model");
const logger_1 = __importDefault(require("../logger"));
const googleapis_1 = require("googleapis");
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
const oauth2Client = new googleapis_1.google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.REDIRECT_URI,
);
const getAuthUrl = (req, res) => {
  con'GOOGLE_CLIENT_ID:'IENT_ID:", process.env.GOOGLE_CLIENT_ID);
  con'GOOGLE_CLIENT_SECRET:'_SECRET:", process.env.GOOGLE_CLIENT_SECRET);
  con'REDIRECT_URI:'ECT_URI:", process.env.REDIRECT_URI);
  logger_1.defa'getAuthUrl function called'n called");
  const authUrl = oauth2Client.generateAuthUrl({
    acce'offline'"offline", // Required to get a refresh token
   'https://www.googleapis.com/auth/spreadsheets'adsheets"], // Only Google Sheets API scope
   'consent'"consent",
    redirect_uri: process.env.REDIRECT_URI,
    client_id: process.env.GOOGLE_CLIENT_ID,
  });
  logger_1.default.info(`Auth URL Created: ${authUrl}`);
  con'authUrl'"authUrl", authUrl);
  res.json({ url: authUrl });
};
exports.getAuthUrl = getAuthUrl;
const oauth2Callback = async (req, res, next) => {
  logger_1.default.info('Get oauth2Callback function is called');
  const { code } = req.body;
  console.log('Code', code);
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.REDIRECT_URI;
  if (!clientId || !clientSecret || !redirectUri) {
    logger_1.default.error('Missing required environment variables: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, or REDIRECT_URI');
    res
      .status(500)
      .send('Server configuration error. Please check environment variables.');
    return;
  }
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Authorization token missing or invalid' });
    return;
  }
  const token = authHeader.split(' ')[1];
  const secretKey = process.env.JWT_SECRET || 'your-secret-key'; // Replace with your actual secret key
  const decoded = jsonwebtoken_1.default.verify(token, secretKey);
  console.log('decodedId', decoded.id);
  try {
    // Ensure code is a string
    if (typeof code !== 'string') {
      throw new Error('Invalid authorization code received.');
    }
    // Correctly call getToken with GetTokenOptions
    const tokensResponse = await oauth2Client.getToken(code);
    const tokens = tokensResponse?.tokens;
    if (!tokens) {
      throw new Error('Failed to retrieve tokens from Google.');
    }
    logger_1.default.info(`Tokens received: ${JSON.stringify(tokens)}`);
    oauth2Client.setCredentials(tokens);
    const tokensString = JSON.stringify(tokens);
    console.log('GOOGLE TOKEN:', tokensString);
    logger_1.default.info(`GoogleToken: ${tokensString}`);
    // Update employee record with Google tokens
    await model_1.Employee.update({ googleTokens: tokensString }, { where: { id: decoded.id } });
    // Redirect to success page
    // res.redirect("/success"); // Ensure this path matches your frontend setup
    next();
  } catch (error) {
    logger_1.default.error(`Error during OAuth2 callback: ${error}`);
    console.error('Error during OAuth2 callback:', error);
    res.status(500).send('Authentication failed');
  }
};
exports.oauth2Callback = oauth2Callback;
