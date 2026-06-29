import * as menuItemRepository from "./menuItem.repository"
import { findMenuById } from "../menu/menu.services";

import { MenuItemNotFoundException } from "../../shared/exceptions/MenuItem.exception";
import { UpdateMenuItem } from "../../types/menuItem";

import { MenuItemResponseDto, toMenuItemDto } from "../../types/menuItem"

import { cache, CacheKeys } from "../../config/cache";

import { checkIfUserAdminInRestaurant } from "../../shared/helper/restaurant.helper"
export const createMenuItem = async(restaurantId: number, menuId: number, itemName: string , price: number, stock: number, userId: number):Promise<MenuItemResponseDto>=> {

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

    cache.del(CacheKeys.restaurant(restaurantId));

}



