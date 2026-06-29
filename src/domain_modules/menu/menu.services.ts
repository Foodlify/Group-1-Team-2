import * as menuRepository from "./menu.repository";
import { MenuNotFoundException } from "../../shared/exceptions/menuexception";
import { findRestaurantById } from "../restaurant/restaurant.service";
import { cache, CacheKeys } from "../../config/cache";

import { MenuResponseDto, toMenuDto } from "../../types/menu";

import { checkIfUserAdminInRestaurant } from "../../shared/helper/restaurant.helper"

export const createMenu = async (restaurantId: number , userId: number):Promise<MenuResponseDto> => {

    await checkIfUserAdminInRestaurant(restaurantId, userId);

    const menu = await menuRepository.createMenu(restaurantId);

    cache.del(CacheKeys.restaurant(restaurantId));

    return toMenuDto(menu);

}
export const getMenus = async (restaurantId: number):Promise<MenuResponseDto[]> => {
    
    await findRestaurantById(restaurantId);

    const menus = await menuRepository.getMenus(restaurantId);    

    return menus.map(toMenuDto);
}

export const getMenu = async (restaurantId: number, menuId: number):Promise<MenuResponseDto> => {
    
    await findRestaurantById(restaurantId);

    const menu = await menuRepository.getMenu(restaurantId, menuId);
    if (!menu) {
        throw new MenuNotFoundException();
    }

    cache.del(CacheKeys.restaurant(restaurantId));

    return toMenuDto(menu);
}


export const deleteMenu = async (restaurantId: number, menuId: number, userId: number):Promise<void> => {
    
    await checkIfUserAdminInRestaurant(restaurantId, userId);
    
    const menu = await menuRepository.getMenu(restaurantId, menuId);
    if (!menu) {
        throw new MenuNotFoundException();
    }
  
    await menuRepository.deleteMenu(restaurantId, menuId);

    cache.del(CacheKeys.restaurant(restaurantId));

}

export const findMenuById = async (menuId: number) => {
    
    const menu = await menuRepository.findMenuById(menuId);
    if (!menu) {
        throw new MenuNotFoundException();
    }
}
