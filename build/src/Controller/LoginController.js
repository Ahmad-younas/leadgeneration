"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.requestPasswordReset = exports.login = void 0;
const User_1 = __importDefault(require("../Model/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logger_1 = __importDefault(require("../logger"));
const logger_2 = __importDefault(require("../logger"));
const auth_1 = require("../Middleware/auth");
const model_1 = require("../Model/model");
const sendResetPasswordEmail_1 = require("../utils/sendResetPasswordEmail");
const crypto_1 = __importDefault(require("crypto"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const login = async (req, res) => {
    logger_2.default.info("login Triggered");
    const { email, password } = req.body;
    try {
        const user = await User_1.default.findOne({
            where: { email: email },
        });
        if (!user) {
            return res.status(401).send("Invalid Credentials");
        }
        const userId = user.dataValues.id;
        const hashedPassword = user.dataValues.password;
        const userRole = user.dataValues.role;
        const userEmail = user.dataValues.email;
        const userName = user.dataValues.username;
        const isPasswordMatch = (0, auth_1.decryptPassword)(hashedPassword);
        if (isPasswordMatch === password) {
            const token = jsonwebtoken_1.default.sign({ id: userId, username: userName, role: userRole, email: userEmail }, process.env.JWT_SECRET, { expiresIn: "1d" });
            logger_1.default.info("Token Sent Successfully ");
            return res.json({ token });
        }
        else {
            return res.status(401).send("Invalid Credentials");
        }
    }
    catch (err) {
        if (err instanceof Error) {
            logger_1.default.error(err.message);
        }
        return res.status(500).send("Database error" + err);
    }
};
exports.login = login;
const requestPasswordReset = async (req, res) => {
    logger_2.default.info("requestPasswordReset Triggered");
    const { email } = req.body;
    try {
        const user = await model_1.Employee.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const StringToken = crypto_1.default.randomBytes(20).toString("hex");
        const token = await bcrypt_1.default.hash(StringToken, 10);
        // await user.save();
        try {
            user.setDataValue("resetPasswordToken", token);
            user.setDataValue("resetPasswordExpires", new Date(Date.now() + 120000)); // 1 hour from now
            await user.save();
        }
        catch (error) {
            console.error("Error saving user:", error);
        }
        //
        await (0, sendResetPasswordEmail_1.sendResetPasswordEmail)(email, token);
        res.json({ message: "Reset password email sent" });
    }
    catch (err) {
        if (err instanceof Error) {
            logger_1.default.error(err.message); // TypeScript now knows err is an Error
        }
        else {
            logger_1.default.error("An unknown error occurred");
        }
        res.status(500).json({ message: "Server error", error: String(err) });
    }
};
exports.requestPasswordReset = requestPasswordReset;
/**
 * Resets the user's password using the reset token.
 * @param req - Express request object
 * @param res - Express response object
 */
const resetPassword = async (req, res) => {
    logger_2.default.info("resetPassword Triggered");
    const { token, newPassword } = req.body; // Get the token and new password from the request body
    try {
        // Find the user by reset token
        const user = await model_1.Employee.findOne({
            where: { resetPasswordToken: token },
        });
        console.log("user", user?.resetPasswordExpires);
        console.log("user", user);
        if (!user) {
            return res
                .status(404)
                .json({ message: "Invalid or expired reset token" });
        }
        logger_2.default.info(`resetPasswordExpires${user.resetPasswordExpires}`);
        logger_2.default.info(`NewDate${new Date()}`);
        // Check if the reset token has expired
        if (user.resetPasswordExpires && user.resetPasswordExpires <= new Date()) {
            console.log("Inside");
            return res.status(400).json({ message: "Reset token has expired" });
        }
        // Hash the new password
        const hashedPassword = (0, auth_1.encryptedPassword)(newPassword);
        // Update the user's password and clear the reset token/expiry
        user.setDataValue("password", hashedPassword);
        user.setDataValue("resetPasswordToken", null);
        user.setDataValue("resetPasswordExpires", null);
        await user.save();
        res.json({ message: "Password reset successfully" });
    }
    catch (error) {
        console.error("Error resetting password:", error);
        res.status(500).json({ message: "Server error", error });
    }
};
exports.resetPassword = resetPassword;
