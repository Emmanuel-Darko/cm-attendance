-- Announcements / News table for admin-posted church announcements

create extension if not exists "pgcrypto";

create table if not exists announcements (
  id          uuid primary key default gen_random_uuid(),

  title       text not null,
  content     text not null,
  image_url   text,
  author_id   uuid references teachers(id) on delete set null,

  published   boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists announcements_published_idx on announcements (published);
create index if not exists announcements_created_at_idx on announcements (created_at desc);

-- keep updated_at current on every row change
create or replace function set_announcements_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_announcements_updated_at on announcements;
create trigger trg_announcements_updated_at
  before update on announcements
  for each row
  execute function set_announcements_updated_at();
