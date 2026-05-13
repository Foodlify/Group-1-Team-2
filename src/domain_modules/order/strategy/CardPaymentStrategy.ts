import { OrderRequest } from "../../../types/OrderRequest";
import { OrderResponse } from "../../../types/OrderResponse";
import { PaymentStartegy } from "./PaymentStrategy.interface";
import Stripe  from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export class CardPaymentStrategy  implements PaymentStartegy{
    async processPayment(res: OrderResponse):Promise<boolean> {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: res.totalPrice as any * 3000,
            currency: "egp",
            automatic_payment_methods: { enabled: true, allow_redirects: "never" },
    });
            console.log(res.totalPrice as any * 3000)
            console.log("Payment Intent Created:", paymentIntent.id);
            return true;

 } 
}
