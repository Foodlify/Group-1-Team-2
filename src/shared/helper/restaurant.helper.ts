import {findRestaurantById } from"../../domain_modules/restaurant/restaurant.service"
import { NoTAUTHORIZED } from "../exceptions/auth.exception"

export const checkIfUserAdminInRestaurant = async(restaurantId: number, userId: number)=>{

    const restaurant = await findRestaurantById(restaurantId);

    const admins = restaurant.admins; 
    
    const isAdmin = admins.some(admin => admin.id === userId);

    if (!isAdmin) {
        throw new NoTAUTHORIZED();
    }

}