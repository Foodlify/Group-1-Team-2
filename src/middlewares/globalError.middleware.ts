import { Request, Response, NextFunction } from "express";
import { logger } from "../config/logger";
import { StatusCodes } from "http-status-codes";

const globalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {

  logger.error(`Unhandled error: ${err.message} | URL: ${req.url} | Method: ${req.method}`);


if (err.name === "JsonWebTokenError"){
  return res.status(StatusCodes.UNAUTHORIZED).json({
    status: "error",
    message: "Invalid token, please login again",
  });
}

  if (err.name === "TokenExpiredError"){
  return res.status(StatusCodes.UNAUTHORIZED).json({
    status: "error",
    message: "Token expired, please login again",
  });
  }
  if ("statusCode" in err) {
  return res.status((err as any).statusCode).json({
    status: "error",
    message: err.message,
  });
}
  

  res.status(500).json({
    status: "error",
    message: "internal server error",
  });
};

export default globalErrorHandler;
