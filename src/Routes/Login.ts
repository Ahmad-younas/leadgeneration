import express from "express";
import {
  login,
  requestPasswordReset,
  resetPassword,
} from "../Controller/LoginController";
import { getAuthUrl, oauth2Callback } from "../Controller/googleAuthController";
import {
  dropboxAuthCallback,
  getDropboxAuthUrl,
} from "../Controller/dropboxController";
import { authenticateJWT } from "../Middleware/auth";

const router = express.Router();

router.post("/login", login);
router.post("/forgetPassword", requestPasswordReset);
router.post("/resetPassword", resetPassword);
router.get("/auth/google", authenticateJWT, getAuthUrl);

// Route to handle the OAuth2 callback
router.post("/auth/callback", authenticateJWT, oauth2Callback);
router.get("/dropbox/auth-url", authenticateJWT, getDropboxAuthUrl);
router.post("/dropbox/callback", authenticateJWT, dropboxAuthCallback);

export default router;
