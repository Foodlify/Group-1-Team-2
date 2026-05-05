import prisma from "../../lib/prisma"

   export const getCustomerByUserId = async(userId:number)=>{
     return await prisma.customer.findUnique({where:{userId}})
    }
   