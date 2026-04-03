import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import { sendOrderStatusEmail } from "@/lib/mailer";
import { isAdminAllowedOrderStatus } from "@/lib/orderStatus";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

type UpdateOrderStatusBody = {
  status?: string;
};

export async function PATCH(request: NextRequest, context: RouteContext) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const body = (await request.json()) as UpdateOrderStatusBody;

  if (!body.status || !isAdminAllowedOrderStatus(body.status)) {
    return NextResponse.json({ error: "Invalid status value." }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  const { data: order, error: fetchError } = await supabase
    .from("orders")
    .select("id, customer_email, customer_name, product_title")
    .eq("id", id)
    .single();

  if (fetchError || !order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  const { error: updateError } = await supabase.from("orders").update({ status: body.status }).eq("id", id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  try {
    await sendOrderStatusEmail({
      to: order.customer_email,
      customerName: order.customer_name,
      productTitle: order.product_title,
      orderId: order.id,
      status: body.status,
    });

    await supabase.from("order_events").insert({
      order_id: order.id,
      event_type: "email.order_status.sent",
      payload: {
        status: body.status,
        customer_email: order.customer_email,
      },
    });
  } catch (emailError) {
    await supabase.from("order_events").insert({
      order_id: order.id,
      event_type: "email.order_status.failed",
      payload: {
        status: body.status,
        error: emailError instanceof Error ? emailError.message : "Unknown email error",
      },
    });
  }

  return NextResponse.json({ ok: true, status: body.status });
}
