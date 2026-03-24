create extension if not exists pgcrypto;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed', 'canceled')),
  stripe_session_id text unique,
  stripe_payment_intent_id text,
  currency text not null default 'usd',
  subtotal_amount integer not null,
  total_amount integer not null,
  customer_email text not null,
  customer_name text not null,
  customer_phone text not null,
  shipping_address text,
  product_slug text not null,
  product_title text not null,
  paid_at timestamptz,
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.order_items (
  id bigserial primary key,
  created_at timestamptz not null default now(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_slug text not null,
  product_title text not null,
  product_image text,
  unit_amount integer not null,
  quantity integer not null default 1,
  line_total integer not null
);

create table if not exists public.order_events (
  id bigserial primary key,
  created_at timestamptz not null default now(),
  order_id uuid references public.orders(id) on delete cascade,
  event_type text not null,
  payload jsonb not null default '{}'::jsonb
);

create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_customer_email_idx on public.orders (customer_email);
create index if not exists order_items_order_id_idx on public.order_items (order_id);
create index if not exists order_events_order_id_idx on public.order_events (order_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_orders_updated_at on public.orders;
create trigger trg_orders_updated_at
before update on public.orders
for each row
execute function public.set_updated_at();

alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_events enable row level security;

create policy "No direct public access to orders"
on public.orders
for all
using (false)
with check (false);

create policy "No direct public access to order_items"
on public.order_items
for all
using (false)
with check (false);

create policy "No direct public access to order_events"
on public.order_events
for all
using (false)
with check (false);
