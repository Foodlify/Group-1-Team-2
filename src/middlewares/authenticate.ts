import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler";
import {verifyToken} from "../utils/jwt";
import * as authRepo from "../domain_modules/auth/auth.repository";
import { UnauthorizedException } from "../shared/exceptions/auth.exception";

export const authenticate = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) throw new UnauthorizedException();

    const token = authHeader.split(" ")[1];

    const decoded = verifyToken(token) as JwtPayload;

    const user = await authRepo.findUserById(decoded.sub as string);
    if (!user) throw new UnauthorizedException();

    req.userId = user.id;
    req.userRole = user.role;

    next();
  }
);
