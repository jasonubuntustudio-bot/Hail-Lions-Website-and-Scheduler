-- Run in Supabase SQL Editor
alter table public.bookings add column if not exists auth_signed_at timestamptz;
alter table public.bookings add column if not exists auth_signer_name text;
alter table public.bookings add column if not exists auth_storage_path text;
alter table public.bookings add column if not exists insurance_company text;
alter table public.bookings add column if not exists vehicle_color text;
alter table public.bookings add column if not exists vin text;
