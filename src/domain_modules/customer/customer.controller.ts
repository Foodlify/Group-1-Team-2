import { asyncHandler } from "../../utils/asyncHandler";
import { Request, Response } from "express";
import * as customerServices from "./customer.services";
import { sendSucess } from "../../utils/response";
import { StatusCodes } from "http-status-codes";

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
    
 const customer = await customerServices.getCustomerByUserId(req.userId as number);

 sendSucess(res,{message:"Profile fetched successfully",statusCode:StatusCodes.OK,data:customer})
});

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId as number;

    const updatedCustomer = await customerServices.updateCustomerProfile(userId, { name: req.body.name, email: req.body.email, phone: req.body.phone });
    sendSucess(res,{message:"Profile updated successfully",statusCode:StatusCodes.OK,data:updatedCustomer})
});