import { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  req.userId = 1;
  
  next();
};