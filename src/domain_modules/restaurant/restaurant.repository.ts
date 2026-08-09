import prisma from "../../lib/prisma";
import { createRestaurantDto, updateRestaurantDto } from "../../types/restaurant"

export const getRestaurantById = async (id: number) => {
    return await prisma.restaurant.findUnique({ 
        where: { id, 
            isDeleted:false
         },
        include:{
            menus:{
                include:{
                    menuItems:true
                }
            }
        }

    });
};

export const createRestaurant = async (data:createRestaurantDto, userId: number) => {
    return await prisma.restaurant.create( 
        {
        data: { name:data.name, admins: { connect: { id: userId } } },
        include:{
            menus:{
                include:{
                    menuItems:true
                }
            }
        }
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

export const updateRestaurant = async (id: number, data: updateRestaurantDto) => {
    return await prisma.restaurant.update(
        { where: { id }
        , data,
        include: {
            menus: {
                include: {
                    menuItems: true
                }
            }

    }
        }
    );
};

export const deleteRestaurantCascade = async (restaurantId: number) => {
        return prisma.$transaction(async (tx) => {

            const menus = await tx.menu.findMany({
                where: { restaurantId, isDeleted: false },
                select: { id: true },
            });
            const menuIds = menus.map((m) => m.id);

            if (menuIds.length > 0) {
                await tx.menuItem.updateMany({
                    where: { menuId: { in: menuIds }, isDeleted: false },
                    data: { isDeleted: true },
                });
                await tx.menu.updateMany({
                    where: { id: { in: menuIds } },
                    data: { isDeleted: true },
                });
            }
                await tx.restaurant.update({
                    where: { id: restaurantId },
                    data: { isDeleted: true },
            });
    });
};

export const getRestaurantWithAdmins = async (id: number) => {
    return await prisma.restaurant.findUnique({ 
        where: { id },
        include:{
            admins:true,
        }
    
    })
};
