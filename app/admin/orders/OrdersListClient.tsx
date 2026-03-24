"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Order = {
  id: string;
  created_at: string;
  status: string;
  total_amount: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  product_title: string;
};

type OrdersListClientProps = {
  initialOrders: Order[];
};

export default function OrdersListClient({ initialOrders }: OrdersListClientProps) {
  const [orders, setOrders] = useState(initialOrders);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const sortedOrders = useMemo(
    () =>
      [...orders].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      ),
    [orders],
  );

  async function handleStatusChange(orderId: string, status: "pending" | "delivered") {
    setUpdatingOrderId(orderId);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to update order status.");
      }

      setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status } : order)));
      setMessage(`Order ${orderId.slice(0, 8)} updated to ${status}. Email sent to customer.`);
    } catch (statusError) {
      setError(statusError instanceof Error ? statusError.message : "Failed to update order status.");
    } finally {
      setUpdatingOrderId(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f5f5] px-4 py-10 text-black md:px-6 md:py-14">
      <section className="mx-auto w-full max-w-6xl rounded-2xl border-[3px] border-black bg-white p-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold uppercase tracking-tight md:text-4xl">All Orders</h1>
            <p className="mt-2 text-sm text-black/65">Complete order history with status controls.</p>
          </div>
          <Link
            href="/admin"
            className="rounded-full border-2 border-black px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] hover:bg-black hover:text-white"
          >
            Back to dashboard
          </Link>
        </div>

        {message ? <p className="mb-3 text-sm font-medium text-green-700">{message}</p> : null}
        {error ? <p className="mb-3 text-sm font-medium text-red-700">{error}</p> : null}

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-black/20">
                <th className="px-3 py-2">Order</th>
                <th className="px-3 py-2">Customer</th>
                <th className="px-3 py-2">Product</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Total</th>
                <th className="px-3 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {sortedOrders.map((order) => {
                const isUpdating = updatingOrderId === order.id;

                return (
                  <tr key={order.id} className="border-b border-black/10">
                    <td className="px-3 py-2 text-xs font-medium">{order.id.slice(0, 8)}</td>
                    <td className="px-3 py-2">
                      <div className="text-xs">
                        <p className="font-semibold">{order.customer_name}</p>
                        <p className="text-black/60">{order.customer_email}</p>
                        <p className="text-black/60">{order.customer_phone}</p>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-xs font-semibold">{order.product_title}</td>
                    <td className="px-3 py-2 text-xs uppercase">
                      <select
                        value={order.status === "delivered" ? "delivered" : "pending"}
                        disabled={isUpdating}
                        onChange={(event) =>
                          handleStatusChange(order.id, event.target.value as "pending" | "delivered")
                        }
                        className="rounded-md border border-black/25 bg-white px-2 py-1 text-xs uppercase"
                      >
                        <option value="pending">Pending</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </td>
                    <td className="px-3 py-2 text-xs font-semibold">${(order.total_amount / 100).toFixed(2)}</td>
                    <td className="px-3 py-2 text-xs text-black/60">{new Date(order.created_at).toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
