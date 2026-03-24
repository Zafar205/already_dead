import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getRequiredEnv } from "@/lib/env";
import { sendOrderPaidEmail } from "@/lib/mailer";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const supabase = getSupabaseAdmin();

  const orderId = session.metadata?.order_id;
  const stripePaymentIntentId =
    typeof session.payment_intent === "string" ? session.payment_intent : null;

  if (!orderId) {
    await supabase.from("order_events").insert({
      event_type: "checkout.session.completed_missing_order",
      payload: session,
    });
    return;
  }

  const { data: order, error: fetchError } = await supabase
    .from("orders")
    .select("id, customer_email, customer_name, product_title, total_amount")
    .eq("id", orderId)
    .single();

  if (fetchError || !order) {
    await supabase.from("order_events").insert({
      order_id: orderId,
      event_type: "checkout.session.completed_order_not_found",
      payload: session,
    });
    return;
  }

  await supabase
    .from("orders")
    .update({
      status: "paid",
      paid_at: new Date().toISOString(),
      stripe_payment_intent_id: stripePaymentIntentId,
    })
    .eq("id", order.id);

  try {
    await sendOrderPaidEmail({
      to: order.customer_email,
      customerName: order.customer_name,
      productTitle: order.product_title,
      amountInCents: order.total_amount,
      orderId: order.id,
      siteUrl: getSiteUrl(),
    });

    await supabase.from("order_events").insert({
      order_id: order.id,
      event_type: "email.order_paid.sent",
      payload: {
        customer_email: order.customer_email,
      },
    });
  } catch (emailError) {
    await supabase.from("order_events").insert({
      order_id: order.id,
      event_type: "email.order_paid.failed",
      payload: {
        error: emailError instanceof Error ? emailError.message : "Unknown email error",
      },
    });
  }
}

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
    await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
  }

  return NextResponse.json({ received: true });
}
