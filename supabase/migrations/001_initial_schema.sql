create extension if not exists "pgcrypto";

create table if not exists public.items (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 160),
  created_at timestamptz not null default now()
);

create index if not exists items_created_at_idx
  on public.items (created_at desc);

alter table public.items enable row level security;

create policy "Public can read items"
  on public.items for select using (true);

create policy "Public can create items"
  on public.items for insert
  with check (char_length(name) between 2 and 160);
