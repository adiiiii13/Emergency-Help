-- Drop existing insert policy
drop policy if exists emergency_contacts_insert_policy on public.emergency_contacts;

-- Create new insert policy that allows adding app users
create policy emergency_contacts_insert_policy
  on public.emergency_contacts for insert
  with check (
    auth.uid() = user_id AND 
    (
      -- Either it's a regular contact without app_user_id
      (app_user_id IS NULL) OR 
      -- Or it's an app user contact, and we verify the app_user exists
      (app_user_id IN (SELECT id FROM auth.users))
    )
  );