create table if not exists public.products (
  id bigserial primary key,
  created_at timestamptz not null default now(),
  slug text not null unique,
  title text not null,
  color text not null,
  price integer not null check (price > 0),
  image text not null,
  description text not null
);

create index if not exists products_created_at_idx on public.products (created_at desc);

alter table public.products enable row level security;

create policy "No direct public access to products"
on public.products
for all
using (false)
with check (false);

insert into public.products (slug, title, color, price, image, description)
values
  (
    't-shirt-vlom-cust',
    'T-Shirt VLOM.CUST',
    'Vintage Grey',
    39,
    '/product_1.jpeg',
    'Hand-finished oversized t-shirt with washed texture and signature custom graphics.'
  ),
  (
    'cartholder-vlom-cust',
    'Cartholder VLOM.CUST',
    'Grey',
    39,
    '/product_2.jpeg',
    'Compact everyday cardholder with minimal profile and custom brand detailing.'
  ),
  (
    'calligraphy-backpack',
    'Calligraphy Backpack',
    'Black',
    78,
    '/product_3.jpeg',
    'Urban backpack with hand-drawn calligraphy accents and utility-focused structure.'
  ),
  (
    'leather-jacket-vlom-cust',
    'Leather Jacket VLOM.CUST',
    'Vintage Grey',
    39,
    '/product_4.jpeg',
    'Statement leather jacket customized for a distressed, gallery-ready street silhouette.'
  )
on conflict (slug) do nothing;
