import { Request, Response, NextFunction } from "express";
import { NoTAUTHORIZED } from "../shared/exceptions/auth.exception";
export const isAuthorized = (... requiredRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    console.log("User role:", req.userRole); // Debugging log
    if (!req.userRole || !requiredRoles.includes(req.userRole) ) {
      throw new NoTAUTHORIZED();
    }
    next();
  }
};