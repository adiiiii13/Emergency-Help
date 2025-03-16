-- Drop existing trigger and function if they exist
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- Create profiles table with RLS policies
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  email text,
  phone text,
  created_at timestamptz default now()
);

-- Enable RLS

alter table public.profiles enable row level security;

-- Create policies without special characters in names
create policy profiles_select_policy
  on public.profiles for select
  using ( auth.uid() = id );

create policy profiles_insert_policy
  on public.profiles for insert
  with check ( auth.uid() = id );

create policy profiles_update_policy
  on public.profiles for update
  using ( auth.uid() = id );

-- Create a secure function to handle new user registration
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, phone)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email,
    new.raw_user_meta_data->>'phone'
  );
  return new;
end;
$$;

-- Trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();