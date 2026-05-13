import { OrderResponse } from "../../../types/OrderResponse";
import { PaymentStartegy } from "./PaymentStrategy.interface";

export class CashPaymentStrategy  implements PaymentStartegy{
    async processPayment(Response: OrderResponse):Promise<boolean> {
        const success = Math.random() > 0.5;
        console.log(`Processing cash payment... ${success ? "Success" : "Failed"}`);
        return success;
    }
}