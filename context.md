# ALREADY DEAD - Project Context (March 24, 2026)

## Stack and App Shape
- Framework: Next.js App Router (TypeScript).
- UI: Tailwind utility classes + custom brutalist styling.
- DB: Supabase (server-side writes with service role key).
- Email: Nodemailer over Gmail SMTP app password.
- Payments: Stripe integrated in code, currently feature-toggled OFF.

## Current Business Flow
- Storefront has catalog and product detail pages.
- Product page has order form (name, email, phone, optional address).
- Orders are persisted to Supabase.
- With Stripe paused, checkout redirects directly to Thank You page and sends order-received email.
- Admin can manage products and monitor orders.

## Key Routes
- `/` landing page.
- `/catalog` catalog listing.
- `/catalog/[slug]` product detail.
- `/checkout/success` thank-you page.
- `/admin/sign-in` admin login.
- `/admin` admin dashboard preview (few products/orders + View All links).
- `/admin/products` full products page.
- `/admin/orders` full orders page with status dropdown.

## Key API Routes
- `POST /api/checkout/create-session`
	- Creates order + order item.
	- If `STRIPE_ENABLED=false`, sends order-received email and returns success URL with `mode=manual`.
	- If `STRIPE_ENABLED=true`, creates Stripe checkout session.
- `POST /api/stripe/webhook`
	- Handles Stripe checkout completion and paid email flow.
- `POST /api/admin/sign-in`
- `POST /api/admin/sign-out`
- `GET/PATCH /api/admin/account`
- `GET/POST /api/admin/products`
- `DELETE /api/admin/products/[id]`
- `POST /api/admin/upload-image`
- `GET /api/admin/orders`
- `PATCH /api/admin/orders/[id]/status`
	- Allowed statuses in admin UI/API: `pending`, `delivered`.
	- Sends status update email to customer on change.

## Admin Auth
- Cookie-based signed session (`already_dead_admin_session`).
- Defaults coded for development and env fallback:
	- Email: `mohamedalzafar@gmail.com`
	- Password: `123456`
- Override via env:
	- `ADMIN_EMAIL`
	- `ADMIN_PASSWORD`
	- `ADMIN_SESSION_SECRET`
- Persistent credentials now supported through `admin_credentials` table (hashed password), editable from `/admin`.

## Product Source of Truth
- Storefront now reads products from Supabase `products` table via repo helper.
- Fallback to `defaultProducts` in code if DB table is unavailable.
- Admin product create/delete updates Supabase products and storefront reflects DB data.

## Order Status Behavior
- DB historically had status check with values: `pending`, `paid`, `failed`, `canceled`.
- Added migration to include `delivered` so admin status updates work.

## Supabase Migrations Required
- `supabase/migrations/0001_orders_and_checkout.sql`
	- Creates `orders`, `order_items`, `order_events` + indexes + RLS + trigger.
- `supabase/migrations/0002_products_admin.sql`
	- Creates `products` + seed product rows + RLS.
- `supabase/migrations/0003_orders_add_delivered_status.sql`
	- Updates order status check to include `delivered`.
- `supabase/migrations/0004_admin_credentials.sql`
	- Creates `admin_credentials` table used by admin account settings.

## Environment Variables
Expected in `.env`:
- Public:
	- `NEXT_PUBLIC_SITE_URL`
	- `NEXT_PUBLIC_SUPABASE_URL`
	- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
- Server:
	- `SUPABASE_SERVICE_ROLE_KEY`
	- `STRIPE_ENABLED` (`false` currently)
	- `STRIPE_SECRET_KEY`
	- `STRIPE_WEBHOOK_SECRET`
	- `ADMIN_EMAIL`
	- `ADMIN_PASSWORD`
	- `ADMIN_SESSION_SECRET`
	- `SMTP_HOST`
	- `SMTP_PORT`
	- `SMTP_USER`
	- `SMTP_PASS`
	- `SMTP_FROM`

## Current Operational State
- Stripe is intentionally paused (`STRIPE_ENABLED=false`).
- Manual order processing path is active and functional.
- SMTP verified and real email test succeeded.
- Admin products endpoint now fails gracefully when products table is missing and returns setup hint.

## Known Warnings (Non-blocking)
- ESLint warnings about using native `<img>` in a few files.
- One unused icon import in `app/page.tsx` (`ChevronUp`).

## Recent UX Updates
- Product page related items now capped to 3.
- Admin dashboard now shows preview lists and View All links.
- Added dedicated full pages for all products and all orders.
- Admin create-product file input restyled to custom picker UI.

## If Something Breaks First
1. Confirm all three SQL migrations are applied in Supabase.
2. Confirm `SUPABASE_SERVICE_ROLE_KEY` is present in `.env`.
3. Restart dev server after env or route-component changes (`rm -rf .next && npm run dev`).
4. For Stripe flows, set `STRIPE_ENABLED=true` and configure keys/webhook.

## Suggested Next Improvements (Not done yet)
- Admin product edit/update flow (currently create + delete).
- Server-side pagination and search for orders/products full pages.
- Replace remaining `<img>` with `next/image` where practical.
- Stronger admin auth (hashed passwords + DB users).
