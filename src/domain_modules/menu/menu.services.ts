import * as menuRepository from "./menu.repository";
import { findRestaurantById } from "./menu.repository";
import { RestaurantNotFoundException } from "../../shared/exceptions/restaurant.exception";
export const createMenu = async (restaurantId: number) => {

    const restaurant = await findRestaurantById(restaurantId);
    if (!restaurant) {
        throw new RestaurantNotFoundException();
    }
    const menu = await menuRepository.createMenu(restaurantId);
    
    return menu;
}