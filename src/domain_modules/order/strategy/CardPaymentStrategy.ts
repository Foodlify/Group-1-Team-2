import { OrderRequest } from "../../../types/OrderRequest";
import { PaymentStartegy } from "./PaymentStrategy.interface";

export class CardPaymentStrategy  implements PaymentStartegy{
    async processPayment(request: OrderRequest):Promise<boolean> {
         const success = Math.random() > 0.5;
        console.log(`Processing card payment... ${success ? "Success" : "Failed"}`);
        return success;
    }
}