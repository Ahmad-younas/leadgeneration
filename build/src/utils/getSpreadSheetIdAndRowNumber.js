"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSpreadSheetIdAndRowNumber = void 0;
const Job_1 = __importDefault(require("../Model/Job"));
const model_1 = require("../Model/model");
const getSpreadSheetIdAndRowNumber = async (jobId, userId) => {
  try {
    const job = await Job_1.default.findOne({
      where: { id: jobId },
      attribut'rowNumber'mber"],
    });
    const rowNumber = job?.dataValues.rowNumber;
    const employee = await model_1.Employee.findOne({
      where: { id: userId },
      attribut'spreadsheetId'et'googleTokens'kens"],
    });
    const spreadSheetId = employee?.dataValues.spreadsheetId;
    const googleTokens = employee?.dataValues.googleTokens;
    return {
      rowNumber,
      spreadSheetId,
      googleTokens,
    };
  } catch (error) {
    console.e'Error fetching spreadsheet ID and row number:'ber:", error);
    throw new E'Could not retrieve spreadsheet information.'ion.");
  }
};
exports.getSpreadSheetIdAndRowNumber = getSpreadSheetIdAndRowNumber;
