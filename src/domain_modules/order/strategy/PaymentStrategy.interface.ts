import { OrderRequest } from "../../../types/OrderRequest";

export interface PaymentStartegy {
    processPayment (request:OrderRequest): Promise<boolean>
}