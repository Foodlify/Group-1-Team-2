import prisma from "../../lib/prisma";

export const getRestaurantById = async (id: number) => {
    return await prisma.restaurant.findUnique({ where: { id } });
};

export const updateRestaurant = async (id: number, data: any) => {
    return await prisma.restaurant.update({ where: { id }, data });
};

export const deleteRestaurant = async (id: number) => {
    return await prisma.restaurant.delete({ where: { id } });
};