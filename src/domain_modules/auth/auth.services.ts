import { EmailAlreadyExistsException, InvalidCredentialsException, UnauthorizedException, UserNoLongerExistsException } from '../../shared/exceptions/auth.exception';
import { generateToken, verifyToken } from '../../utils/jwt';
import prisma from '../../lib/prisma';
import * as AuthExceptions from '../../shared/exceptions/auth.exception';


import bcrypt from "bcrypt";
import { sanitizeUser } from './../../utils/sanitizers';
import { signupSchema } from './auth.validation';
import { z } from 'zod';
import * as userRepo from '../user/user.repository';
import { logger } from '../../config/logger';
import { asyncHandler } from '../../utils/asyncHandler';
import jwt from "jsonwebtoken"
import * as authRepository from './auth.repository';
import crypto from "crypto";
import { sendEmail } from '../../utils/sendEmail';
import { generateResetPasswordTemplate } from '../../utils/htmlTemplets';


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
      throw new AuthExceptions.EmailAlreadyExistsException();
    }
    logger.error(`Signup failed: ${err.message}`);
   throw err;
  }
};

export const loginService = async (email: string, pass: string) => {
  const user = await userRepo.findUserByEmail(email);
  if (!user || !(await bcrypt.compare(pass, user.password))) {
  throw new AuthExceptions.InvalidCredentialsException();
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

export const forgetPassword = async (email: string) => {
  const user = await authRepository.findUserByEmail(email);
  if (!user) {
    throw new AuthExceptions.UserNotFoundException();
  }
  const otp = crypto.randomInt(100000, 999999).toString();
  // Here you would send the OTP to the user's email using your email service

  console.log(`Generated OTP for ${email}: ${otp}`); // For testing purposes, log the OTP to the console

  const hashedOtp = await bcrypt.hash(otp, 10);
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); 
  await authRepository.updateUser(user.id, {
    resetPasswordOtp: hashedOtp,
    resetPasswordOtpExpiry: otpExpiry
  });

  const messageSent = await sendEmail({to:email,subject:"sendOtp",html:generateResetPasswordTemplate(otp)});
  if (!messageSent) {
    throw new AuthExceptions.OTPEmailFailedException();
  }


};

export const resetPassword = async (email: string, otp: string, newPassword: string) => {
  const user = await authRepository.findUserByEmail(email);
  if (!user) {
    throw new AuthExceptions.UserNotFoundException();
  }
  if (!user.resetPasswordOtp || !user.resetPasswordOtpExpiry) {
    throw new AuthExceptions.InvalidOTPRequestException();
  }
  const isExpired = user.resetPasswordOtpExpiry < new Date();
  if (isExpired) {
    throw new AuthExceptions.OTPExpiredException();
  }
  const isOtpValid = await bcrypt.compare(otp, user.resetPasswordOtp);
  if (!isOtpValid) {
    throw new AuthExceptions.InvalidOTPException();
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await authRepository.updateUser(user.id, {
    password: hashedPassword,
    resetPasswordOtp: null,
    resetPasswordOtpExpiry: null
  });

};
