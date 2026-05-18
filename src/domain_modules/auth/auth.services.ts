import prisma from '../../lib/prisma';
import { EmailAlreadyExistsException } from '../../shared/exceptions/auth.exception';
import { generateToken } from '../../utils/jwt';
const bcrypt = require("bcrypt");

export const signupService = async (data: any) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: "CUSTOMER",
        phone: data.phone,
        customer: { create: {} }
      }
    });
    const token = generateToken({ userId: user.id });

    
    return {
      user,
      token
    };

  } catch (err: any) {
    if (err.code === "P2002") {
      throw new EmailAlreadyExistsException();
    }

    throw err;
  }
};