create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.admin_credentials (
  id smallint primary key check (id = 1),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  email text not null,
  password_hash text not null,
  password_salt text not null,
  password_iterations integer not null check (password_iterations > 0),
  password_keylen integer not null check (password_keylen > 0),
  password_digest text not null
);

alter table public.admin_credentials enable row level security;

drop policy if exists "No direct public access to admin_credentials" on public.admin_credentials;
create policy "No direct public access to admin_credentials"
on public.admin_credentials
for all
using (false)
with check (false);

drop trigger if exists trg_admin_credentials_updated_at on public.admin_credentials;
create trigger trg_admin_credentials_updated_at
before update on public.admin_credentials
for each row
execute function public.set_updated_at();
