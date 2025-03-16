-- Add GIN index for full_name to improve search performance
create index if not exists profiles_full_name_search_idx on public.profiles using gin(full_name gin_trgm_ops);

-- Update statistics for better query planning
analyze public.profiles;