import { signupService } from "./auth.services";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSucess } from "../../utils/response";
import { StatusCodes } from "http-status-codes";

export const signup = asyncHandler(async (req: any, res: any) => {
    const result = await signupService(req.body);
    sendSucess(res, { message: "User created successfully", data:{
        user: result.user, token: result.token},
        statusCode:StatusCodes.CREATED
    });  
});