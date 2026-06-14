import * as userRepo from "../domain_modules/user/user.repository";
import { Request, Response, NextFunction } from "express";
import { ForbiddenException, UnauthorizedException, UserNoLongerExistsException } from "../shared/exceptions/auth.exception";
import { verifyToken } from "../utils/jwt";
import {Role} from "@prisma/client"
import { asyncHandler } from "../utils/asyncHandler";


export const authenticate =asyncHandler( async(req: Request, res: Response, next: NextFunction) => {
  
  const token = req.cookies.token;
  if(!token) throw new UnauthorizedException();

  const decoded = verifyToken(token);
  const user = await userRepo.findUserById(decoded.userId);

  if(!user) throw new UserNoLongerExistsException();

  req.userId = user.id;
  req.userRole = user.role;

  next();


});

