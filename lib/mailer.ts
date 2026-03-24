import nodemailer from "nodemailer";
import { getRequiredEnv } from "./env";

type OrderPaidEmailInput = {
  to: string;
  customerName: string;
  productTitle: string;
  amountInCents: number;
  orderId: string;
  siteUrl: string;
};

type OrderReceivedEmailInput = {
  to: string;
  customerName: string;
  productTitle: string;
  amountInCents: number;
  orderId: string;
};

type OrderStatusEmailInput = {
  to: string;
  customerName: string;
  productTitle: string;
  orderId: string;
  status: "pending" | "delivered";
};

function getTransporter() {
  const host = getRequiredEnv("SMTP_HOST");
  const port = Number(getRequiredEnv("SMTP_PORT"));
  const user = getRequiredEnv("SMTP_USER");
  const pass = getRequiredEnv("SMTP_PASS");

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
}

export async function sendOrderPaidEmail(input: OrderPaidEmailInput) {
  const from = getRequiredEnv("SMTP_FROM");
  const transporter = getTransporter();
  const amount = (input.amountInCents / 100).toFixed(2);

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto;">
      <h2 style="margin-bottom: 8px;">Order confirmed</h2>
      <p style="margin-top: 0; color: #333;">Hi ${input.customerName}, your payment was successful.</p>
      <div style="border: 1px solid #ddd; border-radius: 10px; padding: 16px; margin: 20px 0;">
        <p style="margin: 0 0 8px 0;"><strong>Order ID:</strong> ${input.orderId}</p>
        <p style="margin: 0 0 8px 0;"><strong>Product:</strong> ${input.productTitle}</p>
        <p style="margin: 0;"><strong>Total:</strong> $${amount}</p>
      </div>
      <p style="margin-bottom: 0; color: #333;">You can continue shopping here:</p>
      <p style="margin-top: 6px;"><a href="${input.siteUrl}/catalog">${input.siteUrl}/catalog</a></p>
    </div>
  `;

  await transporter.sendMail({
    from,
    to: input.to,
    subject: "Your ALREADY DEAD order is confirmed",
    html,
  });
}

export async function sendOrderReceivedEmail(input: OrderReceivedEmailInput) {
  const from = getRequiredEnv("SMTP_FROM");
  const transporter = getTransporter();
  const amount = (input.amountInCents / 100).toFixed(2);

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto;">
      <h2 style="margin-bottom: 8px;">Order received</h2>
      <p style="margin-top: 0; color: #333;">Hi ${input.customerName}, we received your order successfully.</p>
      <div style="border: 1px solid #ddd; border-radius: 10px; padding: 16px; margin: 20px 0;">
        <p style="margin: 0 0 8px 0;"><strong>Order ID:</strong> ${input.orderId}</p>
        <p style="margin: 0 0 8px 0;"><strong>Product:</strong> ${input.productTitle}</p>
        <p style="margin: 0;"><strong>Total:</strong> $${amount}</p>
      </div>
      <p style="margin: 0; color: #333;">Payment is currently being handled manually. Our team will contact you with the next steps.</p>
    </div>
  `;

  await transporter.sendMail({
    from,
    to: input.to,
    subject: "We received your ALREADY DEAD order",
    html,
  });
}

export async function sendOrderStatusEmail(input: OrderStatusEmailInput) {
  const from = getRequiredEnv("SMTP_FROM");
  const transporter = getTransporter();

  const statusTitle = input.status === "delivered" ? "Delivered" : "Pending";
  const statusDescription =
    input.status === "delivered"
      ? "Great news! Your order has been delivered."
      : "Your order is currently pending and is being processed.";

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto;">
      <h2 style="margin-bottom: 8px;">Order status update</h2>
      <p style="margin-top: 0; color: #333;">Hi ${input.customerName},</p>
      <p style="color: #333;">${statusDescription}</p>
      <div style="border: 1px solid #ddd; border-radius: 10px; padding: 16px; margin: 20px 0;">
        <p style="margin: 0 0 8px 0;"><strong>Order ID:</strong> ${input.orderId}</p>
        <p style="margin: 0 0 8px 0;"><strong>Product:</strong> ${input.productTitle}</p>
        <p style="margin: 0;"><strong>Status:</strong> ${statusTitle}</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from,
    to: input.to,
    subject: `Order update: ${statusTitle}`,
    html,
  });
}
