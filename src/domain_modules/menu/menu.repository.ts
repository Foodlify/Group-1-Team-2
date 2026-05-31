import prisma from "../../lib/prisma";

export type MenuItemCreateInput = {
  itemName: string;
  price: number;
  stock?: number;
};

export const findRestaurantById = async (restaurantId: number) => {
  return await prisma.restaurant.findUnique({ where: { id: restaurantId } });
};
export const createMenu = async (restaurantId: number,) => {
    // create a menu for the restaurant
    return await prisma.menu.create({
        data: {
            restaurantId,
        },
    });
};

