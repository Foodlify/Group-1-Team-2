import { EmailAlreadyExistsException, InvalidCredentialsException, UnauthorizedException, UserNoLongerExistsException } from '../../shared/exceptions/auth.exception';
import { generateToken, verifyToken } from '../../utils/jwt';
import bcrypt from "bcrypt";
import { sanitizeUser } from './../../utils/sanitizers';
import { signupSchema } from './auth.validation';
import { z } from 'zod';
import * as userRepo from '../user/user.repository';
import { logger } from '../../config/logger';
import { asyncHandler } from '../../utils/asyncHandler';
import jwt from "jsonwebtoken"

type SignupInput = z.infer<typeof signupSchema>;

export const signupService = async (data: SignupInput) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  try {
    const user = await userRepo.createUser({...data, hashedPassword});
    logger.info(`New user registered: ${user.id}`);
    const token = generateToken({ userId: user.id });
    return { user: sanitizeUser(user), token };

  } catch (err: any) {
    if (err.code === "P2002") {
      logger.warn(`Signup attempt with existing email: ${data.email}`);
      throw new EmailAlreadyExistsException();
    }
    logger.error(`Signup failed: ${err.message}`);
   throw err;
  }
};

export const loginService = async (email: string, pass: string) => {
  const user = await userRepo.findUserByEmail(email);
  if (!user || !(await bcrypt.compare(pass, user.password))) {
  throw new InvalidCredentialsException();
}

const token = generateToken({ userId: user.id });
return { user: sanitizeUser(user), token };

}

export const protect = asyncHandler(async (req: any, res: any, next: any) => {
   // 1) check if token exists, if exists get
   const token = req.cookies.token;
   if(!token) throw new UnauthorizedException();


   //2) verify token (no change happens, expired or not)
  const decoded =verifyToken(token);

   //3) check if user still exists 
   const currentUser = await userRepo.findUserById(decoded.userId);
   if(!currentUser) throw new UserNoLongerExistsException();


   //4) check if user changed password after token was issued
   if(currentUser.passwordChangedAt){
     const passwordChangedTimestamp = currentUser.passwordChangedAt.getTime()/1000;

     if(decoded.iat < passwordChangedTimestamp){
       throw new UnauthorizedException();
     }
   }

   req.user =currentUser;
   next();
});