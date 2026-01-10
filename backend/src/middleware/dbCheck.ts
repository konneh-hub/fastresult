import { RequestHandler } from "express";
import { AppDataSource } from "../data-source";

// Allow a mock mode for UI demos when SKIP_DB=true
export const dbCheck: RequestHandler = (req, res, next) => {
  if (process.env.SKIP_DB === "true") {
    // allow requests to proceed in mock mode
    return next();
  }
  if (!AppDataSource.isInitialized) {
    return res.status(503).json({ message: "Database not initialized" });
  }
  next();
};
