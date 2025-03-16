-- Create emergency_contacts table with RLS policies
create table if not exists public.emergency_contacts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  phone text not null,
  relationship text,
  is_primary boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.emergency_contacts enable row level security;

-- Create policies
create policy emergency_contacts_select_policy
  on public.emergency_contacts for select
  using ( auth.uid() = user_id );

create policy emergency_contacts_insert_policy
  on public.emergency_contacts for insert
  with check ( auth.uid() = user_id );

create policy emergency_contacts_update_policy
  on public.emergency_contacts for update
  using ( auth.uid() = user_id );

create policy emergency_contacts_delete_policy
  on public.emergency_contacts for delete
  using ( auth.uid() = user_id );

-- Create updated_at trigger
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger emergency_contacts_updated_at
  before update on public.emergency_contacts
  for each row execute procedure public.handle_updated_at();