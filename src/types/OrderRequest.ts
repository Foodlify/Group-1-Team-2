import { PaymentMethod } from "@prisma/client";
export interface OrderRequest {
    cartId: number;        
    userId: number;    
    restaurantId: number;  
    addressId: number;   
    phone: string;      
    notes?: string;        
    paymentMethod: PaymentMethod; 
}