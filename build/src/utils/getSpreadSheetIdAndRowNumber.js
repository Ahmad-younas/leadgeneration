"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSpreadSheetIdAndRowNumber = void 0;
const Job_1 = __importDefault(require("../Model/Job"));
const model_1 = require("../Model/model");
const logger_1 = __importDefault(require("../logger"));
const getSpreadSheetIdAndRowNumber = async (jobId, userId) => {
    logger_1.default.info("getSpreadSheetIdAndRowNumber Function Called");
    try {
        const job = await Job_1.default.findOne({
            where: { id: jobId },
            attributes: ["rowNumber"],
        });
        const rowNumber = job?.dataValues.rowNumber;
        const employee = await model_1.Employee.findOne({
            where: { id: userId },
            attributes: ["spreadsheetId", "googleTokens"],
        });
        const spreadSheetId = employee?.dataValues.spreadsheetId;
        const googleTokens = employee?.dataValues.googleTokens;
        return {
            rowNumber,
            spreadSheetId,
            googleTokens,
        };
    }
    catch (error) {
        logger_1.default.error("Error", error);
        throw new Error("Could not retrieve spreadsheet information.");
    }
};
exports.getSpreadSheetIdAndRowNumber = getSpreadSheetIdAndRowNumber;
