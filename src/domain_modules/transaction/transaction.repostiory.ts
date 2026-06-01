import prisma from "../../lib/prisma";
import { DBClient } from "../../types/PrismaClientOrTx";

export const createTransaction = async(data:any,client:DBClient = prisma)=>{
    return await prisma.transaction.create({data});
}