-- Adult visitor / new-member tracking table
-- Mirrors the shape of a kids-check-in style record, adapted for
-- adult guests: who they are, when they visited, and where they are
-- in the follow-up process.

create extension if not exists "pgcrypto"; -- for gen_random_uuid()

create type adult_visitor_follow_up_status as enum (
  'new',
  'contacted',
  'scheduled',
  'completed',
  'no_response'
);

create table if not exists adult_visitors (
  id                uuid primary key default gen_random_uuid(),

  first_name        text not null,
  last_name         text not null,
  email             text,
  phone             text,

  visit_date        date not null default current_date,
  first_time_guest  boolean not null default true,

  address           text,
  how_heard         text,           -- e.g. friend/family, website, social media, drove by, event
  interested_in     text[] default '{}', -- e.g. {membership, small_groups, volunteering, prayer}

  assigned_to       text,           -- staff/greeter responsible for follow-up
  follow_up_status  adult_visitor_follow_up_status not null default 'new',
  notes             text,

  created_at        timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create index if not exists adult_visitors_visit_date_idx on adult_visitors (visit_date desc);
create index if not exists adult_visitors_follow_up_status_idx on adult_visitors (follow_up_status);

-- keep updated_at current on every row change
create or replace function set_adult_visitors_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_adult_visitors_updated_at on adult_visitors;
create trigger trg_adult_visitors_updated_at
  before update on adult_visitors
  for each row
  execute function set_adult_visitors_updated_at();
