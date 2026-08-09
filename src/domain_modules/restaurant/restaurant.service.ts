// restaurant.service.ts
import { cache, CacheKeys } from "../../config/cache";
import { logger } from "../../config/logger";
import { NOTALLOWEDTOCREATEMORETHANONE, RestaurantNotFoundException } from "../../shared/exceptions/restaurant.exception";
import * as restaurantRepo from "./restaurant.repository";
import { RestaurantResponseDto, toRestaurantDto, createRestaurantDto, updateRestaurantDto } from "../../types/restaurant";
import {checkIfUserAdminInRestaurant} from "../../shared/helper/restaurant.helper"



export const getRestaurant = async (restaurantId: number):Promise<RestaurantResponseDto> => {
    const cached = cache.get(CacheKeys.restaurant(restaurantId)) as RestaurantResponseDto | undefined;;
       if (cached) {
        logger.info("Cache hit" , {restaurantId:restaurantId});
        return cached;
    }

    logger.info("Cache miss - fetching from DB", { restaurantId });
    const restaurant = await restaurantRepo.getRestaurantById(restaurantId);
    if (!restaurant) throw new RestaurantNotFoundException();
    const dto = toRestaurantDto(restaurant)
    cache.set(CacheKeys.restaurant(restaurantId), dto);
    return dto;
}

export const createRestaurant = async ( data:createRestaurantDto, userId: number):Promise<RestaurantResponseDto>  => {

    const userRestaurants = await restaurantRepo.getRestaurantsByUserId(userId);
    if (userRestaurants) {
        throw new NOTALLOWEDTOCREATEMORETHANONE();
    }
    const restaurant = await restaurantRepo.createRestaurant(data, userId);
    const dto = toRestaurantDto(restaurant);

    cache.set(CacheKeys.restaurant(dto.id), dto);
    return dto;
};

export const updateRestaurant = async (restaurantId: number, data: updateRestaurantDto,userId: number): Promise<RestaurantResponseDto> => {

    await checkIfUserAdminInRestaurant(restaurantId, userId);
    
    const updated = await restaurantRepo.updateRestaurant(restaurantId, data);
    const dto = toRestaurantDto(updated);

    cache.set(CacheKeys.restaurant(restaurantId), dto);
    logger.info("Restaurant updated, cache refreshed", { restaurantId });

    return dto;
}

export const deleteRestaurant = async (restaurantId: number , userId: number ) => {
    
    await checkIfUserAdminInRestaurant(restaurantId, userId);

    await restaurantRepo.deleteRestaurantCascade(restaurantId);
    cache.del(CacheKeys.restaurant(restaurantId));
}

export const findRestaurantById = async (restaurantId: number) => {
    const restaurant = await restaurantRepo.getRestaurantWithAdmins(restaurantId);
    if (!restaurant) {
        throw new RestaurantNotFoundException();
    }
    return restaurant;
}


