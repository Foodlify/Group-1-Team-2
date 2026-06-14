import "express";
import {Role} from "@prisma/client";

declare module "express-serve-static-core" {
  interface Request {
    userId?: number;
  }
}

declare global{
  namespace Express {
    interface Request {
      userId?: number;
      userRole?: Role;
    }
  }
}