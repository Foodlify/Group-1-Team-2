import prisma from "../../lib/prisma";
import { UpdateMenuItem } from "../../types/menuItem";
import {DBClient} from "../../types/PrismaClientOrTx"

export const createMenuItem = async (menuId: number, itemName: string, price: number, stock: number) => {
    return await prisma.menuItem.create({
        data: {
            menuId,
            itemName,
            price,
            stock,
        },
    });
};


export const getMenuItemsByMenuId = async (menuId: number) => {
    return await prisma.menuItem.findMany({
        where: {
            menuId,
            isDeleted: false
        },
    });
}

export const getMenuItemById = async (menuItemId: number, menuId: number) => {
    return await prisma.menuItem.findFirst({
        where: {
            id: menuItemId,
            menuId,
            isDeleted: false
        },
    });
}

export const updateMenuItem = async (menuId: number, menuItemId: number , data: UpdateMenuItem) => {
    return await prisma.menuItem.update({
        where: {
            menuId,
            id: menuItemId,

        },
        data: {
            ...data
        },
    });
}

export const deleteMenuItem = async (menuId: number, menuItemId: number) => {
    await prisma.menuItem.update({
        where: {
            menuId,
            id: menuItemId
        },
        data: {
            isDeleted: true
        }  
    });
}


export const decrementStockIfAvailable = async (
  menuItemId: number,
  quantity: number,
  client: DBClient = prisma
) => {
  return client.menuItem.updateMany({
    where: {
      id: menuItemId,
      stock: { gte: quantity },
    },
    data: {
      stock: { decrement: quantity },
    },
  });
};