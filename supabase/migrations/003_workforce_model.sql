-- ============================================================================
-- Galaxy Workforce v8.0 — Workforce Model (Vision Restoration Addendum)
-- Migration 003: extend talent_profiles with worker-identity fields
-- Apply in Supabase SQL Editor (Windows CLI cannot run migrations).
-- ============================================================================

alter table public.talent_profiles
  add column if not exists worker_meta jsonb default '{}'::jsonb,
  add column if not exists primary_occupation text,
  add column if not exists trade text,
  add column if not exists experience_years integer default 0,
  add column if not exists service_radius_km integer default 10,
  add column if not exists own_vehicle boolean default false,
  add column if not exists own_tools boolean default false,
  add column if not exists emergency_available boolean default false,
  add column if not exists available_now boolean default false,
  add column if not exists can_travel boolean default true,
  add column if not exists max_travel_km integer default 25,
  add column if not exists languages text[] default array['en','bn'],
  add column if not exists worker_status text default 'available'
    check (worker_status in ('available','busy','on_job','offline','vacation','emergency_only','appointment_only')),
  add column if not exists employment_types text[] default array['one_time','hourly'],
  add column if not exists warranty_offered text default 'none'
    check (warranty_offered in ('none','7d','15d','30d')),
  add column if not exists team_member boolean default false,
  add column if not exists is_business boolean default false,
  add column if not exists business_name text,
  add column if not exists badges text[] default '{}';

create index if not exists idx_talent_occupation on public.talent_profiles (primary_occupation);
create index if not exists idx_talent_status on public.talent_profiles (worker_status);
create index if not exists idx_talent_emergency on public.talent_profiles (emergency_available);
