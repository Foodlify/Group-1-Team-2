import * as authServices from "./auth.services";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSucess } from "../../utils/response";
import { StatusCodes } from "http-status-codes";
import{Request,Response,NextFunction} from "express"
import { setAuthCookie } from "../../utils/authCookies";

export const signup = asyncHandler(async (req: Request, res: Response) => {
    const result = await authServices.signupService(req.body);

    setAuthCookie(res, result.token);

    sendSucess(res, { message: "User created successfully", data:{
        user: result.user},
        statusCode:StatusCodes.CREATED
    });  
});

export const login = asyncHandler(async(req:Request , res:Response)=>{
    const result = await authServices.loginService(req.body.email,req.body.password);
    setAuthCookie(res, result.token);

    sendSucess(res, { message: "User logged in successfully", data:{
        user: result.user},
        statusCode:StatusCodes.OK
    });
})

export const forgetPassword = asyncHandler(async (req: any, res: any) => {
    const { email } = req.body;
    await authServices.forgetPassword(email);
    sendSucess(res, { message: "OTP sent to email successfully", statusCode:StatusCodes.OK });
});

export const resetPassword = asyncHandler(async (req: any, res: any) => {
    const {email, otp, newPassword} = req.body;
    await authServices.resetPassword(email, otp, newPassword);
    sendSucess(res, { message: "Password reset successfully", statusCode:StatusCodes.OK });
});
