export const ADMIN_ALLOWED_ORDER_STATUSES = ["pending", "delivered"] as const;

export type AdminAllowedOrderStatus = (typeof ADMIN_ALLOWED_ORDER_STATUSES)[number];

export function isAdminAllowedOrderStatus(value: string): value is AdminAllowedOrderStatus {
  return (ADMIN_ALLOWED_ORDER_STATUSES as readonly string[]).includes(value);
}
