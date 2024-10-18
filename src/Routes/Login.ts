import express from "express";
import {
  login,
  requestPasswordReset,
  resetPassword,
} from "../Controller/LoginController";
import { getAuthUrl, oauth2Callback } from "../Controller/googleAuthController";
import session from "cookie-session";
import {
  dropboxAuthCallback,
  getDropboxAuthUrl,
} from "../Controller/dropboxController";
import { authenticateJWT } from "../Middleware/auth";

const router = express.Router();

// Middleware for session management
router.use(
  session({
    name: "session",
    keys: [process.env.SESSION_SECRET || "default_secret"],
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  }),
);

router.post("/login", login);
router.post("/forgetPassword", requestPasswordReset);
router.post("/resetPassword", resetPassword);
// Route to generate the Google authentication URL
router.get("/auth/google", getAuthUrl);

// Route to handle the OAuth2 callback
router.post("/auth/callback", oauth2Callback);
router.get("/dropbox/auth-url", getDropboxAuthUrl);
router.post("/dropbox/callback", authenticateJWT, dropboxAuthCallback);

export default router;
