import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { sendSucess } from "../../utils/response";
import { asyncHandler } from "../../utils/asyncHandler";
import * as menuService from "./menu.services";

export const createMenu = asyncHandler(async (req: Request, res: Response) => {
  const restaurantId = Number(req.params.restaurantId);
  const menu = await menuService.createMenu(restaurantId);

  sendSucess(res, {
    message: "Menu created successfully",
    statusCode: StatusCodes.CREATED,
    data: menu,
  });
});

export const getMenus = asyncHandler(async (req: Request, res: Response) => {
    const restaurantId = Number(req.params.restaurantId);
    const menus = await menuService.getMenus(restaurantId);

    sendSucess(res, {
      message: "Menus retrieved successfully",
      statusCode: StatusCodes.OK,
      data: menus,
    });

});

export const getMenu = asyncHandler(async (req: Request, res: Response) => {
    const restaurantId = Number(req.params.restaurantId);
    const menuId = Number(req.params.menuId);
    const menu = await menuService.getMenu(restaurantId, menuId);

    sendSucess(res, {
      message: "Menu retrieved successfully",
      statusCode: StatusCodes.OK,
      data: menu,
    });
});

export const deleteMenu = asyncHandler(async (req: Request, res: Response) => {
    const restaurantId = Number(req.params.restaurantId);
    const menuId = Number(req.params.menuId);
    await menuService.deleteMenu(restaurantId, menuId);
    sendSucess(res, {
      message: "Menu deleted successfully",
      statusCode: StatusCodes.OK,
    });
});