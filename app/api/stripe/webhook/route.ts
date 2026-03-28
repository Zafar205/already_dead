import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { confirmStripeCheckoutSession } from "@/lib/stripeCheckoutConfirmation";
import { getRequiredEnv } from "@/lib/env";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const stripe = getStripe();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const body = await request.text();
    event = stripe.webhooks.constructEvent(body, signature, getRequiredEnv("STRIPE_WEBHOOK_SECRET"));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid webhook signature";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (
    event.type === "checkout.session.completed" ||
    event.type === "checkout.session.async_payment_succeeded"
  ) {
    await confirmStripeCheckoutSession({
      source: "webhook",
      session: event.data.object as Stripe.Checkout.Session,
    });
  }

  return NextResponse.json({ received: true });
}
