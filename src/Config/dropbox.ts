import { DropboxAuth } from "dropbox";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Initialize DropboxAuth instance without clientId and set it explicitly
const dropboxAuth = new DropboxAuth({
  clientSecret: process.env.DROPBOX_SECRET!,
});

// Explicitly set the clientId after initialization
dropboxAuth.setClientId(process.env.DROPBOX_APPKEY!); // This ensures the clientId is set

export { dropboxAuth };
