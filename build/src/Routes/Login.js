"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const LoginController_1 = require("../Controller/LoginController");
const googleAuthController_1 = require("../Controller/googleAuthController");
const cookie_session_1 = __importDefault(require("cookie-session"));
const dropboxController_1 = require("../Controller/dropboxController");
const auth_1 = require("../Middleware/auth");
const router = express_1.default.Router();
// Middleware for session management
router.use(
  (0, cookie_session_1.default)({
    name: "session",
    keys: [process.env.SESSION_SECRET || "default_secret"],
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  }),
);
router.post("/login", LoginController_1.login);
router.post("/forgetPassword", LoginController_1.requestPasswordReset);
router.post("/resetPassword", LoginController_1.resetPassword);
// Route to generate the Google authentication URL
router.get("/auth/google", googleAuthController_1.getAuthUrl);
// Route to handle the OAuth2 callback
router.post("/auth/callback", googleAuthController_1.oauth2Callback);
router.get("/dropbox/auth-url", dropboxController_1.getDropboxAuthUrl);
route'/dropbox/callback'llback", auth_1.authenticateJWT, dropboxController_1.dropboxAuthCallback);
exports.default = router;
