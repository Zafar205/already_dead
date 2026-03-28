import type Stripe from "stripe";
import { sendOrderPaidEmail } from "@/lib/mailer";
import { getStripe } from "@/lib/stripe";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

type ConfirmStripeCheckoutSessionInput = {
  source: "webhook" | "success_redirect";
  sessionId?: string;
  session?: Stripe.Checkout.Session;
  expectedOrderId?: string;
};

export type ConfirmStripeCheckoutSessionResult =
  | { status: "paid"; orderId: string }
  | { status: "already_paid"; orderId: string }
  | { status: "unpaid" }
  | { status: "missing_order_id" }
  | { status: "order_mismatch" }
  | { status: "order_not_found" };

function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export async function confirmStripeCheckoutSession(
  input: ConfirmStripeCheckoutSessionInput,
): Promise<ConfirmStripeCheckoutSessionResult> {
  const stripe = getStripe();
  const supabase = getSupabaseAdmin();

  const session =
    input.session ??
    (input.sessionId
      ? await stripe.checkout.sessions.retrieve(input.sessionId, {
          expand: ["payment_intent"],
        })
      : null);

  if (!session || session.payment_status !== "paid") {
    return { status: "unpaid" };
  }

  const orderId = session.metadata?.order_id;

  if (!orderId) {
    await supabase.from("order_events").insert({
      event_type: `checkout.confirmed_missing_order_id.${input.source}`,
      payload: session,
    });
    return { status: "missing_order_id" };
  }

  if (input.expectedOrderId && input.expectedOrderId !== orderId) {
    await supabase.from("order_events").insert({
      order_id: orderId,
      event_type: `checkout.confirmed_order_mismatch.${input.source}`,
      payload: {
        session_id: session.id,
        expected_order_id: input.expectedOrderId,
      },
    });
    return { status: "order_mismatch" };
  }

  const { data: order, error: fetchError } = await supabase
    .from("orders")
    .select("id, status, customer_email, customer_name, product_title, total_amount")
    .eq("id", orderId)
    .single();

  if (fetchError || !order) {
    await supabase.from("order_events").insert({
      order_id: orderId,
      event_type: `checkout.confirmed_order_not_found.${input.source}`,
      payload: {
        session_id: session.id,
      },
    });
    return { status: "order_not_found" };
  }

  if (order.status === "paid") {
    return { status: "already_paid", orderId: order.id };
  }

  const stripePaymentIntentId =
    typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id ?? null;

  await supabase
    .from("orders")
    .update({
      status: "paid",
      paid_at: new Date().toISOString(),
      stripe_payment_intent_id: stripePaymentIntentId,
    })
    .eq("id", order.id);

  await supabase.from("order_events").insert({
    order_id: order.id,
    event_type: `checkout.confirmed.${input.source}`,
    payload: {
      session_id: session.id,
      payment_intent_id: stripePaymentIntentId,
    },
  });

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

  return { status: "paid", orderId: order.id };
}