-- Enable required extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- Custom types
create type user_role as enum ('client', 'talent', 'admin');
create type user_status as enum ('active', 'suspended', 'pending');
create type profile_visibility as enum ('public', 'private');
create type job_status as enum ('draft', 'open', 'paused', 'in_progress', 'completed', 'closed');
create type moderation_state as enum ('pending', 'approved', 'rejected', 'flagged');
create type proposal_status as enum ('draft', 'submitted', 'shortlisted', 'accepted', 'declined', 'withdrawn');
create type contract_status as enum ('active', 'awaiting_approval', 'completed', 'cancelled', 'disputed');
create type milestone_status as enum ('pending', 'submitted', 'approved', 'revision_requested', 'disputed');
create type transaction_status as enum ('pending', 'available', 'paid', 'failed', 'refunded');
create type transaction_type as enum ('payment', 'payout', 'refund', 'fee');
create type notification_type as enum (
  'proposal_received', 'proposal_accepted', 'proposal_declined', 'proposal_shortlisted',
  'invitation_received', 'invitation_accepted', 'invitation_declined',
  'milestone_submitted', 'milestone_approved', 'milestone_revision_requested',
  'message_received', 'contract_created', 'contract_completed', 'contract_disputed',
  'payment_received', 'payout_available', 'review_received', 'moderation_action',
  'support_ticket_update'
);

-- Profiles table (extends auth.users)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role user_role not null default 'talent',
  username text unique,
  full_name text not null,
  avatar_url text,
  country text,
  timezone text default 'UTC',
  language text default 'en' check (language in ('en', 'bn')),
  status user_status not null default 'active',
  is_verified boolean not null default false,
  profile_visibility profile_visibility not null default 'public',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Client profiles
