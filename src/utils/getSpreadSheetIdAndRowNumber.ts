import Job from "../Model/Job";
import { Employee } from "../Model/model";

type SpreadsheetInfo = {
  spreadSheetId: string | undefined;
  rowNumber: number | undefined;
  googleTokens: string | undefined;
} | null;
export const getSpreadSheetIdAndRowNumber = async (
  jobId: number,
  userId: string | undefined,
): Promise<SpreadsheetInfo> => {
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
    console.error("Error fetching spreadsheet ID and row number:", error);
    throw new Error("Could not retrieve spreadsheet information.");
  }
};
