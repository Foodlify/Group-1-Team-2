import prisma from "../../lib/prisma";

export const createMenu = async (restaurantId: number,) => {
    // create a menu for the restaurant
    return await prisma.menu.create({
        data: {
            restaurantId,
            isDeleted: false,
        },
    });
};

export const getMenus = async (restaurantId: number) => {
    return await prisma.menu.findMany({
        where: { restaurantId, isDeleted: false },
        include: {
            menuItems: true,
        },
    });
};

export const deleteMenu = async (restaurantId: number, menuId: number) => {
    // delete the menu and its items
    await prisma.menu.update({
        where: { id: menuId, restaurantId },
        data: { isDeleted: true },
    });
};
