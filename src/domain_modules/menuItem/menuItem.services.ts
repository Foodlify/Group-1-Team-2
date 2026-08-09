import * as menuItemRepository from "./menuItem.repository";
import { findMenuById } from "../menu/menu.services";
import { SomeOfItemsNotAvailableException } from "../../shared/exceptions/MenuItem.exception";
import { MenuItemNotFoundException } from "../../shared/exceptions/MenuItem.exception";
import { UpdateMenuItem } from "../../types/menuItem";
import {DBClient} from "../../types/PrismaClientOrTx"

export const createMenuItem = async(menuId: number, itemName: string , price: number, stock: number) => {

    await findMenuById(menuId);
   
    const menuItem = await menuItemRepository.createMenuItem(menuId, itemName, price, stock);

    return menuItem;
}

export const getMenuItemById = async (menuItemId: number, menuId: number) => {
    await findMenuById(menuId);
    const menuItem = await menuItemRepository.getMenuItemById(menuItemId, menuId);

    if (!menuItem) {
        throw new MenuItemNotFoundException(menuItemId);
    }

    return menuItem;
};

export const getMenuItemsByMenuId = async (menuId: number) => {
    await findMenuById(menuId);

    const menuItems = await menuItemRepository.getMenuItemsByMenuId(menuId);

    if (!menuItems) {
        throw new MenuItemNotFoundException(menuId);
    }

    return menuItems;

};

export const updateMenuItem = async (menuId: number, menuItemId: number , data: UpdateMenuItem) => {
    await findMenuById(menuId);

    await getMenuItemById(menuItemId, menuId);

    const menuItem = await menuItemRepository.updateMenuItem(menuId, menuItemId, data);
   
    return menuItem;
    
};

export const deleteMenuItem = async (menuId: number, menuItemId: number) => {
    await findMenuById(menuId);
    
    await getMenuItemById(menuItemId, menuId);

    await menuItemRepository.deleteMenuItem(menuId, menuItemId);

}


export const reserveStock = async (
  menuItemId: number,
  quantity: number,
  client: DBClient
) => {
  const result = await menuItemRepository.decrementStockIfAvailable(menuItemId, quantity, client);
  return result;
  
};