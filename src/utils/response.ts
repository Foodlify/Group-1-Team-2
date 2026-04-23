import { Response } from "express";
import { StatusCodes} from 'http-status-codes';

export const sendSucess = (
    res:Response,
    
   { message = 'Success',
    statusCode = StatusCodes.OK,
    data,
   }:{
         message?: string;
        statusCode?: number;
        data?: unknown;
    }={}
)=>{
    res.status(statusCode).json({status:'success' , message,data})
}

export const sendError = (
    res:Response,
    {
    message="Error" ,
    statusCode=StatusCodes.BAD_REQUEST,
    data,
   }
    :{message?:string,statusCode?:number,data?:unknown}={}) =>{
res.status(statusCode).json({status:'Error' , message,data})
}
