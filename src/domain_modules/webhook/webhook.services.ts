import * as webhookRepository from "./webhook.repository";

export const handleCheckoutSessionCompleted = async (session: any) => {
    const orderId = session.metadata.orderId;
    await webhookRepository.markOrderAsPaid(orderId);
}

export const handleCheckoutSessionFailed = async (session: any) => {
    const orderId = session.metadata.orderId;
    await webhookRepository.markOrderAsPaymentFailed(orderId);
    console.log(`Order ${orderId} marked as payment failed.`);
}
