This is a Next.js storefront for ALREADY DEAD.

## Order Flow Included

- Collect customer name, email, phone, and optional shipping address on each product page.
- Create an order record in Supabase before payment.
- Redirect user to Stripe Checkout.
- Redirect successful payments to a Thank You page.
- Handle Stripe webhook events to mark orders as paid.
- Send paid-order email updates through Nodemailer (SMTP).

## Setup

1. Create env file from template:

```bash
cp .env.example .env
```

2. Fill required variables in .env:
- NEXT_PUBLIC_SITE_URL
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
- SUPABASE_SERVICE_ROLE_KEY
- STRIPE_ENABLED
- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET
- ADMIN_EMAIL
- ADMIN_PASSWORD
- ADMIN_SESSION_SECRET
- SMTP_HOST
- SMTP_PORT
- SMTP_USER
- SMTP_PASS
- SMTP_FROM

3. Apply Supabase migration SQL:
- Run [supabase/migrations/0001_orders_and_checkout.sql](supabase/migrations/0001_orders_and_checkout.sql) in the Supabase SQL editor.
- Run [supabase/migrations/0002_products_admin.sql](supabase/migrations/0002_products_admin.sql) in the Supabase SQL editor.
- Run [supabase/migrations/0003_orders_add_delivered_status.sql](supabase/migrations/0003_orders_add_delivered_status.sql) in the Supabase SQL editor.
- Run [supabase/migrations/0004_admin_credentials.sql](supabase/migrations/0004_admin_credentials.sql) in the Supabase SQL editor.

4. Start local development:

```bash
npm run dev
```

## Stripe Webhook (Local)

Use the Stripe CLI and point webhook events to the route below:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copy the generated webhook signing secret into STRIPE_WEBHOOK_SECRET in .env.

## Key Routes

- Catalog: /catalog
- Product: /catalog/[slug]
- Create checkout session API: /api/checkout/create-session
- Stripe webhook API: /api/stripe/webhook
- Thank you page: /checkout/success
- Admin sign in: /admin/sign-in
- Admin dashboard: /admin

## Admin Defaults

- Default email: mohamedalzafar@gmail.com
- Default password: 123456
- You can override using ADMIN_EMAIL and ADMIN_PASSWORD in .env.
- After running migration `0004`, you can update admin email/password from `/admin` under **Account Settings**.

## Notes

- The server uses SUPABASE_SERVICE_ROLE_KEY for trusted writes from API routes.
- Do not expose STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, SMTP credentials, or service role keys in client code.
