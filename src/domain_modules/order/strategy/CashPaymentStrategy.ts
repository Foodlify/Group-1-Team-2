import { OrderResponse } from "../../../types/OrderResponse";
import { PaymentStartegy } from "./PaymentStrategy.interface";

export class CashPaymentStrategy  implements PaymentStartegy{
    async processPayment(Response: OrderResponse):Promise<void> {
        const success = true;
        console.log(`Processing cash payment... ${success ? "Success" : "Failed"}`);
    }
}