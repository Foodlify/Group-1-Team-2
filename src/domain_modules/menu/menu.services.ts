import * as menuRepository from "./menu.repository";
import { findRestaurantById } from "./menu.repository";
import { RestaurantNotFoundException } from "../../shared/exceptions/restaurant.exception";
import { MenuNotFoundException } from "../../shared/exceptions/menuexception";
export const createMenu = async (restaurantId: number) => {

    const restaurant = await findRestaurantById(restaurantId);
    if (!restaurant) {
        throw new RestaurantNotFoundException();
    }
    const menu = await menuRepository.createMenu(restaurantId);
    
    return menu;
}
export const getMenus = async (restaurantId: number) => {
    const restaurant = await findRestaurantById(restaurantId);
    if (!restaurant) {
        throw new RestaurantNotFoundException();
    }
    const menus = await menuRepository.getMenus(restaurantId);
    return menus;
}
export const deleteMenu = async (restaurantId: number, menuId: number) => {
    const restaurant = await findRestaurantById(restaurantId);
    if (!restaurant) {
        throw new RestaurantNotFoundException();
    }
    const menu = await menuRepository.getMenus(restaurantId);
    if (!menu.find((m) => m.id === menuId)) {
        throw new MenuNotFoundException();
    }
    await menuRepository.deleteMenu(restaurantId, menuId);
}