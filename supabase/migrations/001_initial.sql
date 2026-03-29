-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  job_title text,
  company text,
  bio text check (char_length(bio) <= 160),
  email text,
  phone text,
  website_url text,
  profile_photo_url text,
  logo_url text,
  username text unique,
  is_published boolean default false,
  is_approved boolean default false,
  created_at timestamptz default now()
);

-- Links table
create table public.links (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid references public.profiles(id) on delete cascade,
  label text not null,
  url text not null,
  link_type text check (link_type in ('website', 'social', 'booking', 'cta')) default 'website',
  sort_order int default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Design settings table
create table public.design_settings (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid references public.profiles(id) on delete cascade unique,
  color_primary text default '#0ea5e9',
  color_secondary text default '#0f172a',
  color_accent text default '#a855f7',
  background_id text default 'bg_dark_gradient',
  font_id text default 'font_inter',
  layout text default 'centered'
);

-- Analytics events table
create table public.analytics_events (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid references public.profiles(id) on delete cascade,
  event_type text check (event_type in ('page_view', 'link_click')),
  link_id uuid,
  referrer text,
  created_at timestamptz default now()
);

-- Subscriptions table
create table public.subscriptions (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid references public.profiles(id) on delete cascade unique,
  stripe_customer_id text,
  stripe_subscription_id text,
  plan text check (plan in ('individual', 'team', 'org')),
  status text check (status in ('active', 'past_due', 'canceled', 'pending')) default 'pending',
  setup_fee_paid boolean default false,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.links enable row level security;
alter table public.design_settings enable row level security;
alter table public.analytics_events enable row level security;
alter table public.subscriptions enable row level security;

-- Profiles policies
create policy "Users can view their own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update their own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert their own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Public profiles are viewable by all" on public.profiles for select using (is_published = true);

-- Links policies
create policy "Users can manage their own links" on public.links for all using (
  profile_id in (select id from public.profiles where id = auth.uid())
);
create policy "Public links viewable" on public.links for select using (
  profile_id in (select id from public.profiles where is_published = true)
);

-- Design settings policies
create policy "Users can manage their own design" on public.design_settings for all using (
  profile_id in (select id from public.profiles where id = auth.uid())
);
create policy "Public design viewable" on public.design_settings for select using (
  profile_id in (select id from public.profiles where is_published = true)
);

-- Analytics policies
create policy "Users can view their own analytics" on public.analytics_events for select using (
  profile_id in (select id from public.profiles where id = auth.uid())
);
create policy "Anyone can insert analytics" on public.analytics_events for insert with check (true);

-- Subscriptions policies
create policy "Users can view their own subscription" on public.subscriptions for select using (
  profile_id in (select id from public.profiles where id = auth.uid())
);
