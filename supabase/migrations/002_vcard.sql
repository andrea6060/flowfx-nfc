create table public.vcards (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid references public.profiles(id) on delete cascade unique,
  first_name text,
  last_name text,
  title text,
  company text,
  suite text,
  email_primary text,
  email_secondary text,
  phone_cell text,
  phone_office text,
  photo_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.vcards enable row level security;
create policy "Users can manage their own vcard" on public.vcards for all using (
  profile_id in (select id from public.profiles where id = auth.uid())
) with check (
  profile_id in (select id from public.profiles where id = auth.uid())
);
create policy "Public vcards viewable" on public.vcards for select using (
  profile_id in (select id from public.profiles where is_published = true)
);
