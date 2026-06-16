import { Request, Response } from "express";
import * as restaurantService from "./restaurant.service";
import { StatusCodes } from "http-status-codes";
import { sendSucess } from "../../utils/response";
import { asyncHandler } from "../../utils/asyncHandler";
export const getRestaurant =asyncHandler( async (req: Request, res: Response) => {
    const { id } = req.params;
    const restaurant = await restaurantService.getRestaurant(Number(id));
    sendSucess(res,{message:"Restaurant fetched successfully",statusCode:StatusCodes.OK,data:restaurant})
})

export const createRestaurant = asyncHandler(async (req: Request, res: Response) => {
    const { name } = req.body;
    const userId = Number(req.userId); // Assuming you have user information in the request object

    const restaurant = await restaurantService.createRestaurant( name , userId);
    sendSucess(res,{message:"Restaurant created successfully",statusCode:StatusCodes.CREATED,data:restaurant})
});
export const updateRestraurant = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = req.body;
    const restaurant = await restaurantService.updateRestaurant(Number(id), data);
    sendSucess(res,{message:"Restaurant updated successfully",statusCode:StatusCodes.OK,data:restaurant})
});


export const deleteRestraurant = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const restaurant = await restaurantService.deleteRestaurant(Number(id));
    sendSucess(res,{message:"Restaurant deleted successfully",statusCode:StatusCodes.OK,data:restaurant})
});

