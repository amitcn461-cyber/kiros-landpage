-- ============================================================
--  KIROS AI — Leads table setup for Supabase
--  Run this once in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- 1) Table
create table if not exists public.leads (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  full_name       text not null,
  business_name   text not null,
  phone           text not null,
  email           text not null,
  monthly_volume  text,
  source          text default 'landing_page'
);

-- 2) Enable Row Level Security
alter table public.leads enable row level security;

-- 3) Allow the public (anon) site to INSERT leads only.
--    No SELECT/UPDATE/DELETE policy is created, so visitors
--    can submit the form but cannot read or modify any data.
drop policy if exists "Public can insert leads" on public.leads;
create policy "Public can insert leads"
  on public.leads
  for insert
  to anon, authenticated
  with check (true);

-- 4) (Optional) Basic guard: keep inserts limited to the expected columns.
--    Supabase handles created_at/id automatically.

-- Done. You can view incoming leads in: Table Editor → leads
