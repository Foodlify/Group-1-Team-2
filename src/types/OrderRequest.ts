import { PaymentMethod, Prisma } from "@prisma/client";
export interface OrderRequest {
    cartId: number;        
    userId: string;    
    addressId: number;   
    phone: string;      
    notes?: string;        
    paymentMethod: PaymentMethod; 
    tx?:Prisma.TransactionClient
}