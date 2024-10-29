"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSpreadSheetIdAndRowNumber = void 0;
const Job_1 = __importDefault(require("../Model/Job"));
const model_1 = require("../Model/model");
const getSpreadSheetIdAndRowNumber = async (jobId, userId) => {
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
        console.error("Error fetching spreadsheet ID and row number:", error);
        throw new Error("Could not retrieve spreadsheet information.");
    }
};
exports.getSpreadSheetIdAndRowNumber = getSpreadSheetIdAndRowNumber;
