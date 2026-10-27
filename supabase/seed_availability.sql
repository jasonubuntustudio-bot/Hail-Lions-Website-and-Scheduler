-- Hail Lions availability: next 8 weeks
-- Mon–Fri: 8:00 AM, 11:00 AM, 3:00 PM
-- Saturday: 8:00 AM, 11:00 AM
-- Sunday: none

with days as (
  select (current_date + g)::date as d
  from generate_series(0, 55) as g
),
planned as (
  select
    d.d as slot_date,
    w.window as time_window
  from days d
  cross join lateral (
    select unnest(
      case extract(dow from d.d)::int
        when 0 then array[]::text[]                         -- Sunday closed
        when 6 then array['8:00 AM', '11:00 AM']            -- Saturday
        else array['8:00 AM', '11:00 AM', '3:00 PM']        -- Mon–Fri
      end
    ) as window
  ) w
)
insert into public.availability_slots (slot_date, time_window, is_open, max_jobs)
select slot_date, time_window, true, 1
from planned
on conflict (slot_date, time_window) do update
  set is_open = true,
      max_jobs = excluded.max_jobs;

-- Quick check
select
  slot_date,
  extract(dow from slot_date) as dow,
  time_window,
  is_open
from public.availability_slots
where slot_date >= current_date
order by slot_date, time_window
limit 40;
