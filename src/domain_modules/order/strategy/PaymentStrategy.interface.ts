import { OrderResponse } from "../../../types/OrderResponse";

export interface PaymentStartegy {
    processPayment (response:OrderResponse): Promise<boolean>
}