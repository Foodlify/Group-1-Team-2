import { loginService, signupService } from "./auth.services";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSucess } from "../../utils/response";
import { StatusCodes } from "http-status-codes";
import{Request,Response,NextFunction} from "express"
import { setAuthCookie } from "../../utils/authCookies";


export const signup = asyncHandler(async (req: Request, res: Response) => {
    const result = await signupService(req.body);
  
    setAuthCookie(res, result.token);

    sendSucess(res, { message: "User created successfully", data:{
        user: result.user},
        statusCode:StatusCodes.CREATED
    });  
});

export const login = asyncHandler(async(req:Request , res:Response)=>{
    const result = await loginService(req.body.email,req.body.password);
    setAuthCookie(res, result.token);

    sendSucess(res, { message: "User logged in successfully", data:{
        user: result.user},
        statusCode:StatusCodes.OK
    });
})