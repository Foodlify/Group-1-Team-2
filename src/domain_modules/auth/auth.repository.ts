import prisma from '../../lib/prisma';
import { User } from "@prisma/client";

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
