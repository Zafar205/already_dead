"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

type Product = {
  id: number;
  slug: string;
  title: string;
  color: string;
  price: number;
  image: string;
  description: string;
};

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

type Props = {
  initialProducts: Product[];
  initialOrders: Order[];
};

export default function AdminPanelClient({ initialProducts, initialOrders }: Props) {
  const [products, setProducts] = useState(initialProducts);
  const [orders, setOrders] = useState(initialOrders);
  const [accountEmail, setAccountEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [accountLoading, setAccountLoading] = useState(true);
  const [accountSaving, setAccountSaving] = useState(false);
  const [accountMessage, setAccountMessage] = useState<string | null>(null);
  const [accountError, setAccountError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [color, setColor] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const formattedOrders = useMemo(
    () =>
      [...orders].sort((a, b) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }),
    [orders],
  );

  const previewProducts = products.slice(0, 5);
  const previewOrders = formattedOrders.slice(0, 5);

  useEffect(() => {
    let cancelled = false;

    async function loadAccountSettings() {
      setAccountError(null);

      try {
        const response = await fetch("/api/admin/account", {
          method: "GET",
          cache: "no-store",
        });

        const data = (await response.json()) as { email?: string; error?: string };

        if (!response.ok || !data.email) {
          throw new Error(data.error ?? "Failed to load account settings.");
        }

        if (!cancelled) {
          setAccountEmail(data.email);
        }
      } catch (fetchError) {
        if (!cancelled) {
          setAccountError(fetchError instanceof Error ? fetchError.message : "Failed to load account settings.");
        }
      } finally {
        if (!cancelled) {
          setAccountLoading(false);
        }
      }
    }

    void loadAccountSettings();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleCreateProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (!imageFile) {
      setError("Please select an image.");
      return;
    }

    const numericPrice = Number(price);

    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      setError("Price must be a positive number.");
      return;
    }

    setSaving(true);

    try {
      const uploadData = new FormData();
      uploadData.append("image", imageFile);

      const uploadResponse = await fetch("/api/admin/upload-image", {
        method: "POST",
        body: uploadData,
      });

      const uploadJson = (await uploadResponse.json()) as { imagePath?: string; error?: string };

      if (!uploadResponse.ok || !uploadJson.imagePath) {
        throw new Error(uploadJson.error ?? "Image upload failed.");
      }

      const createResponse = await fetch("/api/admin/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          color,
          price: numericPrice,
          description,
          image: uploadJson.imagePath,
        }),
      });

      const createJson = (await createResponse.json()) as { product?: Product; error?: string };

      if (!createResponse.ok || !createJson.product) {
        throw new Error(createJson.error ?? "Failed to create product.");
      }

      setProducts((prev) => [createJson.product as Product, ...prev]);
      setTitle("");
      setColor("");
      setPrice("");
      setDescription("");
      setImageFile(null);
      setMessage("Product created successfully.");
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : "Failed to create product.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteProduct(id: number) {
    setError(null);
    setMessage(null);

    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to delete product.");
      }

      setProducts((prev) => prev.filter((product) => product.id !== id));
      setMessage("Product deleted.");
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Failed to delete product.");
    }
  }

  async function handleSignOut() {
    setSigningOut(true);
    await fetch("/api/admin/sign-out", { method: "POST" });
    window.location.href = "/admin/sign-in";
  }

  async function handleUpdateAccount(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAccountError(null);
    setAccountMessage(null);

    const trimmedEmail = accountEmail.trim();

    if (!trimmedEmail) {
      setAccountError("Email is required.");
      return;
    }

    if (newPassword && newPassword !== confirmNewPassword) {
      setAccountError("New password and confirmation do not match.");
      return;
    }

    setAccountSaving(true);

    try {
      const response = await fetch("/api/admin/account", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: trimmedEmail,
          currentPassword,
          newPassword: newPassword || undefined,
        }),
      });

      const data = (await response.json()) as { email?: string; message?: string; error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to update account details.");
      }

      setAccountEmail(data.email ?? trimmedEmail);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setAccountMessage(data.message ?? "Admin login details updated.");
    } catch (updateError) {
      setAccountError(
        updateError instanceof Error ? updateError.message : "Failed to update account details.",
      );
    } finally {
      setAccountSaving(false);
    }
  }

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    setImageFile(event.target.files?.[0] ?? null);
  }

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
      <section className="mx-auto w-full max-w-6xl space-y-6">
        <div className="flex items-center justify-between gap-4 rounded-2xl border-[3px] border-black bg-white p-6">
          <div>
            <h1 className="text-4xl font-bold uppercase tracking-tight md:text-5xl">Admin Panel</h1>
            <p className="mt-2 text-sm text-black/65">Manage products and review incoming orders.</p>
          </div>
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="rounded-full border-2 border-black px-5 py-2 text-xs font-semibold uppercase tracking-[0.12em] hover:bg-black hover:text-white disabled:opacity-60"
          >
            {signingOut ? "Signing out..." : "Sign out"}
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border-[3px] border-black bg-white p-6">
            <h2 className="text-2xl font-bold uppercase tracking-tight">Create Product</h2>
            <form className="mt-4 space-y-3" onSubmit={handleCreateProduct}>
              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Product title"
                required
                className="h-11 w-full rounded-lg border border-black/20 px-3 text-sm outline-none focus:border-black"
              />
              <input
                type="text"
                value={color}
                onChange={(event) => setColor(event.target.value)}
                placeholder="Color"
                required
                className="h-11 w-full rounded-lg border border-black/20 px-3 text-sm outline-none focus:border-black"
              />
              <input
                type="number"
                min="1"
                step="0.01"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                placeholder="Price"
                required
                className="h-11 w-full rounded-lg border border-black/20 px-3 text-sm outline-none focus:border-black"
              />
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Description"
                rows={4}
                required
                className="w-full rounded-lg border border-black/20 px-3 py-2 text-sm outline-none focus:border-black"
              />
              <div className="rounded-xl border border-black/20 bg-[#f4f6fb] p-3">
                <input
                  ref={fileInputRef}
                  id="product-image"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  required
                  onChange={handleImageChange}
                  className="sr-only"
                />
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-black/65">Product image</p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-full border border-black px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] hover:bg-black hover:text-white"
                  >
                    {imageFile ? "Change file" : "Choose file"}
                  </button>
                </div>
                <p className="mt-2 text-sm text-black/75">
                  {imageFile ? imageFile.name : "No file selected"}
                </p>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="rounded-full bg-black px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white disabled:opacity-60"
              >
                {saving ? "Saving..." : "Create product"}
              </button>
            </form>

            {message ? <p className="mt-3 text-sm font-medium text-green-700">{message}</p> : null}
            {error ? <p className="mt-3 text-sm font-medium text-red-700">{error}</p> : null}
          </section>

          <section className="rounded-2xl border-[3px] border-black bg-white p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-2xl font-bold uppercase tracking-tight">Products</h2>
              <Link
                href="/admin/products"
                className="text-xs font-semibold uppercase tracking-[0.14em] text-black/70 hover:underline"
              >
                View all
              </Link>
            </div>
            <div className="mt-4 max-h-[460px] space-y-3 overflow-y-auto pr-1">
              {previewProducts.map((product) => (
                <div key={product.id} className="rounded-xl border-2 border-black p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold uppercase">{product.title}</p>
                      <p className="text-xs text-black/60">{product.color}</p>
                      <p className="text-xs font-semibold">${product.price}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="rounded-full border border-black px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] hover:bg-black hover:text-white"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="rounded-2xl border-[3px] border-black bg-white p-6">
          <h2 className="text-2xl font-bold uppercase tracking-tight">Account Settings</h2>
          <p className="mt-2 text-sm text-black/65">Update the admin sign-in email and password.</p>

          <form className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2" onSubmit={handleUpdateAccount}>
            <label className="md:col-span-2">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.1em] text-black/65">Email</span>
              <input
                type="email"
                value={accountEmail}
                onChange={(event) => setAccountEmail(event.target.value)}
                required
                className="h-11 w-full rounded-lg border border-black/20 px-3 text-sm outline-none focus:border-black"
              />
            </label>

            <label>
              <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.1em] text-black/65">
                Current password
              </span>
              <input
                type="password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                autoComplete="current-password"
                required
                className="h-11 w-full rounded-lg border border-black/20 px-3 text-sm outline-none focus:border-black"
              />
            </label>

            <label>
              <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.1em] text-black/65">
                New password
              </span>
              <input
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                autoComplete="new-password"
                placeholder="Leave blank to keep current"
                className="h-11 w-full rounded-lg border border-black/20 px-3 text-sm outline-none focus:border-black"
              />
            </label>

            <label className="md:col-span-2">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.1em] text-black/65">
                Confirm new password
              </span>
              <input
                type="password"
                value={confirmNewPassword}
                onChange={(event) => setConfirmNewPassword(event.target.value)}
                autoComplete="new-password"
                placeholder="Repeat new password"
                className="h-11 w-full rounded-lg border border-black/20 px-3 text-sm outline-none focus:border-black"
              />
            </label>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={accountLoading || accountSaving}
                className="rounded-full bg-black px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white disabled:opacity-60"
              >
                {accountSaving ? "Updating..." : "Update login details"}
              </button>
            </div>
          </form>

          {accountLoading ? <p className="mt-3 text-sm text-black/60">Loading account settings...</p> : null}
          {accountMessage ? <p className="mt-3 text-sm font-medium text-green-700">{accountMessage}</p> : null}
          {accountError ? <p className="mt-3 text-sm font-medium text-red-700">{accountError}</p> : null}
        </section>

        <section className="rounded-2xl border-[3px] border-black bg-white p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-2xl font-bold uppercase tracking-tight">Orders</h2>
            <Link
              href="/admin/orders"
              className="text-xs font-semibold uppercase tracking-[0.14em] text-black/70 hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="mt-4 overflow-x-auto">
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
                {previewOrders.map((order) => {
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
                    <td className="px-3 py-2 text-xs text-black/60">
                      {new Date(order.created_at).toLocaleString()}
                    </td>
                  </tr>
                );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </main>
  );
}
