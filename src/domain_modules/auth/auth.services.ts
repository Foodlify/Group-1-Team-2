import prisma from '../../lib/prisma';
import { EmailAlreadyExistsException, InvalidCredentialsException } from '../../shared/exceptions/auth.exception';
import { generateToken } from '../../utils/jwt';
import bcrypt from "bcrypt";
import { sanitizeUser } from './../../utils/sanitizers';
import { signupSchema } from './auth.validation';
import { z } from 'zod';
import * as userRepo from '../user/user.repository';
import { logger } from '../../config/logger';

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