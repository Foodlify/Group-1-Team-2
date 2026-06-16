import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { sendSucess } from "../../utils/response";
import { asyncHandler } from "../../utils/asyncHandler";
import * as menuItemService from "./menuItem.services";
import { UpdateMenuItem } from "../../types/menuItem";



export const createMenuItem = asyncHandler(async (req: Request, res: Response) => {

  const  menuId  = Number(req.params.menuId);
  const { itemName, price, stock} = req.body
  const resturantId = Number(req.params.restaurantId)
  const userId = Number(req.userId)

  console.log(resturantId)


  const menuItem = await menuItemService.createMenuItem(resturantId, menuId, itemName, price, stock, userId );

  sendSucess(res, {
    message: "Menu item created successfully",
    statusCode: StatusCodes.CREATED,
    data: menuItem,
  });
});

export const updateMenuItem = asyncHandler(async (req: Request, res: Response) => {

  const menuId = Number(req.params.menuId);
  const menuItemId = Number(req.params.menuItemId);
  const data: UpdateMenuItem = req.body;

  const resturantId = Number(req.params.restaurantId)
  const userId = Number(req.userId)



  const menuItem = await menuItemService.updateMenuItem(resturantId, userId,menuId, menuItemId, data);

  sendSucess(res, {
      message: "Menu item updated successfully",
      statusCode: StatusCodes.OK,
      data: menuItem,
    });
});

export const getMenuItemById = asyncHandler(async (req: Request, res: Response) => {

  const menuItemId = Number(req.params.menuItemId);
  const menuId = Number(req.params.menuId);
  const menuItem = await menuItemService.getMenuItemById(menuItemId, menuId);

    sendSucess(res, {
      message: "Menu item retrieved successfully",
      statusCode: StatusCodes.OK,
      data: menuItem,
    });
});

export const getMenuItemsByMenuId = asyncHandler(async (req: Request, res: Response) => {

  const menuId = Number(req.params.menuId);
  const menuItems = await menuItemService.getMenuItemsByMenuId(menuId);

    sendSucess(res, {
      message: "Menu items retrieved successfully",
      statusCode: StatusCodes.OK,
      data: menuItems,
    });
});

export const deleteMenuItem = asyncHandler(async (req: Request, res: Response) => {
  
  const menuId = Number(req.params.menuId);
  const menuItemId = Number(req.params.menuItemId);
  const resturantId = Number(req.params.restaurantId)
  const userId = Number(req.userId)

  
  await menuItemService.deleteMenuItem(resturantId, userId ,menuId, menuItemId);

  sendSucess(res, {
    message: "Menu item deleted successfully",
    statusCode: StatusCodes.OK,
  });
});