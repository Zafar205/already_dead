import Link from "next/link";
import { confirmStripeCheckoutSession } from "@/lib/stripeCheckoutConfirmation";

type SuccessPageProps = {
  searchParams: Promise<{ order_id?: string; mode?: string; session_id?: string }>;
};

export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const { order_id: orderId, mode, session_id: sessionId } = await searchParams;
  const isManualMode = mode === "manual";
  let isPaymentConfirmed = !isManualMode;

  if (!isManualMode && sessionId) {
    const result = await confirmStripeCheckoutSession({
      source: "success_redirect",
      sessionId,
      expectedOrderId: orderId,
    });

    isPaymentConfirmed = result.status === "paid" || result.status === "already_paid";
  }

  return (
    <main className="min-h-screen bg-[#f5f5f5] px-4 py-10 text-black md:px-6 md:py-14">
      <section className="mx-auto w-full max-w-3xl rounded-2xl border-[3px] border-black bg-white p-8 md:p-12">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/60">
          {isManualMode ? "Order submitted" : isPaymentConfirmed ? "Payment confirmed" : "Payment pending"}
        </p>
        <h1 className="mt-3 text-4xl font-bold uppercase tracking-tight md:text-6xl">You Are In</h1>
        {isManualMode ? (
          <p className="mt-4 text-sm leading-6 text-black/75 md:text-base">
            Your Already Dead merch order has been received. Payments are currently handled manually, and we have
            emailed your order details.
          </p>
        ) : isPaymentConfirmed ? (
          <p className="mt-4 text-sm leading-6 text-black/75 md:text-base">
            Your Already Dead merch order is confirmed and your payment is complete. We sent an email with all
            order details.
          </p>
        ) : (
          <p className="mt-4 text-sm leading-6 text-black/75 md:text-base">
            Your payment is processing. If you were charged, your order will be updated shortly. If needed, contact
            support with your order code below.
          </p>
        )}

        {orderId ? (
          <p className="mt-6 rounded-lg border border-black/20 bg-[#f3f3f3] px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-black/70">
            Order code: {orderId}
          </p>
        ) : null}

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/catalog"
            className="rounded-full bg-black px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-black/85"
          >
            Continue to merch
          </Link>
          <Link
            href="/"
            className="rounded-full border-2 border-black px-6 py-3 text-sm font-semibold uppercase tracking-wide transition hover:bg-black hover:text-white"
          >
            Back to home
          </Link>
        </div>
      </section>
    </main>
  );
}
