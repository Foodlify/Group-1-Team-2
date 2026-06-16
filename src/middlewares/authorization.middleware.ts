import { Request, Response, NextFunction } from "express";
import { NoTAUTHORIZED } from "../shared/exceptions/auth.exception";
export const isAuthorized = (... requiredRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.userRole || !requiredRoles.includes(req.userRole) ) {
      throw new NoTAUTHORIZED();
    }
    next();
  }
};