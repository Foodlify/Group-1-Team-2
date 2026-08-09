import { getRestaurant,createRestaurant,updateRestaurant,deleteRestaurant } from "../restaurant.service";
import * as restaurantRepo from "../restaurant.repository";
import { RestaurantNotFoundException, NOTALLOWEDTOCREATEMORETHANONE } from "../../../shared/exceptions/restaurant.exception"
import { toRestaurantDto } from "../../../types/restaurant";
import { checkIfUserAdminInRestaurant } from "../../../shared/helper/restaurant.helper";

import { NoTAUTHORIZED } from "../../../shared/exceptions/auth.exception"
import { cache, CacheKeys } from "../../../config/cache";
import { logger } from "../../../config/logger";


jest.mock("../restaurant.repository");
jest.mock("../../../config/cache", () => ({
    cache: {
        get: jest.fn(),
        set: jest.fn(),
        del: jest.fn(),
    },
    CacheKeys: {
        restaurant: (id: number) => `restaurant:${id}`,
    },
}));
jest.mock("../../../types/restaurant");
jest.mock("../../../config/logger");
jest.mock("../../../shared/helper/restaurant.helper")
jest.mock("../../../types/restaurant", () => ({
    toRestaurantDto: jest.fn(),
}));


describe('restaurantService - getRestaurant',()=>{
    const restaurantId = 1;

     const mockRestaurant = {

         id: 1,
         name: "KFC",
         menus: [

             {
                 id: 1,
                 name: "Main Menu",
                 menuItems: [
                     {
                         id: 1,
                         name: "Burger",
                         price: 100,
                     },
                 ],
             },
         ],
     };

     const mockDto = {
      id: 1,
      name: "KFC",
      menus: [],
    };


    beforeEach(() => {
        jest.clearAllMocks();
    }); 

    it("should return restaurant from cache when cache hit", async () => {

    (cache.get as jest.Mock).mockReturnValue(mockDto);

    const result = await getRestaurant(restaurantId);

    expect(cache.get).toHaveBeenCalled();

    expect(result).toEqual(mockDto);

    expect(restaurantRepo.getRestaurantById).not.toHaveBeenCalled();

    expect(toRestaurantDto).not.toHaveBeenCalled();


    });

    it("should fetch restaurant from DB when cache miss",async()=>{

    (cache.get as jest.Mock).mockReturnValue(undefined);


    (restaurantRepo.getRestaurantById as jest.Mock).mockResolvedValue(mockRestaurant);

    (toRestaurantDto as jest.Mock).mockReturnValue(mockDto);

    const result = await getRestaurant(restaurantId);

    expect(cache.get).toHaveBeenCalled();

    expect(restaurantRepo.getRestaurantById).toHaveBeenCalledWith(restaurantId);

    expect(toRestaurantDto).toHaveBeenCalledWith(mockRestaurant);


    expect(cache.set).toHaveBeenCalled();

    expect(result).toEqual(mockDto);
    })

    it("should throw RestaurantNotFoundException when restaurant does not exist",async()=>{

    (cache.get as jest.Mock).mockReturnValue(undefined);

    (restaurantRepo.getRestaurantById as jest.Mock).mockResolvedValue(null);

    await expect(getRestaurant(restaurantId)).rejects.toThrow(RestaurantNotFoundException);

    expect(cache.get).toHaveBeenCalled();

    expect(restaurantRepo.getRestaurantById).toHaveBeenCalledWith(restaurantId);

    expect(toRestaurantDto).not.toHaveBeenCalled();

    expect(cache.set).not.toHaveBeenCalled();

    })
    
})

