// restaurant.service.ts
import { cache, CacheKeys } from "../../config/cache";
import { logger } from "../../config/logger";
import { NOTALLOWEDTOCREATEMORETHANONE, RestaurantNotFoundException } from "../../shared/exceptions/restaurant.exception";
import * as restaurantRepo from "./restaurant.repository";


export const getRestaurant = async (id: number) => {
    const cached = cache.get(CacheKeys.restaurant(id));
       if (cached) {
        logger.info("Cache hit" , {restaurantId:id});
        return cached;
    }

    logger.info("Cache miss - fetching from DB", { restaurantId: id });
    const restaurant = await restaurantRepo.getRestaurantById(id);
    if (!restaurant) throw new RestaurantNotFoundException();
    cache.set(CacheKeys.restaurant(id), restaurant);
    return restaurant;
}

export const createRestaurant = async ( name: string, userId: number) => {


    const userRestaurants = await restaurantRepo.getRestaurantsByUserId(userId);
    if (userRestaurants) {
        throw new NOTALLOWEDTOCREATEMORETHANONE();
    }
    const restaurant = await restaurantRepo.createRestaurant( name, userId );
    return restaurant;
};

export const updateRestaurant = async (id: number, data: any) => {
    const updated =  await restaurantRepo.updateRestaurant(id, data);

    cache.set(CacheKeys.restaurant(id), updated);

}

export const deleteRestaurant = async (id: number) => {
    await restaurantRepo.deleteRestaurant(id);
    cache.del(CacheKeys.restaurant(id));
}

export const findRestaurantById = async (id: number) => {
    const restaurant = await restaurantRepo.getRestaurantById(id);
    if (!restaurant) {
        throw new RestaurantNotFoundException();
    }

    return restaurant;
}

