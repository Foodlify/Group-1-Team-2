import prisma from '../../lib/prisma';
 import { User } from "@prisma/client";
export const updatePasswordByEmail = async (email: string, hashedPassword: string) => {
    await prisma.user.updateMany({
        where: { email },
        data: { password: hashedPassword }
    })};

export const findUserByEmail = async (email: string) => {
    return await prisma.user.findUnique({
        where: { email }
    });
};

export const updateUser = async (
    userId: number,
    data: Partial<User>
) => {

    return prisma.user.update({
        where: { id: userId },
        data
    });
};
