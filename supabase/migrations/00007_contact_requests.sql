-- Create contact_requests table with RLS policies
create table if not exists public.contact_requests (
  id uuid default uuid_generate_v4() primary key,
  sender_id uuid references auth.users on delete cascade not null,
  receiver_id uuid references auth.users on delete cascade not null,
  status text default 'pending' check (status in ('pending', 'accepted', 'rejected')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.contact_requests enable row level security;

-- Create policies
create policy contact_requests_select_policy
  on public.contact_requests for select
  using ( auth.uid() = sender_id or auth.uid() = receiver_id );

create policy contact_requests_insert_policy
  on public.contact_requests for insert
  with check ( auth.uid() = sender_id );

create policy contact_requests_update_policy
  on public.contact_requests for update
  using ( auth.uid() = sender_id or auth.uid() = receiver_id );

-- Add indexes for better performance
create index contact_requests_sender_id_idx on public.contact_requests(sender_id);
create index contact_requests_receiver_id_idx on public.contact_requests(receiver_id);
create index contact_requests_status_idx on public.contact_requests(status);

-- Create updated_at trigger
create trigger contact_requests_updated_at
  before update on public.contact_requests
  for each row execute procedure public.handle_updated_at();