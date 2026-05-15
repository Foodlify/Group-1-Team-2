import { asyncHandler } from "../../utils/asyncHandler";
import { Request, Response } from "express";
import * as customerServices from "./customer.services";
import { sendSucess } from "../../utils/response";
import { StatusCodes } from "http-status-codes";

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
    
 const customer = await customerServices.getCustomerByUserId(req.userId as number);

 sendSucess(res,{message:"Profile fetched successfully",statusCode:StatusCodes.OK,data:customer})
});