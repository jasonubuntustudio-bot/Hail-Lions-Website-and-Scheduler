-- Hail Lions booking schema
-- Run this in Supabase SQL Editor (Dashboard → SQL → New query)

-- Bookings / job requests from /book
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status text not null default 'new'
    check (status in ('new', 'contacted', 'scheduled', 'in_progress', 'completed', 'cancelled')),

  -- Contact
  full_name text not null,
  phone text not null,
  email text,

  -- Service
  service_type text,
  preferred_date date,
  preferred_window text,

  -- Vehicle
  vehicle_year text,
  vehicle_make text,
  vehicle_model text,
  vehicle_color text,
  vehicle_vin text,

  -- Location
  address text,
  city text,
  zip text,

  -- Insurance (optional)
  is_insurance boolean not null default false,
  claim_number text,
  adjuster_name text,
  adjuster_phone text,

  notes text,
  photo_count int not null default 0
);

-- Photo metadata (files live in Storage bucket "booking-photos")
create table if not exists public.booking_photos (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  storage_path text not null,
  created_at timestamptz not null default now()
);

create index if not exists bookings_created_at_idx on public.bookings (created_at desc);
create index if not exists bookings_status_idx on public.bookings (status);
create index if not exists booking_photos_booking_id_idx on public.booking_photos (booking_id);

-- RLS: public insert for new bookings; no public read
alter table public.bookings enable row level security;
alter table public.booking_photos enable row level security;

-- Allow anonymous insert of bookings (form submissions)
create policy "Anyone can create a booking"
  on public.bookings for insert
  to anon, authenticated
  with check (true);

-- Service role bypasses RLS for admin reads (dashboard / API)

-- Storage: create a public or private bucket named "booking-photos" in the dashboard.
-- Recommended: private bucket; upload via service role from API route.
