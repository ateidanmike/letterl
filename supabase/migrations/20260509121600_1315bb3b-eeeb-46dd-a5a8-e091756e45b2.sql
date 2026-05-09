
-- Profiles table
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "Users view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email));
  return new;
end;
$$;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Brands (one per user)
create table public.brands (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  company_name text not null default '',
  phone text default '',
  email text default '',
  website text default '',
  address text default '',
  logo_path text,
  primary_color text not null default '#1E40AF',
  accent_color text not null default '#16A34A',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.brands enable row level security;
create policy "Users manage own brand" on public.brands for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Letterheads
create table public.letterheads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'Untitled',
  template text not null default 'classic',
  font_family text not null default 'Inter',
  font_size int not null default 11,
  primary_color text not null default '#1E40AF',
  accent_color text not null default '#16A34A',
  letter_date date,
  recipient text default '',
  subject text default '',
  body text default '',
  signature_name text default '',
  signature_title text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.letterheads enable row level security;
create policy "Users manage own letterheads" on public.letterheads for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index letterheads_user_idx on public.letterheads(user_id, updated_at desc);

-- updated_at trigger
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;
create trigger brands_touch before update on public.brands for each row execute function public.touch_updated_at();
create trigger letterheads_touch before update on public.letterheads for each row execute function public.touch_updated_at();

-- Storage bucket for logos (private)
insert into storage.buckets (id, name, public) values ('logos', 'logos', false)
on conflict (id) do nothing;

create policy "Users read own logos" on storage.objects for select
  using (bucket_id = 'logos' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "Users upload own logos" on storage.objects for insert
  with check (bucket_id = 'logos' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "Users update own logos" on storage.objects for update
  using (bucket_id = 'logos' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "Users delete own logos" on storage.objects for delete
  using (bucket_id = 'logos' and auth.uid()::text = (storage.foldername(name))[1]);
