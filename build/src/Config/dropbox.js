"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dropboxAuth = void 0;
const dropbox_1 = require("dropbox");
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
// Initialize DropboxAuth instance without clientId and set it explicitly
const dropboxAuth = new dropbox_1.DropboxAuth({
    clientSecret: process.env.DROPBOX_SECRET,
});
exports.dropboxAuth = dropboxAuth;
// Explicitly set the clientId after initialization
dropboxAuth.setClientId(process.env.DROPBOX_APPKEY); // This ensures the clientId is set
