-- Categories table for Netflix-style project grouping.
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_en text not null,
  name_fa text not null,
  "order" integer not null default 0,
  visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists categories_order_idx on public.categories ("order");
create index if not exists categories_visible_idx on public.categories (visible);

alter table public.projects
  add column if not exists category_id uuid references public.categories(id) on delete set null;

create index if not exists projects_category_id_idx on public.projects (category_id);

alter table public.categories enable row level security;

drop policy if exists "categories_public_read" on public.categories;
create policy "categories_public_read"
  on public.categories
  for select
  using (visible = true);

drop policy if exists "categories_service_all" on public.categories;
create policy "categories_service_all"
  on public.categories
  for all
  to service_role
  using (true)
  with check (true);
