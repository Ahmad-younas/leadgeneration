import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Logger from "../logger";

interface User {
  role: string;
  id: string;
  email: string;
}

interface CustomRequest extends Request {
  user?: User;
}

const authenticateJWT = (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  Logger.info("authenticateJWT Triggered");
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    return res.sendStatus(401);
  }
  jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user as User;
    next();
  });
};

const authorizeRole = (...roles: string[]) => {
  Logger.info("authorizeRole Triggered");
  return (req: CustomRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.sendStatus(403);
    }
    next();
  };
};

const encryptedPassword = (password: string) => {
  Logger.info("encryptedPassword Triggered");
  const algorithm = "aes-256-cbc";
  const key = Buffer.from(process.env.ENCRYPTION_KEY || "", "hex");
  const iv = Buffer.from(process.env.IV || "", "hex");
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let hashedPassword = cipher.update(password, "utf8", "hex");
  hashedPassword += cipher.final("hex");
  return hashedPassword;
};

const decryptPassword = (encryptedPassword: string) => {
  Logger.info("decryptPassword Triggered");
  const algorithm = "aes-256-cbc";
  const key = Buffer.from(process.env.ENCRYPTION_KEY || "", "hex");
  const iv = Buffer.from(process.env.IV || "", "hex");
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedPassword, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

export { authenticateJWT, authorizeRole, encryptedPassword, decryptPassword };
