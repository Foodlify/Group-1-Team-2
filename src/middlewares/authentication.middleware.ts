import { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}

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