import Stripe from "stripe";
import { getRequiredEnv } from "./env";

export function getStripe() {
  return new Stripe(getRequiredEnv("STRIPE_SECRET_KEY"), {
    apiVersion: "2026-02-25.clover",
  });
}