describe("restaurantService - createRestaurant",()=>{
    const userId = 10;
    const createRestaurantData = {
        name: "KFC",
    };

    const mockRestaurant = {
        id: 1,
        name: "KFC",
        menus: [],
    };

    const mockDto = {
        id: 1,
        name: "KFC",
        menus: [],
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should create restaurant successfully", async () => {

        (restaurantRepo.getRestaurantsByUserId as jest.Mock).mockResolvedValue(null); 

        (restaurantRepo.createRestaurant as jest.Mock).mockResolvedValue(mockRestaurant);

        (toRestaurantDto as jest.Mock).mockReturnValue(mockDto); 

        const result = await createRestaurant(createRestaurantData, userId);

        expect(restaurantRepo.getRestaurantsByUserId).toHaveBeenCalledWith(userId);

        expect(restaurantRepo.createRestaurant).toHaveBeenCalledWith(createRestaurantData, userId);

        expect(toRestaurantDto).toHaveBeenCalledWith(mockRestaurant);

        expect(cache.set).toHaveBeenCalled();
        
        expect(result).toEqual(mockDto);

    });

    it("should throw NOTALLOWEDTOCREATEMORETHANONE when user already owns a restaurant", async () => {

        (restaurantRepo.getRestaurantsByUserId as jest.Mock).mockResolvedValue(mockRestaurant); 

        await expect(createRestaurant(createRestaurantData, userId)).rejects.toThrow(NOTALLOWEDTOCREATEMORETHANONE);
        
        expect(restaurantRepo.getRestaurantsByUserId).toHaveBeenCalledWith(userId);

        expect(restaurantRepo.createRestaurant).not.toHaveBeenCalled();

        expect(toRestaurantDto).not.toHaveBeenCalled();

        expect(cache.set).not.toHaveBeenCalled();

    })

})

describe("restaurantService - updateRestaurant", () => {

    const userId = 10;
    const restaurantId = 1;

    const upateRestaurantData = {
        name: "KFC updated",
    };

    const mockRestaurant = {
        id: 1,
        name: "KFC",
        menus: [],
    };

    const mockDto = {
        id: 1,
        name: "KFC",
        menus: [],
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should update restaurant successfully", async () => {

        (checkIfUserAdminInRestaurant as jest.Mock).mockResolvedValue(undefined);

        (restaurantRepo.updateRestaurant as jest.Mock).mockResolvedValue(mockRestaurant);

        (toRestaurantDto as jest.Mock).mockReturnValue(mockDto);

        const result = await updateRestaurant(restaurantId, upateRestaurantData, userId);

        expect(checkIfUserAdminInRestaurant).toHaveBeenCalledWith(restaurantId, userId);

        expect(restaurantRepo.updateRestaurant).toHaveBeenCalledWith( restaurantId, upateRestaurantData);

        expect(toRestaurantDto).toHaveBeenCalledWith(mockRestaurant);

        expect(cache.set).toHaveBeenCalled();

        expect(logger.info).toHaveBeenCalledWith("Restaurant updated, cache refreshed",{ restaurantId });

        expect(result).toEqual(mockDto);

    });

    it("should throw NoTAUTHORIZED when user is not admin", async () => {

        (checkIfUserAdminInRestaurant as jest.Mock).mockRejectedValue(new NoTAUTHORIZED());

        await expect(updateRestaurant(restaurantId,upateRestaurantData,userId)).rejects.toThrow(NoTAUTHORIZED);

        expect(checkIfUserAdminInRestaurant).toHaveBeenCalledWith(restaurantId, userId);

        expect(restaurantRepo.updateRestaurant).not.toHaveBeenCalled();

        expect(toRestaurantDto).not.toHaveBeenCalled();

        expect(cache.set).not.toHaveBeenCalled();

        expect(logger.info).not.toHaveBeenCalled();

    });

});

describe("restaurantService - deleteRestaurant", () => {

    const restaurantId = 1;
    const userId = 10;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should delete restaurant successfully", async () => {

        (checkIfUserAdminInRestaurant as jest.Mock).mockResolvedValue(undefined);

        (restaurantRepo.deleteRestaurantCascade as jest.Mock).mockResolvedValue(undefined);

        await deleteRestaurant(restaurantId, userId);

        expect(checkIfUserAdminInRestaurant).toHaveBeenCalledWith(restaurantId, userId);

        expect(restaurantRepo.deleteRestaurantCascade).toHaveBeenCalledWith(restaurantId);

        expect(cache.del).toHaveBeenCalledWith(`restaurant:${restaurantId}`);
    });

    it("should throw NoTAUTHORIZED when user is not admin", async () => {

        (checkIfUserAdminInRestaurant as jest.Mock).mockRejectedValue(new NoTAUTHORIZED());

        await expect(deleteRestaurant(restaurantId, userId)).rejects.toThrow(NoTAUTHORIZED);

        expect(checkIfUserAdminInRestaurant).toHaveBeenCalledWith(restaurantId, userId);

        expect(restaurantRepo.deleteRestaurantCascade).not.toHaveBeenCalled();

        expect(cache.del).not.toHaveBeenCalled();
    }); 

});