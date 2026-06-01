import * as menuRepository from "./menu.repository";
import { MenuNotFoundException } from "../../shared/exceptions/menuexception";
import { findRestaurantById } from "../restaurant/restaurant.service"
export const createMenu = async (restaurantId: number) => {

    await findRestaurantById(restaurantId);

    const menu = await menuRepository.createMenu(restaurantId);

    return menu;
}
export const getMenus = async (restaurantId: number) => {
    
    await findRestaurantById(restaurantId);

    const menus = await menuRepository.getMenus(restaurantId);
    
        if (!menus) {
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


export const deleteMenu = async (restaurantId: number, menuId: number) => {
    
    await findRestaurantById(restaurantId);

    const menu = await menuRepository.getMenus(restaurantId);
    if (!menu.find((m) => m.id === menuId)) {
        throw new MenuNotFoundException();
    }
    await menuRepository.deleteMenu(restaurantId, menuId);
}