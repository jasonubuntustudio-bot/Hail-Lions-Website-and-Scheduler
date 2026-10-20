-- Hail Lions booking schema
-- Run in Supabase SQL Editor

create extension if not exists "pgcrypto";

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status text not null default 'new'
    check (status in ('new', 'contacted', 'scheduled', 'in_progress', 'completed', 'cancelled')),
  confirmation_code text unique,

  full_name text not null,
  phone text not null,
  email text,

  service_type text,
  preferred_date date,
  preferred_window text,

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
  photo_count int not null default 0
);

create table if not exists public.booking_photos (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  storage_path text not null,
  public_url text,
  created_at timestamptz not null default now()
);

create index if not exists bookings_created_at_idx on public.bookings (created_at desc);
create index if not exists bookings_status_idx on public.bookings (status);
create index if not exists bookings_code_idx on public.bookings (confirmation_code);
create index if not exists booking_photos_booking_id_idx on public.booking_photos (booking_id);

alter table public.bookings enable row level security;
alter table public.booking_photos enable row level security;

drop policy if exists "Anyone can create a booking" on public.bookings;
create policy "Anyone can create a booking"
  on public.bookings for insert
  to anon, authenticated
  with check (true);

-- Storage bucket: create "booking-photos" (private) in Dashboard → Storage
