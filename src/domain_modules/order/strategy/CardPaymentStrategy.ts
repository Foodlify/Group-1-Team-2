import { OrderRequest } from "../../../types/OrderRequest";
import { PaymentStartegy } from "./PaymentStrategy.interface";

export class CardPaymentStrategy  implements PaymentStartegy{
    async processPayment(request: OrderRequest):Promise<boolean> {
         const success = true;
        console.log(`Processing card payment... ${success ? "Success" : "Failed"}`);
        return success;
    }
}