create table client_profiles (
  id uuid primary key references profiles(id) on delete cascade,
  organization_name text,
  business_type text,
  website text,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Talent profiles
create table talent_profiles (
  id uuid primary key references profiles(id) on delete cascade,
  headline text,
  bio text,
  skills text[] default '{}',
  hourly_rate numeric(10,2),
  availability text default 'available' check (availability in ('available', 'busy', 'unavailable')),
  experience_level text check (experience_level in ('entry', 'intermediate', 'expert')),
  education text,
  certifications text[] default '{}',
  portfolio_url text,
  linkedin_url text,
  github_url text,
  is_agency boolean not null default false,
  agency_name text,
  agency_team_size integer,
  completion_score integer default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Categories
create table categories (
  id uuid primary key default gen_random_uuid(),
  name_en text not null,
  name_bn text not null,
  slug text unique not null,
  icon text,
  description_en text,
  description_bn text,
  job_count integer default 0,
  talent_count integer default 0,
  typical_rate_min numeric(10,2),
  typical_rate_max numeric(10,2),
  currency text default 'BDT' check (currency in ('BDT', 'USD')),
  is_active boolean not null default true,
  sort_order integer default 0,
  created_at timestamptz not null default now()
);

-- Jobs
create table jobs (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  description text not null,
  category_id uuid references categories(id) on delete set null,
  skills text[] default '{}',
  budget_type text not null check (budget_type in ('fixed', 'hourly')),
  budget_min numeric(10,2),
  budget_max numeric(10,2),
  experience_level text check (experience_level in ('entry', 'intermediate', 'expert')),
  timeline_days integer,
  timezone text,
  visibility text default 'public' check (visibility in ('public', 'private', 'invite_only')),
  status job_status not null default 'draft',
  moderation_state moderation_state not null default 'pending',
  moderation_reason text,
  views_count integer default 0,
  proposals_count integer default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz,
  closed_at timestamptz,
  constraint valid_budget check (
    (budget_type = 'fixed' and budget_min is not null and budget_min >= 0) or
    (budget_type = 'hourly' and budget_max is not null and budget_max >= 0)
  )
);

-- Job attachments
create table job_attachments (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references jobs(id) on delete cascade,
  file_path text not null,
  file_name text not null,
  file_size integer not null,
  mime_type text not null,
  created_at timestamptz not null default now()
);

-- Job invitations
create table job_invitations (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references jobs(id) on delete cascade,
  client_id uuid not null references profiles(id) on delete cascade,
  talent_id uuid not null references profiles(id) on delete cascade,
  message text,
  status text default 'pending' check (status in ('pending', 'accepted', 'declined', 'expired')),
  created_at timestamptz not null default now(),
  responded_at timestamptz
);

-- Saved talent (client saves)
create table saved_talent (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references profiles(id) on delete cascade,
  talent_id uuid not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(client_id, talent_id)
);

-- Saved jobs (talent saves)
create table saved_jobs (
  id uuid primary key default gen_random_uuid(),
  talent_id uuid not null references profiles(id) on delete cascade,
  job_id uuid not null references jobs(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(talent_id, job_id)
);

-- Services
create table services (
  id uuid primary key default gen_random_uuid(),
  talent_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  slug text unique not null,
  summary text not null,
  description text not null,
  category_id uuid references categories(id) on delete set null,
  tags text[] default '{}',
  delivery_days integer not null default 1,
  revisions_included integer not null default 1,
  status text not null default 'draft' check (status in ('draft', 'published', 'paused', 'archived')),
  cover_image text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);

-- Service packages
create table service_packages (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references services(id) on delete cascade,
  name text not null check (name in ('basic', 'standard', 'premium')),
  title text not null,
  description text not null,
  price numeric(10,2) not null,
  currency text default 'BDT' check (currency in ('BDT', 'USD')),
  delivery_days integer not null,
  revisions integer not null,
  features text[] default '{}',
  is_active boolean not null default true,
  sort_order integer default 0
);

-- Service media
create table service_media (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references services(id) on delete cascade,
  file_path text not null,
  file_type text not null check (file_type in ('image', 'video')),
  sort_order integer default 0,
  created_at timestamptz not null default now()
);

-- Portfolio items
create table portfolio_items (
  id uuid primary key default gen_random_uuid(),
  talent_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  description text,
  skills text[] default '{}',
  cover_image text,
  external_url text,
  is_published boolean not null default false,
  sort_order integer default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Proposals
create table proposals (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references jobs(id) on delete cascade,
  talent_id uuid not null references profiles(id) on delete cascade,
  cover_letter text not null,
  bid_amount numeric(10,2) not null,
  currency text default 'BDT' check (currency in ('BDT', 'USD')),
  delivery_days integer not null,
  attachment_path text,
  status proposal_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  submitted_at timestamptz,
  responded_at timestamptz,
  unique(job_id, talent_id)
);

-- Contracts
create table contracts (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null unique references jobs(id) on delete cascade,
  proposal_id uuid not null references proposals(id) on delete cascade,
  client_id uuid not null references profiles(id) on delete cascade,
  talent_id uuid not null references profiles(id) on delete cascade,
  agreed_amount numeric(10,2) not null,
  currency text default 'BDT' check (currency in ('BDT', 'USD')),
  status contract_status not null default 'active',
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Milestones
create table milestones (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid not null references contracts(id) on delete cascade,
  title text not null,
  description text,
  amount numeric(10,2) not null,
  currency text default 'BDT' check (currency in ('BDT', 'USD')),
  due_date timestamptz,
  status milestone_status not null default 'pending',
  submitted_at timestamptz,
  approved_at timestamptz,
  delivery_notes text,
  delivery_files text[] default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Conversations
create table conversations (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid unique references contracts(id) on delete cascade,
  client_id uuid not null references profiles(id) on delete cascade,
  talent_id uuid not null references profiles(id) on delete cascade,
  last_message_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique(contract_id)
);

-- One direct conversation per client/talent pair (contract conversations handled by unique(contract_id))
create unique index if not exists uniq_direct_conversation
  on conversations (client_id, talent_id) where contract_id is null;

-- Messages
create table messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  sender_id uuid not null references profiles(id) on delete cascade,
  message_text text,
  attachment_path text,
  attachment_name text,
  attachment_size integer,
  attachment_mime text,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- Notifications
create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  type notification_type not null,
  title text not null,
  body text not null,
  reference_id uuid,
  reference_type text,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- Transactions
create table transactions (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid references contracts(id) on delete set null,
  milestone_id uuid references milestones(id) on delete set null,
  user_id uuid not null references profiles(id) on delete cascade,
  provider text not null,
  provider_ref text,
  amount numeric(10,2) not null,
  currency text default 'BDT' check (currency in ('BDT', 'USD')),
  status transaction_status not null default 'pending',
  type transaction_type not null,
  is_demo boolean not null default true,
  metadata jsonb default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Reviews
create table reviews (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid not null references contracts(id) on delete cascade,
  reviewer_id uuid not null references profiles(id) on delete cascade,
  reviewee_id uuid not null references profiles(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  comment text not null check (char_length(comment) between 20 and 1000),
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  unique(contract_id, reviewer_id)
);

-- Support tickets
create table support_tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  subject text not null,
  description text not null,
  status text default 'open' check (status in ('open', 'in_progress', 'resolved', 'closed')),
  priority text default 'medium' check (priority in ('low', 'medium', 'high', 'urgent')),
  admin_response text,
  responded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- AI logs
create table ai_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  feature text not null,
  status text not null check (status in ('success', 'error', 'fallback')),
  prompt_summary text,
  tokens_estimate integer,
  cost_estimate numeric(10,6),
  created_at timestamptz not null default now()
);

-- Admin audit logs
create table admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid not null references profiles(id) on delete cascade,
  action text not null,
  entity_type text not null,
  entity_id uuid not null,
  reason text,
  metadata jsonb default '{}',
  created_at timestamptz not null default now()
);

-- Platform settings
create table platform_settings (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  value jsonb not null default '{}',
  description text,
  updated_at timestamptz not null default now()
);

-- Newsletter subscribers
create table newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  source text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Indexes
create index idx_profiles_role on profiles(role);
create index idx_profiles_username on profiles(username);
create index idx_profiles_status on profiles(status);
create index idx_jobs_owner on jobs(owner_id);
create index idx_jobs_status on jobs(status);
create index idx_jobs_moderation on jobs(moderation_state);
create index idx_jobs_category on jobs(category_id);
create index idx_jobs_skills on jobs using gin(skills);
create index idx_jobs_created on jobs(created_at desc);
create index idx_proposals_job on proposals(job_id);
create index idx_proposals_talent on proposals(talent_id);
create index idx_proposals_status on proposals(status);
create index idx_contracts_client on contracts(client_id);
create index idx_contracts_talent on contracts(talent_id);
create index idx_contracts_status on contracts(status);
create index idx_milestones_contract on milestones(contract_id);
create index idx_conversations_contract on conversations(contract_id);
create index idx_conversations_client on conversations(client_id);
create index idx_conversations_talent on conversations(talent_id);
create index idx_messages_conversation on messages(conversation_id);
create index idx_messages_created on messages(created_at desc);
create index idx_notifications_user on notifications(user_id);
create index idx_notifications_read on notifications(is_read);
create index idx_notifications_created on notifications(created_at desc);
create index idx_transactions_user on transactions(user_id);
create index idx_transactions_contract on transactions(contract_id);
create index idx_transactions_demo on transactions(is_demo);
create index idx_services_talent on services(talent_id);
create index idx_services_status on services(status);
create index idx_services_category on services(category_id);
create index idx_portfolio_talent on portfolio_items(talent_id);
create index idx_reviews_reviewee on reviews(reviewee_id);
create index idx_ai_logs_user on ai_logs(user_id);
create index idx_audit_logs_admin on admin_audit_logs(admin_id);
create index idx_audit_logs_entity on admin_audit_logs(entity_type, entity_id);

-- Updated at trigger
create or replace function update_updated_at_column()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

create trigger update_profiles_updated_at before update on profiles for each row execute function update_updated_at_column();
create trigger update_client_profiles_updated_at before update on client_profiles for each row execute function update_updated_at_column();
create trigger update_talent_profiles_updated_at before update on talent_profiles for each row execute function update_updated_at_column();
create trigger update_jobs_updated_at before update on jobs for each row execute function update_updated_at_column();
create trigger update_services_updated_at before update on services for each row execute function update_updated_at_column();
create trigger update_portfolio_items_updated_at before update on portfolio_items for each row execute function update_updated_at_column();
create trigger update_proposals_updated_at before update on proposals for each row execute function update_updated_at_column();
create trigger update_contracts_updated_at before update on contracts for each row execute function update_updated_at_column();
create trigger update_milestones_updated_at before update on milestones for each row execute function update_updated_at_column();
create trigger update_conversations_updated_at before update on conversations for each row execute function update_updated_at_column();
create trigger update_transactions_updated_at before update on transactions for each row execute function update_updated_at_column();
create trigger update_support_tickets_updated_at before update on support_tickets for each row execute function update_updated_at_column();
create trigger update_platform_settings_updated_at before update on platform_settings for each row execute function update_updated_at_column();

-- RLS Policies
alter table profiles enable row level security;
alter table client_profiles enable row level security;
alter table talent_profiles enable row level security;
alter table categories enable row level security;
alter table jobs enable row level security;
alter table job_attachments enable row level security;
alter table job_invitations enable row level security;
alter table saved_talent enable row level security;
alter table saved_jobs enable row level security;
alter table services enable row level security;
alter table service_packages enable row level security;
alter table service_media enable row level security;
alter table portfolio_items enable row level security;
alter table proposals enable row level security;
alter table contracts enable row level security;
alter table milestones enable row level security;
alter table conversations enable row level security;
alter table messages enable row level security;
alter table notifications enable row level security;
alter table transactions enable row level security;
alter table reviews enable row level security;
alter table support_tickets enable row level security;
alter table ai_logs enable row level security;
alter table admin_audit_logs enable row level security;
alter table platform_settings enable row level security;
alter table newsletter_subscribers enable row level security;

-- Security definer helper functions
create or replace function public.current_user_role()
returns user_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.current_user_is_active()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((select status = 'active' from public.profiles where id = auth.uid()), false)
$$;

revoke all on function public.current_user_role() from public;
grant execute on function public.current_user_role() to authenticated;

revoke all on function public.current_user_is_active() from public;
grant execute on function public.current_user_is_active() to authenticated;

-- Profile policies
create policy "Public profiles are viewable" on profiles for select using (
  profile_visibility = 'public' and status = 'active'
);
create policy "Users can view own profile" on profiles for select using (id = auth.uid());
create policy "Users can update own profile" on profiles for update using (
  id = auth.uid() and current_user_is_active()
) with check (id = auth.uid() and current_user_is_active());
create policy "Profile creation via trigger" on profiles for insert with check (false);

-- Client profiles
create policy "Client profiles viewable by owner" on client_profiles for select using (id = auth.uid());
create policy "Client profiles manageable by owner" on client_profiles for all using (id = auth.uid()) with check (id = auth.uid());

-- Talent profiles
create policy "Public talent profiles viewable" on talent_profiles for select using (
  exists (select 1 from profiles where id = talent_profiles.id and profile_visibility = 'public' and status = 'active')
);
create policy "Talent profiles manageable by owner" on talent_profiles for all using (id = auth.uid()) with check (id = auth.uid());

-- Categories
create policy "Categories are public" on categories for select using (is_active = true);

-- Jobs
create policy "Public jobs viewable" on jobs for select using (
  status = 'open' and moderation_state = 'approved' and visibility = 'public'
);
create policy "Job owners can view all their jobs" on jobs for select using (owner_id = auth.uid());
create policy "Job owners can insert drafts" on jobs for insert with check (
  owner_id = auth.uid() and current_user_role() = 'client' and current_user_is_active()
);
create policy "Job owners can update own jobs" on jobs for update using (
  owner_id = auth.uid() and current_user_is_active()
) with check (owner_id = auth.uid() and current_user_is_active());

-- Job attachments
create policy "Job owners manage attachments" on job_attachments for all using (
  exists (select 1 from jobs where id = job_attachments.job_id and owner_id = auth.uid())
);

-- Job invitations
create policy "Clients can create invitations" on job_invitations for insert with check (
  client_id = auth.uid() and current_user_role() = 'client' and current_user_is_active()
);
create policy "Talent can view own invitations" on job_invitations for select using (talent_id = auth.uid());
create policy "Clients can view sent invitations" on job_invitations for select using (client_id = auth.uid());

-- Saved talent
create policy "Clients manage saved talent" on saved_talent for all using (client_id = auth.uid()) with check (client_id = auth.uid());

-- Saved jobs
create policy "Talent manages saved jobs" on saved_jobs for all using (talent_id = auth.uid()) with check (talent_id = auth.uid());

-- Services
create policy "Published services public" on services for select using (status = 'published');
create policy "Talent manages own services" on services for all using (talent_id = auth.uid()) with check (talent_id = auth.uid());

-- Service packages
create policy "Service packages follow service" on service_packages for select using (
  exists (select 1 from services where id = service_packages.service_id and status = 'published')
);
create policy "Talent manages own packages" on service_packages for all using (
  exists (select 1 from services where id = service_packages.service_id and talent_id = auth.uid())
);

-- Service media
create policy "Service media follows service" on service_media for select using (
  exists (select 1 from services where id = service_media.service_id and status = 'published')
);
create policy "Talent manages own service media" on service_media for all using (
  exists (select 1 from services where id = service_media.service_id and talent_id = auth.uid())
);

-- Portfolio items
create policy "Published portfolio public" on portfolio_items for select using (is_published = true);
create policy "Talent manages own portfolio" on portfolio_items for all using (talent_id = auth.uid()) with check (talent_id = auth.uid());

-- Proposals
create policy "Talent can view own proposals" on proposals for select using (talent_id = auth.uid());
create policy "Job owners can view proposals on their jobs" on proposals for select using (
  exists (select 1 from jobs where id = proposals.job_id and owner_id = auth.uid())
);
create policy "Talent can insert proposals" on proposals for insert with check (
  talent_id = auth.uid() and current_user_role() = 'talent' and current_user_is_active() and
  exists (select 1 from jobs where id = job_id and status = 'open' and moderation_state = 'approved')
);
create policy "Talent can update own draft proposals" on proposals for update using (
  talent_id = auth.uid() and status = 'draft'
) with check (talent_id = auth.uid());

-- Contracts
create policy "Contract participants can view" on contracts for select using (
  client_id = auth.uid() or talent_id = auth.uid()
);

-- Milestones
create policy "Contract participants can view milestones" on milestones for select using (
  exists (select 1 from contracts where id = milestones.contract_id and (client_id = auth.uid() or talent_id = auth.uid()))
);
create policy "Client manages milestones" on milestones for all using (
  exists (select 1 from contracts where id = milestones.contract_id and client_id = auth.uid() and status = 'active')
) with check (
  exists (select 1 from contracts where id = milestones.contract_id and client_id = auth.uid() and status = 'active')
);
create policy "Talent submits deliveries" on milestones for update using (
  exists (select 1 from contracts where id = milestones.contract_id and talent_id = auth.uid() and status = 'active')
  and status = 'pending'
) with check (
  exists (select 1 from contracts where id = milestones.contract_id and talent_id = auth.uid() and status = 'active')
);

-- Conversations
create policy "Participants can view conversations" on conversations for select using (
  client_id = auth.uid() or talent_id = auth.uid()
);
create policy "Participants can insert messages" on conversations for insert with check (
  client_id = auth.uid() or talent_id = auth.uid()
);

-- Messages
create policy "Participants can view messages" on messages for select using (
  exists (select 1 from conversations where id = messages.conversation_id and (client_id = auth.uid() or talent_id = auth.uid()))
);
create policy "Participants can send messages" on messages for insert with check (
  sender_id = auth.uid() and
  exists (select 1 from conversations where id = conversation_id and (client_id = auth.uid() or talent_id = auth.uid()))
);

-- Notifications
create policy "Users view own notifications" on notifications for select using (user_id = auth.uid());
create policy "Users can update own notifications" on notifications for update using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Transactions
create policy "Users view own transactions" on transactions for select using (user_id = auth.uid());

-- Reviews
create policy "Published reviews public" on reviews for select using (is_published = true);
create policy "Reviewers can manage own reviews" on reviews for all using (reviewer_id = auth.uid()) with check (reviewer_id = auth.uid());

-- Support tickets
create policy "Users manage own tickets" on support_tickets for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- AI logs (admin only)
create policy "Users view own AI logs" on ai_logs for select using (user_id = auth.uid());

-- Admin audit logs (admin only via server)
create policy "Admin audit logs server only" on admin_audit_logs for all using (false);

-- Platform settings (public read)
create policy "Platform settings public read" on platform_settings for select using (true);

-- Newsletter subscribers (insert only)
create policy "Newsletter insert" on newsletter_subscribers for insert with check (true);