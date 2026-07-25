import { getMenu, getMenus, createMenu, deleteMenu } from "../menu.services";
import * as menuRepository from "../menu.repository";
import { findRestaurantById } from "../../restaurant/restaurant.service";
import { checkIfUserAdminInRestaurant } from "../../../shared/helper/restaurant.helper";
import { cache, CacheKeys } from "../../../config/cache";
import { MenuNotFoundException } from "../../../shared/exceptions/menuexception";
import { toMenuDto } from "../../../types/menu";
import { NoTAUTHORIZED } from "../../../shared/exceptions/auth.exception"

jest.mock("../menu.repository");
jest.mock("../../restaurant/restaurant.service");
jest.mock("../../../config/cache");
jest.mock("../../../shared/helper/restaurant.helper")

jest.mock("../../../types/menu", () => ({
    toMenuDto: jest.fn(),
}));

describe("menuService - getMenu", () => {
    const restaurantId = 1;
    const menuId = 10;

    const mockMenu = {
        id: menuId,
        restaurantId,
        menuItems: [],
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return menu successfully", async () => {
        (findRestaurantById as jest.Mock).mockResolvedValue(true);
        (menuRepository.getMenu as jest.Mock).mockResolvedValue(mockMenu);

        (toMenuDto as jest.Mock).mockImplementation((menu) => menu);

        const result = await getMenu(restaurantId, menuId);

        expect(findRestaurantById).toHaveBeenCalledWith(restaurantId);
        expect(menuRepository.getMenu).toHaveBeenCalledWith(restaurantId, menuId);

        expect(cache.del).toHaveBeenCalledWith(
            CacheKeys.restaurant(restaurantId)
        );

        expect(result).toBeDefined();
        expect(result.id).toBe(menuId);
    });

    it("should throw MenuNotFoundException if menu not found", async () => {
        (findRestaurantById as jest.Mock).mockResolvedValue(true);
        (menuRepository.getMenu as jest.Mock).mockResolvedValue(null);

        await expect(
            getMenu(restaurantId, menuId)
        ).rejects.toThrow(MenuNotFoundException);

        expect(cache.del).not.toHaveBeenCalled();
    });

    it("should throw error if restaurant not found", async () => {
        (findRestaurantById as jest.Mock).mockRejectedValue(
            new Error("Restaurant not found")
        );

        await expect(
            getMenu(restaurantId, menuId)
        ).rejects.toThrow("Restaurant not found");

        expect(menuRepository.getMenu).not.toHaveBeenCalled();
    });
});


describe("menuService - getMenus", () => {
    const restaurantId = 1;

    const mockMenus = [
        {
            id: 1,
            restaurantId,
            menuItems: [],
        },
        {
            id: 2,
            restaurantId,
            menuItems: [],
        },
        {
            id: 3,
            restaurantId,
            menuItems: [],
        },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return all menus successfully", async () => {
        (findRestaurantById as jest.Mock).mockResolvedValue(true);
        (menuRepository.getMenus as jest.Mock).mockResolvedValue(mockMenus);

        (toMenuDto as jest.Mock).mockImplementation((menu) => menu);

        const result = await getMenus(restaurantId);

        expect(findRestaurantById).toHaveBeenCalledWith(restaurantId);
        expect(menuRepository.getMenus).toHaveBeenCalledWith(restaurantId);

        expect(result).toBeDefined();
        expect(result).toHaveLength(3);
        expect(result).toEqual(mockMenus);
    });

    it("should return empty array if no menus found", async () => {
        (findRestaurantById as jest.Mock).mockResolvedValue(true);
        (menuRepository.getMenus as jest.Mock).mockResolvedValue([]);

        (toMenuDto as jest.Mock).mockImplementation((menu) => menu);

        const result = await getMenus(restaurantId);

        expect(findRestaurantById).toHaveBeenCalledWith(restaurantId);
        expect(menuRepository.getMenus).toHaveBeenCalledWith(restaurantId);

        expect(result).toBeDefined();
        expect(result).toHaveLength(0);
        expect(result).toEqual([]);
    });

    it("should throw error if restaurant not found", async () => {
        (findRestaurantById as jest.Mock).mockRejectedValue(
            new Error("Restaurant not found")
        );

        await expect(
            getMenus(restaurantId)
        ).rejects.toThrow("Restaurant not found");

        expect(menuRepository.getMenus).not.toHaveBeenCalled();
    });

    it("should map menus using toMenuDto", async () => {
        const mockMenusDto = [
            { id: 1, restaurantId, name: "Menu 1" },
            { id: 2, restaurantId, name: "Menu 2" },
        ];

        const slicedMenus = mockMenus.slice(0, 2);

        (findRestaurantById as jest.Mock).mockResolvedValue(true);
        (menuRepository.getMenus as jest.Mock).mockResolvedValue(slicedMenus);

        (toMenuDto as jest.Mock)
            .mockReturnValueOnce(mockMenusDto[0])
            .mockReturnValueOnce(mockMenusDto[1]);

        const result = await getMenus(restaurantId);

        expect(toMenuDto).toHaveBeenCalledTimes(2);

        expect(toMenuDto).toHaveBeenNthCalledWith(
            1,
            slicedMenus[0],
            0,
            slicedMenus
        );

        expect(toMenuDto).toHaveBeenNthCalledWith(
            2,
            slicedMenus[1],
            1,
            slicedMenus
        );

        expect(result).toEqual(mockMenusDto);
    });
});

