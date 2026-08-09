import { Request, Response } from "express";
import * as restaurantService from "./restaurant.service";
import { StatusCodes } from "http-status-codes";
import { sendSucess } from "../../utils/response";
import { asyncHandler } from "../../utils/asyncHandler";
export const getRestaurant =asyncHandler( async (req: Request, res: Response) => {
    const  restaurantId  = Number(req.params.restaurantId);
    const restaurant = await restaurantService.getRestaurant(restaurantId);
    sendSucess(res,{message:"Restaurant fetched successfully",statusCode:StatusCodes.OK,data:restaurant})
})

export const createRestaurant = asyncHandler(async (req: Request, res: Response) => {
    const data = req.body;
    const userId = Number(req.userId); 

    const restaurant = await restaurantService.createRestaurant( data , userId);
    sendSucess(res,{message:"Restaurant created successfully",statusCode:StatusCodes.CREATED,data:restaurant})
});
export const updateRestraurant = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = req.body;
    const userId = Number(req.userId); 
    const restaurant = await restaurantService.updateRestaurant(Number(id), data, userId);
    sendSucess(res,{message:"Restaurant updated successfully",statusCode:StatusCodes.OK,data:restaurant})
});


export const deleteRestraurant = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = Number(req.userId); 
    const restaurant = await restaurantService.deleteRestaurant(Number(id),userId);
    sendSucess(res,{message:"Restaurant deleted successfully",statusCode:StatusCodes.OK,data:restaurant})
});

