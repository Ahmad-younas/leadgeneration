"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateTokenExpiry = void 0;
const logger_1 = __importDefault(require("../logger"));
const calculateTokenExpiry = (expiresIn) => {
    logger_1.default.info("CalculateTokenExpiry Function called");
    const hours = Math.floor(expiresIn / 3600);
    const currentDate = new Date();
    const tokenExpiryDate = new Date(currentDate.getTime() + hours * 60 * 60 * 1000);
    return tokenExpiryDate;
};
exports.calculateTokenExpiry = calculateTokenExpiry;
