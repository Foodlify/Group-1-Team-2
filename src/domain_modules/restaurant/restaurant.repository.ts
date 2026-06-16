import prisma from "../../lib/prisma";

export const getRestaurantById = async (id: number) => {
    return await prisma.restaurant.findUnique({ 
        where: { id },
        include: {admins: true, // Include the admins relation
        }
    });
};

export const createRestaurant = async (name: string, userId: number) => {
    return await prisma.restaurant.create( 
        {
        data: { name, admins: { connect: { id: userId } } }
        }
     );
}

export const getRestaurantsByUserId = async (userId: number) => {
    return await prisma.restaurant.findFirst({
        where: {
            admins: {
                some: {
                    id: userId
                }
            }
        }
    });
}

export const updateRestaurant = async (id: number, data: any) => {
    return await prisma.restaurant.update({ where: { id }, data });
};

export const deleteRestaurant = async (id: number) => {
    return await prisma.restaurant.delete({ where: { id } });
};