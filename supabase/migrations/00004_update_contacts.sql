-- Add app_user_id column to emergency_contacts
alter table public.emergency_contacts
add column app_user_id uuid references auth.users on delete set null,
add column is_app_user boolean default false;

-- Create indexes
create index emergency_contacts_app_user_id_idx on public.emergency_contacts(app_user_id);

-- Update RLS policies to allow viewing contacts where the logged-in user is the app_user_id
drop policy if exists emergency_contacts_select_policy on public.emergency_contacts;
create policy emergency_contacts_select_policy
  on public.emergency_contacts for select
  using ( auth.uid() = user_id or auth.uid() = app_user_id );