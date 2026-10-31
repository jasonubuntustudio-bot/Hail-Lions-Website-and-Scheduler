-- Hail Lions — quote-first scheduler
-- Run in Supabase SQL Editor (safe to re-run with IF NOT EXISTS / drops below)

create extension if not exists "pgcrypto";

-- Drop old check so we can expand statuses (if table exists)
do $$ begin
  alter table public.bookings drop constraint if exists bookings_status_check;
exception when undefined_table then null;
end $$;

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  status text not null default 'quote_requested',
  confirmation_code text unique,

  full_name text not null,
  phone text not null,
  email text,

  service_type text,

  vehicle_year text,
  vehicle_make text,
  vehicle_model text,
  vehicle_color text,
  vehicle_vin text,

  address text,
  city text,
  zip text,

  is_insurance boolean not null default false,
  claim_number text,
  adjuster_name text,
  adjuster_phone text,

  notes text,
  photo_count int not null default 0,

  -- Quote (set by admin after reviewing photos)
  quote_amount_cents int,
  quote_notes text,
  quoted_at timestamptz,
  quote_approved_at timestamptz,

  -- Schedule (only after quote approved)
  scheduled_date date,
  scheduled_window text,
  scheduled_at timestamptz
);

-- Expand status values
alter table public.bookings drop constraint if exists bookings_status_check;
alter table public.bookings add constraint bookings_status_check
  check (status in (
    'quote_requested',
    'quoted',
    'quote_approved',
    'scheduled',
    'in_progress',
    'completed',
    'cancelled',
    'declined'
  ));

-- Add columns if table already existed without them
alter table public.bookings add column if not exists updated_at timestamptz not null default now();
alter table public.bookings add column if not exists quote_amount_cents int;
alter table public.bookings add column if not exists quote_notes text;
alter table public.bookings add column if not exists quoted_at timestamptz;
alter table public.bookings add column if not exists quote_approved_at timestamptz;
alter table public.bookings add column if not exists scheduled_date date;
alter table public.bookings add column if not exists scheduled_window text;
alter table public.bookings add column if not exists scheduled_at timestamptz;

create table if not exists public.booking_photos (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  storage_path text not null,
  public_url text,
  created_at timestamptz not null default now()
);

-- Admin-defined open slots (customers only see these after approving a quote)
create table if not exists public.availability_slots (
  id uuid primary key default gen_random_uuid(),
  slot_date date not null,
  time_window text not null,
  is_open boolean not null default true,
  max_jobs int not null default 1,
  notes text,
  created_at timestamptz not null default now(),
  unique (slot_date, time_window)
);

create index if not exists bookings_created_at_idx on public.bookings (created_at desc);
create index if not exists bookings_status_idx on public.bookings (status);
create index if not exists bookings_code_idx on public.bookings (confirmation_code);
create index if not exists booking_photos_booking_id_idx on public.booking_photos (booking_id);
create index if not exists availability_slots_date_idx on public.availability_slots (slot_date);

alter table public.bookings enable row level security;
alter table public.booking_photos enable row level security;
alter table public.availability_slots enable row level security;

drop policy if exists "Anyone can create a booking" on public.bookings;
create policy "Anyone can create a booking"
  on public.bookings for insert
  to anon, authenticated
  with check (true);

-- Public can read open slots (for scheduling after quote approval)
drop policy if exists "Anyone can read open slots" on public.availability_slots;
create policy "Anyone can read open slots"
  on public.availability_slots for select
  to anon, authenticated
  using (is_open = true and slot_date >= current_date);

-- Storage bucket: create "booking-photos" (private) in Dashboard → Storage

-- ========== CRM ==========
create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  full_name text not null,
  phone text not null,
  email text,
  preferred_contact text default 'phone', -- phone | sms | email
  address text,
  city text,
  zip text,
  tags text[] default '{}',
  notes text,
  last_contact_at timestamptz,
  next_follow_up_at date,
  source text default 'website'
);

-- Unique phone normalized later in app; soft unique index
create unique index if not exists customers_phone_uidx on public.customers (phone);
create index if not exists customers_name_idx on public.customers (full_name);
create index if not exists customers_follow_up_idx on public.customers (next_follow_up_at);

alter table public.bookings add column if not exists customer_id uuid references public.customers(id);

create table if not exists public.customer_interactions (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  booking_id uuid references public.bookings(id) on delete set null,
  created_at timestamptz not null default now(),
  channel text not null default 'note', -- note | call | sms | email | quote | schedule | visit
  direction text not null default 'outbound', -- outbound | inbound | system
  subject text,
  body text,
  created_by text default 'admin'
);

create index if not exists customer_interactions_customer_idx
  on public.customer_interactions (customer_id, created_at desc);

alter table public.customers enable row level security;
alter table public.customer_interactions enable row level security;
-- Admin uses service role; no public policies on CRM tables

-- E-sign repair authorization (quote accept)
alter table public.bookings add column if not exists auth_signed_at timestamptz;
alter table public.bookings add column if not exists auth_signer_name text;
alter table public.bookings add column if not exists auth_storage_path text;
alter table public.bookings add column if not exists insurance_company text;
alter table public.bookings add column if not exists vehicle_color text;
alter table public.bookings add column if not exists vin text;
