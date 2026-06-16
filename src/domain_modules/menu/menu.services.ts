import * as menuRepository from "./menu.repository";
import { MenuNotFoundException } from "../../shared/exceptions/menuexception";
import { findRestaurantById } from "../restaurant/restaurant.service";
import { NoTAUTHORIZED } from "../../shared/exceptions/auth.exception";

import { MenuResponseDto, toMenuDto } from "../../types/menu";
import { promises } from "dns";

export const createMenu = async (restaurantId: number , userId: number)  => {

    await checkIfUserAdminInRestaurant(restaurantId, userId);

    const menu = await menuRepository.createMenu(restaurantId);

    return menu;
}
export const getMenus = async (restaurantId: number) => {
    
    await findRestaurantById(restaurantId);


    const menus = await menuRepository.getMenus(restaurantId);
    
    if (menus.length === 0) {
    throw new MenuNotFoundException();
    }

    
    return menus;
}

export const getMenu = async (restaurantId: number, menuId: number) => {
    
    await findRestaurantById(restaurantId);

    const menu = await menuRepository.getMenu(restaurantId, menuId);
    if (!menu) {
        throw new MenuNotFoundException();
    }
    return menu;
}


export const deleteMenu = async (restaurantId: number, menuId: number, userId: number) => {
    
    await checkIfUserAdminInRestaurant(restaurantId, userId);
    
    const menu = await menuRepository.getMenu(restaurantId, menuId);
    if (!menu) {
        throw new MenuNotFoundException();
    }
  
    await menuRepository.deleteMenu(restaurantId, menuId);
}

export const findMenuById = async (menuId: number) => {
    
    const menu = await menuRepository.findMenuById(menuId);
    if (!menu) {
        throw new MenuNotFoundException();
    }
}

export const checkIfUserAdminInRestaurant = async(restaurantId: number, userId: number)=>{

    const restaurant = await findRestaurantById(restaurantId);

    const admins = restaurant.admins; 
    
    const isAdmin = admins.some(admin => admin.id === userId);

    if (!isAdmin) {
        throw new NoTAUTHORIZED();
    }

}