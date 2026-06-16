import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { verifyToken } from "../utils/jwt";
import prisma from "../lib/prisma";
import { JwtCustomPayload } from "../utils/jwt";
import { NoTAUTHORIZED, NOTAUTHENTICATED } from "../shared/exceptions/auth.exception";




export const isAuthenticated = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  // get token from cookies
  const token = req.cookies.token;
  if (!token) {
    throw new NOTAUTHENTICATED(); 
  }
  // verify token and extract userId
    const decoded: JwtCustomPayload = verifyToken(token);
  //  find user by userId and attach to req.user
  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
  });
  if (!user) {
    throw new NOTAUTHENTICATED(); 
  }

  if (user.passwordChangedAt) {
  const changedAt = Math.floor(user.passwordChangedAt.getTime() / 1000);
  if (decoded.iat < changedAt) {
    throw new NOTAUTHENTICATED();
  }
}
  // attach user to req.user
  req.userId = user.id;
  req.userRole = user.role;

  next();
});

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  req.userId = 123;
  
  next();
};




// export const protect = asyncHandler(async (req: any, res: any, next: any) => {
//    // 1) check if token exists, if exists get
//    const token = req.cookies.token;
//    if(!token) throw new UnauthorizedException();

//    //2) verify token (no change happens, expired or not)
//   const decoded =verifyToken(token);
//    //3) check if user still exists 
//    const currentUser = await userRepo.findUserById(decoded.userId);
//    if(!currentUser) throw new UserNoLongerExistsException();
//    //4) check if user changed password after token was issued
//    if(currentUser.passwordChangedAt){
//      const passwordChangedTimestamp = currentUser.passwordChangedAt.getTime()/1000;
//      if(decoded.iat < passwordChangedTimestamp){
//        throw new UnauthorizedException();
//      }
//    }
//    req.user =currentUser;
//    next();
// });