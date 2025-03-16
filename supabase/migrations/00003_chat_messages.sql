-- Create chat_messages table with RLS policies
create table if not exists public.chat_messages (
  id uuid default uuid_generate_v4() primary key,
  sender_id uuid references auth.users on delete cascade not null,
  receiver_id uuid references auth.users on delete cascade not null,
  message text not null,
  read boolean default false,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.chat_messages enable row level security;

-- Create policies
create policy chat_messages_select_policy
  on public.chat_messages for select
  using ( auth.uid() = sender_id or auth.uid() = receiver_id );

create policy chat_messages_insert_policy
  on public.chat_messages for insert
  with check ( auth.uid() = sender_id );

create policy chat_messages_update_policy
  on public.chat_messages for update
  using ( auth.uid() = sender_id or auth.uid() = receiver_id );

-- Add indexes for better performance
create index chat_messages_sender_id_idx on public.chat_messages(sender_id);
create index chat_messages_receiver_id_idx on public.chat_messages(receiver_id);
create index chat_messages_created_at_idx on public.chat_messages(created_at);