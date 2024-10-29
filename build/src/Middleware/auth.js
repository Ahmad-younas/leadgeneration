"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryptPassword = exports.encryptedPassword = exports.authorizeRole = exports.authenticateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const logger_1 = __importDefault(require("../logger"));
const authenticateJWT = (req, res, next) => {
    logger_1.default.info("authenticateJWT Triggered");
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) {
        return res.sendStatus(401);
    }
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
};
exports.authenticateJWT = authenticateJWT;
const authorizeRole = (...roles) => {
    logger_1.default.info("authorizeRole Triggered");
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.sendStatus(403);
        }
        next();
    };
};
exports.authorizeRole = authorizeRole;
const encryptedPassword = (password) => {
    logger_1.default.info("encryptedPassword Triggered");
    const algorithm = "aes-256-cbc";
    const key = Buffer.from(process.env.ENCRYPTION_KEY || "", "hex");
    const iv = Buffer.from(process.env.IV || "", "hex");
    const cipher = crypto_1.default.createCipheriv(algorithm, key, iv);
    let hashedPassword = cipher.update(password, "utf8", "hex");
    hashedPassword += cipher.final("hex");
    return hashedPassword;
};
exports.encryptedPassword = encryptedPassword;
const decryptPassword = (encryptedPassword) => {
    logger_1.default.info("decryptPassword Triggered");
    const algorithm = "aes-256-cbc";
    const key = Buffer.from(process.env.ENCRYPTION_KEY || "", "hex");
    const iv = Buffer.from(process.env.IV || "", "hex");
    const decipher = crypto_1.default.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedPassword, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
};
exports.decryptPassword = decryptPassword;
