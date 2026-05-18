import { asyncHandler } from "../../utils/asyncHandler";
import * as webHookService from "./webhook.services";
import { Request, Response } from "express";


import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const stripeWebhook = async (req: Request, res: Response) => {

  const sig = req.headers["stripe-signature"] as string;

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
    
  } catch (err) {
    console.error("Webhook signature verification failed.", err);
    return res.status(400).send(`Webhook Error: ${err }.`);
  }
  if (event.type === "checkout.session.completed") {
    await webHookService.handleCheckoutSessionCompleted(event.data.object);
  }
  else if (event.type === "checkout.session.async_payment_failed") {
    await webHookService.handleCheckoutSessionFailed(event.data.object);
  }


  return res.json({ received: true });
};