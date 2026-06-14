import { Request, Response, NextFunction } from "express";
import { ForbiddenException, UnauthorizedException, UserNoLongerExistsException } from "../shared/exceptions/auth.exception";
import {Role} from "@prisma/client"


export const authorize = (...roles: Role[])=>{
  return (req: Request, res: Response, next: NextFunction) => {
    if(!roles.includes(req.userRole as Role)){
      throw new ForbiddenException();
    }
    next();
  }
}