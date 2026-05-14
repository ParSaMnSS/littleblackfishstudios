-- Hot-path indexes. All hot queries filter by `published` / `active` and order
-- by `order`. Partial indexes keep the index small (only the visible rows).
create index if not exists projects_published_order_idx
  on public.projects (published, "order")
  where published = true;

create index if not exists projects_slug_idx
  on public.projects (slug);

create index if not exists hero_slides_active_order_idx
  on public.hero_slides (active, "order")
  where active = true;
