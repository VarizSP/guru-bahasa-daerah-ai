create extension if not exists pgcrypto;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'app_role') then
    create type app_role as enum ('guest', 'learner', 'contributor', 'admin');
  end if;
end $$;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique references auth.users(id) on delete cascade,
  full_name text not null default 'Learner',
  role app_role not null default 'learner',
  xp int not null default 0,
  streak int not null default 0,
  badges text[] not null default '{}'::text[],
  created_at timestamptz not null default now()
);

create table if not exists public.scenarios (
  id text primary key,
  title text not null,
  region text not null,
  language text not null,
  politeness_target text not null,
  context text not null,
  difficulty text not null check (difficulty in ('beginner', 'intermediate', 'advanced'))
);

create table if not exists public.chat_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  scenario_id text not null references public.scenarios(id) on delete cascade,
  turns jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_profiles_auth_user_id on public.profiles(auth_user_id);
create index if not exists idx_chat_history_user_id on public.chat_history(user_id);
create index if not exists idx_chat_history_scenario_id on public.chat_history(scenario_id);

alter table public.profiles enable row level security;
alter table public.scenarios enable row level security;
alter table public.chat_history enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles for select
to authenticated
using (auth.uid() = auth_user_id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles for update
to authenticated
using (auth.uid() = auth_user_id)
with check (auth.uid() = auth_user_id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles for insert
to authenticated
with check (auth.uid() = auth_user_id);

drop policy if exists "scenarios_public_read" on public.scenarios;
create policy "scenarios_public_read"
on public.scenarios for select
to anon, authenticated
using (true);

drop policy if exists "chat_history_select_own" on public.chat_history;
create policy "chat_history_select_own"
on public.chat_history for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "chat_history_insert_own" on public.chat_history;
create policy "chat_history_insert_own"
on public.chat_history for insert
to authenticated
with check (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (auth_user_id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1), 'Learner'),
    'learner'
  )
  on conflict (auth_user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

insert into public.scenarios (id, title, region, language, politeness_target, context, difficulty)
values
  ('pasar-beringharjo', 'Nawar Harga di Pasar Beringharjo', 'Yogyakarta', 'Jawa', 'Krama', 'Berbicara dengan pedagang lebih tua.', 'beginner'),
  ('sungkeman-keluarga', 'Sungkeman Lebaran', 'Jawa Tengah', 'Jawa', 'Krama Inggil', 'Meminta maaf kepada orang tua.', 'intermediate'),
  ('warung-sunda', 'Pesan Makan di Warung Sunda', 'Bandung', 'Sunda', 'Lemes', 'Memesan makanan dengan sopan.', 'beginner')
on conflict (id) do update
set
  title = excluded.title,
  region = excluded.region,
  language = excluded.language,
  politeness_target = excluded.politeness_target,
  context = excluded.context,
  difficulty = excluded.difficulty;
