-- First create the pg_trgm extension
create extension if not exists pg_trgm;

-- Add policy to allow searching profiles
create policy profiles_search_policy
  on public.profiles for select
  using (true);  -- Allow public read access for searching

-- Update the email column to be more searchable
create index if not exists profiles_email_search_idx on public.profiles using gin(email gin_trgm_ops);