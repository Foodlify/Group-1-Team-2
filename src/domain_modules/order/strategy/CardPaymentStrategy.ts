import { OrderRequest } from "../../../types/OrderRequest";
import { OrderResponse } from "../../../types/OrderResponse";
import { PaymentStartegy } from "./PaymentStrategy.interface";
import Stripe  from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);


export class CardPaymentStrategy  implements PaymentStartegy{
    async processPayment(Response: OrderResponse):Promise<void> {
        const success = true;
        console.log(`Processing card payment... ${success ? "Success" : "Failed"}`);
    }
}
