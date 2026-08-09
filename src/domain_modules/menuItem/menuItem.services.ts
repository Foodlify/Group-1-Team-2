import * as menuItemRepository from "./menuItem.repository";
import { findMenuById } from "../menu/menu.services";
import { SomeOfItemsNotAvailableException } from "../../shared/exceptions/MenuItem.exception";
import { MenuItemNotFoundException } from "../../shared/exceptions/MenuItem.exception";
import { UpdateMenuItem } from "../../types/menuItem";
import {DBClient} from "../../types/PrismaClientOrTx"

export const createMenuItem = async(menuId: number, itemName: string , price: number, stock: number) => {

    await checkIfUserAdminInRestaurant(restaurantId, userId)
    await findMenuById(menuId);
   
    const menuItem = await menuItemRepository.createMenuItem(menuId, itemName, price, stock);

    cache.del(CacheKeys.restaurant(restaurantId));

   return toMenuItemDto (menuItem);
}

export const getMenuItemById = async (menuItemId: number, menuId: number):Promise<MenuItemResponseDto> => {
    await findMenuById(menuId);
    const menuItem = await menuItemRepository.getMenuItemById(menuItemId, menuId);

    if (!menuItem) {
        throw new MenuItemNotFoundException(menuItemId);
    }

    return toMenuItemDto(menuItem)
};

export const getMenuItemsByMenuId = async (menuId: number):Promise<MenuItemResponseDto[]> => {
    
    await findMenuById(menuId);

    const menuItems = await menuItemRepository.getMenuItemsByMenuId(menuId);

    return menuItems.map(toMenuItemDto);

};

export const updateMenuItem = async (restaurantId: number, userId: number, menuId: number, menuItemId: number , data: UpdateMenuItem):Promise<MenuItemResponseDto> => {

    await checkIfUserAdminInRestaurant(restaurantId, userId)

    await findMenuById(menuId);

    await getMenuItemById(menuItemId, menuId);

    const menuItem = await menuItemRepository.updateMenuItem(menuId, menuItemId, data);

    cache.del(CacheKeys.restaurant(restaurantId));
    
    return toMenuItemDto(menuItem)
};

export const deleteMenuItem = async (restaurantId: number, userId: number, menuId: number, menuItemId: number): Promise<void> => {

    await checkIfUserAdminInRestaurant(restaurantId, userId);

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