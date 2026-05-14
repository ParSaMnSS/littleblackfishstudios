-- Contact form submissions. Persisted before the email is sent so that
-- transient Resend failures never lose a lead. Admin reviews via the
-- Submissions tab in the CMS.
create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  message text not null,
  email_sent boolean not null default false,
  email_error text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists contact_submissions_created_at_idx
  on public.contact_submissions (created_at desc);
create index if not exists contact_submissions_read_idx
  on public.contact_submissions (read);

alter table public.contact_submissions enable row level security;

drop policy if exists "contact_submissions_service_all" on public.contact_submissions;
create policy "contact_submissions_service_all"
  on public.contact_submissions
  for all
  to service_role
  using (true)
  with check (true);
