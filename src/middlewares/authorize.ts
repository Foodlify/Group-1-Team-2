import { Request, Response, NextFunction } from "express";
import { Role } from "@prisma/client";
import { ForbiddenException, UnauthorizedException } from "../shared/exceptions/auth.exception";

export const authorize = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.userRole) throw new UnauthorizedException();

    if (!roles.includes(req.userRole)) {
      throw new ForbiddenException();
    }

    next();
  };
};
