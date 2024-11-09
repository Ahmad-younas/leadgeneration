import Logger from "../logger";

export const calculateTokenExpiry = (expiresIn: number): Date => {
  Logger.info("CalculateTokenExpiry Function called");
  const hours = Math.floor(expiresIn / 3600);
  const currentDate = new Date();
  const tokenExpiryDate = new Date(
    currentDate.getTime() + hours * 60 * 60 * 1000,
  );
  return tokenExpiryDate;
};
