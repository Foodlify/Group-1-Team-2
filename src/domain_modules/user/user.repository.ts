import { Role } from '@prisma/client';
import prisma from '../../lib/prisma';
import { signupSchema } from '../auth/auth.validation';
import { z } from 'zod';
import { CreateUserInput } from '../../types/user.types';

export const createUser = async(data:CreateUserInput)=>{
    return prisma.user.create({
        data:{
            name: data.name,
            email: data.email,
            password: data.hashedPassword,
            role: Role.CUSTOMER,
            phone: data.phone,
            customer: { create: {} } 
        }
    });
}

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};
export const findUserById = async (id: number) => {
  return prisma.user.findUnique({ where: { id} });
};


