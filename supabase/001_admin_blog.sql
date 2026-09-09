-- Safe to run on a project that already has public.profiles.
-- Do not put service_role credentials in the site.
do $$ begin
  create type public.user_role as enum ('reader', 'admin');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.post_status as enum ('draft', 'published');
exception when duplicate_object then null;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.user_role not null default 'reader',
  display_name text,
  created_at timestamptz not null default now()
);

alter table public.profiles add column if not exists role public.user_role not null default 'reader';
alter table public.profiles add column if not exists display_name text;

create table if not exists public.categories (
  id bigint generated always as identity primary key,
  name text not null unique,
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  created_at timestamptz not null default now()
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 3 and 160),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  excerpt text not null check (char_length(excerpt) between 20 and 320),
  content text not null,
  cover_image_url text,
  category_id bigint references public.categories(id) on delete set null,
  author_id uuid not null references public.profiles(id),
  status public.post_status not null default 'draft',
  published_at timestamptz,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint published_posts_have_date check (status = 'draft' or published_at is not null)
);

create index if not exists posts_public_index on public.posts (status, published_at desc) where deleted_at is null;
create index if not exists posts_category_index on public.posts (category_id) where deleted_at is null;

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at before update on public.posts
for each row execute procedure public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', new.email));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users for each row execute procedure public.handle_new_user();

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.posts enable row level security;

drop policy if exists "Users can see their own profile" on public.profiles;
drop policy if exists "Admins can manage categories" on public.categories;
drop policy if exists "Anyone can read categories" on public.categories;
drop policy if exists "Anyone can read published posts" on public.posts;
drop policy if exists "Admins can manage posts" on public.posts;
create policy "Users can see their own profile" on public.profiles for select using (id = auth.uid());
create policy "Admins can manage categories" on public.categories for all using (public.is_admin()) with check (public.is_admin());
create policy "Anyone can read categories" on public.categories for select using (true);
create policy "Anyone can read published posts" on public.posts for select using (status = 'published' and deleted_at is null);
create policy "Admins can manage posts" on public.posts for all using (public.is_admin()) with check (public.is_admin());

insert into storage.buckets (id, name, public) values ('post-images', 'post-images', true)
on conflict (id) do nothing;
drop policy if exists "Anyone can view post images" on storage.objects;
drop policy if exists "Admins can upload post images" on storage.objects;
drop policy if exists "Admins can update post images" on storage.objects;
drop policy if exists "Admins can delete post images" on storage.objects;
create policy "Anyone can view post images" on storage.objects for select using (bucket_id = 'post-images');
create policy "Admins can upload post images" on storage.objects for insert with check (bucket_id = 'post-images' and public.is_admin());
create policy "Admins can update post images" on storage.objects for update using (bucket_id = 'post-images' and public.is_admin()) with check (bucket_id = 'post-images' and public.is_admin());
create policy "Admins can delete post images" on storage.objects for delete using (bucket_id = 'post-images' and public.is_admin());

-- Use the dashboard (or a secure server) to create the first Auth user, then promote it:
-- update public.profiles set role = 'admin' where id = '<auth-user-uuid>';
-- Schedule this in Supabase Cron if permanent removal after 30 days is desired:
-- delete from public.posts where deleted_at < now() - interval '30 days';
