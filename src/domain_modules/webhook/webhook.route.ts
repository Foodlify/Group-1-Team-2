import  { Router }  from "express";
import * as webhookController from "./webhook.controller";
import express from "express";

const router = Router();

router.post("/webhook", express.raw({ type: "application/json" }), webhookController.stripeWebhook);

export default router;