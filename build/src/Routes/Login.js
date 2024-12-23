"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const LoginController_1 = require("../Controller/LoginController");
const googleAuthController_1 = require("../Controller/googleAuthController");
const dropboxController_1 = require("../Controller/dropboxController");
const auth_1 = require("../Middleware/auth");
const router = express_1.default.Router();
router.post("/login", LoginController_1.login);
router.post("/forgetPassword", LoginController_1.requestPasswordReset);
router.post("/resetPassword", LoginController_1.resetPassword);
router.get("/auth/google", auth_1.authenticateJWT, googleAuthController_1.getAuthUrl);
// Route to handle the OAuth2 callback
router.post("/auth/callback", auth_1.authenticateJWT, googleAuthController_1.oauth2Callback);
router.get("/dropbox/auth-url", auth_1.authenticateJWT, dropboxController_1.getDropboxAuthUrl);
router.post("/dropbox/callback", auth_1.authenticateJWT, dropboxController_1.dropboxAuthCallback);
exports.default = router;
