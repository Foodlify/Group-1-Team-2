import { Request, Response, NextFunction } from "express";
import { logger } from "../config/logger";

const globalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error("Unhandled Exception", {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
  });
  if ("statusCode" in err) {
    return res.status((err as any).statusCode).json({
      status: "error",
      message: (err as any).message,
    });
  }

  res.status(500).json({
    status: "error",
    message: "internal server error",
  });
};

export default globalErrorHandler;
