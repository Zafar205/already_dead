import { NextResponse } from "next/server";
import { sendOrderReceivedEmail } from "@/lib/mailer";
import { getProductBySlugFromStore } from "@/lib/productsRepo";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

type CreateSessionBody = {
  productSlug?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  shippingAddress?: string;
};

function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

function buildAbsoluteImageUrl(image: string, siteUrl: string) {
  const trimmedImage = image.trim();

  if (/^https?:\/\//i.test(trimmedImage)) {
    try {
      new URL(trimmedImage);
      return trimmedImage;
    } catch {
      return `${siteUrl.replace(/\/$/, "")}/product_1.jpeg`;
    }
  }

  const normalizedSiteUrl = siteUrl.replace(/\/$/, "");
  const normalizedPath = trimmedImage.startsWith("/") ? trimmedImage : `/${trimmedImage}`;
  return `${normalizedSiteUrl}${normalizedPath}`;
}

function isStripeEnabled() {
  return process.env.STRIPE_ENABLED === "true";
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateSessionBody;

    if (!body.productSlug || !body.customerName || !body.customerEmail || !body.customerPhone) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 },
      );
    }

    const product = await getProductBySlugFromStore(body.productSlug);

    if (!product) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    const unitAmount = Math.round(product.price * 100);
    const siteUrl = getSiteUrl();
    const supabase = getSupabaseAdmin();

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        status: "pending",
        currency: "usd",
        subtotal_amount: unitAmount,
        total_amount: unitAmount,
        customer_email: body.customerEmail,
        customer_name: body.customerName,
        customer_phone: body.customerPhone,
        shipping_address: body.shippingAddress ?? null,
        product_slug: product.slug,
        product_title: product.title,
        metadata: {
          source: "catalog-product-page",
        },
      })
      .select("id")
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: "Failed to create order.", details: orderError?.message },
        { status: 500 },
      );
    }

    const { error: itemError } = await supabase.from("order_items").insert({
      order_id: order.id,
      product_slug: product.slug,
      product_title: product.title,
      product_image: product.image,
      unit_amount: unitAmount,
      quantity: 1,
      line_total: unitAmount,
    });

    if (itemError) {
      return NextResponse.json(
        { error: "Failed to add order item.", details: itemError.message },
        { status: 500 },
      );
    }

    if (!isStripeEnabled()) {
      try {
        await sendOrderReceivedEmail({
          to: body.customerEmail,
          customerName: body.customerName,
          productTitle: product.title,
          amountInCents: unitAmount,
          orderId: order.id,
        });

        await supabase.from("order_events").insert({
          order_id: order.id,
          event_type: "email.order_received.sent",
          payload: {
            customer_email: body.customerEmail,
          },
        });
      } catch (emailError) {
        await supabase.from("order_events").insert({
          order_id: order.id,
          event_type: "email.order_received.failed",
          payload: {
            error: emailError instanceof Error ? emailError.message : "Unknown email error",
          },
        });
      }

      return NextResponse.json({
        url: `${siteUrl}/checkout/success?order_id=${order.id}&mode=manual`,
      });
    }

    const stripe = getStripe();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: body.customerEmail,
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}`,
      cancel_url: `${siteUrl}/catalog/${product.slug}?canceled=1`,
      phone_number_collection: {
        enabled: true,
      },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: unitAmount,
            product_data: {
              name: product.title,
              description: product.description,
              images: [buildAbsoluteImageUrl(product.image, siteUrl)],
            },
          },
        },
      ],
      metadata: {
        order_id: order.id,
        product_slug: product.slug,
        customer_name: body.customerName,
        customer_phone: body.customerPhone,
      },
    });

    const { error: updateOrderError } = await supabase
      .from("orders")
      .update({ stripe_session_id: session.id })
      .eq("id", order.id);

    if (updateOrderError) {
      return NextResponse.json(
        { error: "Failed to update order with Stripe session.", details: updateOrderError.message },
        { status: 500 },
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