describe("menuService - createMenu",()=>{

    const restaurantId = 1;
    const userId = 10;

    const mockMenu = {
        id: 1,
        restaurantId: 1,
        menuItems: [],
    };

    const mockDto = {
        id: 1,
        menuItems: [],
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should create menu successfully", async () => {

        (checkIfUserAdminInRestaurant as jest.Mock).mockResolvedValue(undefined);

        (menuRepository.createMenu as jest.Mock).mockResolvedValue(mockMenu);

        (toMenuDto as jest.Mock).mockReturnValue(mockDto);

        const result = await createMenu(restaurantId, userId);

        expect(checkIfUserAdminInRestaurant).toHaveBeenCalledWith(restaurantId, userId);

        expect(menuRepository.createMenu).toHaveBeenCalledWith(restaurantId);

        expect(cache.del).toHaveBeenCalledWith(CacheKeys.restaurant(restaurantId));

        expect(toMenuDto).toHaveBeenCalledWith(mockMenu);

        expect(result).toEqual(mockDto);

    });

    it("should throw NoTAUTHORIZED when user is not admin", async () => {

        (checkIfUserAdminInRestaurant as jest.Mock).mockRejectedValue(new NoTAUTHORIZED());

        await expect(createMenu(restaurantId, userId)).rejects.toThrow(NoTAUTHORIZED);

        expect(checkIfUserAdminInRestaurant).toHaveBeenCalledWith(restaurantId, userId);

        expect(menuRepository.createMenu).not.toHaveBeenCalled();

        expect(cache.del).not.toHaveBeenCalled();

        expect(toMenuDto).not.toHaveBeenCalled();

    });

})

describe("menuService - deleteMenu", () => {

    const restaurantId = 1;
    const menuId = 2;
    const userId = 10;

    const mockMenu = {
        id: menuId,
        restaurantId,
        menuItems: [],
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should delete menu successfully", async () => {

        (checkIfUserAdminInRestaurant as jest.Mock).mockResolvedValue(undefined);

        (menuRepository.getMenu as jest.Mock).mockResolvedValue(mockMenu);

        (menuRepository.deleteMenu as jest.Mock).mockResolvedValue(undefined);

        await deleteMenu(restaurantId, menuId, userId);

        expect(checkIfUserAdminInRestaurant).toHaveBeenCalledWith(restaurantId, userId);

        expect(menuRepository.getMenu).toHaveBeenCalledWith(restaurantId, menuId);

        expect(menuRepository.deleteMenu).toHaveBeenCalledWith(restaurantId, menuId);

        expect(cache.del).toHaveBeenCalledWith(CacheKeys.restaurant(restaurantId));

    });

    it("should throw NoTAUTHORIZED when user is not admin", async () => {

        (checkIfUserAdminInRestaurant as jest.Mock).mockRejectedValue(new NoTAUTHORIZED());

        await expect(deleteMenu(restaurantId, menuId, userId)).rejects.toThrow(NoTAUTHORIZED);

        expect(checkIfUserAdminInRestaurant).toHaveBeenCalledWith(restaurantId, userId);

        expect(menuRepository.getMenu).not.toHaveBeenCalled();

        expect(menuRepository.deleteMenu).not.toHaveBeenCalled();

        expect(cache.del).not.toHaveBeenCalled();

    });

    it("should throw MenuNotFoundException when menu does not exist", async () => {

        (checkIfUserAdminInRestaurant as jest.Mock).mockResolvedValue(undefined);

        (menuRepository.getMenu as jest.Mock).mockResolvedValue(null);

        await expect(deleteMenu(restaurantId, menuId, userId)).rejects.toThrow(MenuNotFoundException);

        expect(checkIfUserAdminInRestaurant).toHaveBeenCalledWith(restaurantId, userId);

        expect(menuRepository.getMenu).toHaveBeenCalledWith(restaurantId, menuId);

        expect(menuRepository.deleteMenu).not.toHaveBeenCalled();

        expect(cache.del).not.toHaveBeenCalled();

    });

});