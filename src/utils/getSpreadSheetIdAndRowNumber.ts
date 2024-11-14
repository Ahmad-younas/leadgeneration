import Job from "../Model/Job";
import { Employee } from "../Model/model";
import Logger from "../logger";

type SpreadsheetInfo = {
  spreadSheetId: string | undefined;
  rowNumber: number | undefined;
  googleTokens: string | undefined;
} | null;
export const getSpreadSheetIdAndRowNumber = async (
  jobId: number,
  userId: string | undefined,
): Promise<SpreadsheetInfo> => {
  Logger.info("getSpreadSheetIdAndRowNumber Function Called");
  try {
    const job = await Job.findOne({
      where: { id: jobId },
      attributes: ["rowNumber"],
    });
    const rowNumber = job?.dataValues.rowNumber;
    const employee = await Employee.findOne({
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
  } catch (error) {
    Logger.error("Error", error);
    throw new Error("Could not retrieve spreadsheet information.");
  }
};
