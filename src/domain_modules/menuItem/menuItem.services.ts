import * as menuItemRepository from "./menuItem.repository"
import { findMenuById } from "../menu/menu.services";
import { NoTAUTHORIZED } from "../../shared/exceptions/auth.exception";

import {findRestaurantById } from "../restaurant/restaurant.service";

import { MenuItemNotFoundException } from "../../shared/exceptions/MenuItem.exception";
import { UpdateMenuItem } from "../../types/menuItem";

export const createMenuItem = async(resturantId: number, menuId: number, itemName: string , price: number, stock: number, userId: number) => {

    await checkIfUserAdminInRestaurant(resturantId, userId)
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

    if(menuItems.length===0){
        throw new MenuItemNotFoundException(menuId);
    }

    return menuItems;

};

export const updateMenuItem = async (resturantId: number, userId: number, menuId: number, menuItemId: number , data: UpdateMenuItem) => {

    await checkIfUserAdminInRestaurant(resturantId, userId)

    await findMenuById(menuId);

    await getMenuItemById(menuItemId, menuId);

    const menuItem = await menuItemRepository.updateMenuItem(menuId, menuItemId, data);
   
    return menuItem;
    
};

export const deleteMenuItem = async (resturantId: number, userId: number, menuId: number, menuItemId: number) => {

    await checkIfUserAdminInRestaurant(resturantId, userId);

    await findMenuById(menuId);
    
    await getMenuItemById(menuItemId, menuId);

    await menuItemRepository.deleteMenuItem(menuId, menuItemId);

}

export const checkIfUserAdminInRestaurant = async(restaurantId: number, userId: number)=>{

    const restaurant = await findRestaurantById(restaurantId);

    const admins = restaurant.admins; 
    
    const isAdmin = admins.some(admin => admin.id === userId);

    if (!isAdmin) {
        throw new NoTAUTHORIZED();
    }
}


