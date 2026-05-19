import { OrderRequest } from "../../../types/OrderRequest";
import { OrderResponse } from "../../../types/OrderResponse";
import { PaymentStartegy } from "./PaymentStrategy.interface";
import Stripe  from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);


export class CardPaymentStrategy  implements PaymentStartegy{
    async processPayment(response: OrderResponse) : Promise<void> {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            success_url: `${process.env.SUCCESS_URL}`,
            cancel_url: `${process.env.CANCEL_URL}`,
            metadata: {
                orderId: response.orderId.toString()
            },
            line_items: response.orderItems.map(item => ({
                price_data: {
                    currency: 'egp',
                    product_data: {
                        name: item.itemName,
                    },
                    unit_amount: item.price * 100 
                },
                quantity: item.quantity
            }))
        });
        response.paymentUrl = session.url!;
        console.log("PAYMENT URL:", response.paymentUrl);
    }
}
