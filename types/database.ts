export type UserRole = 'client' | 'talent' | 'admin';
export type UserStatus = 'active' | 'suspended' | 'pending';
export type ProfileVisibility = 'public' | 'private';

export interface Profile {
  id: string;
  role: UserRole;
  username: string;
  full_name: string;
  avatar_url: string | null;
  country: string | null;
  timezone: string | null;
  language: 'en' | 'bn';
  status: UserStatus;
  is_verified: boolean;
  profile_visibility: ProfileVisibility;
  created_at: string;
  updated_at: string;
}

export interface ClientProfile {
  id: string;
  organization_name: string | null;
  business_type: string | null;
  website: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface TalentProfile {
  id: string;
  headline: string | null;
  bio: string | null;
  skills: string[];
  hourly_rate: number | null;
  availability: 'available' | 'busy' | 'unavailable';
  experience_level: 'entry' | 'intermediate' | 'expert' | null;
  education: string | null;
  certifications: string[];
  portfolio_url: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  is_agency: boolean;
  agency_name: string | null;
  agency_team_size: number | null;
  completion_score: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name_en: string;
  name_bn: string;
  slug: string;
  icon: string | null;
  description_en: string | null;
  description_bn: string | null;
  job_count: number;
  talent_count: number;
  typical_rate_min: number | null;
  typical_rate_max: number | null;
  currency: 'BDT' | 'USD';
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export interface Job {
  id: string;
  owner_id: string;
  title: string;
  description: string;
  category_id: string | null;
  skills: string[];
  budget_type: 'fixed' | 'hourly';
  budget_min: number | null;
  budget_max: number | null;
  experience_level: 'entry' | 'intermediate' | 'expert' | null;
  timeline_days: number | null;
  timezone: string | null;
  visibility: 'public' | 'private' | 'invite_only';
  status: 'draft' | 'open' | 'paused' | 'in_progress' | 'completed' | 'closed';
  moderation_state: 'pending' | 'approved' | 'rejected' | 'flagged';
  moderation_reason: string | null;
  views_count: number;
  proposals_count: number;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  closed_at: string | null;
}

export interface JobAttachment {
  id: string;
  job_id: string;
  file_path: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  created_at: string;
}

export interface JobInvitation {
  id: string;
  job_id: string;
  client_id: string;
  talent_id: string;
  message: string | null;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  created_at: string;
  responded_at: string | null;
}

export interface Service {
  id: string;
  talent_id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  category_id: string | null;
  tags: string[];
  delivery_days: number;
  revisions_included: number;
  status: 'draft' | 'published' | 'paused' | 'archived';
  cover_image: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export interface ServicePackage {
  id: string;
  service_id: string;
  name: 'basic' | 'standard' | 'premium';
  title: string;
  description: string;
  price: number;
  currency: 'BDT' | 'USD';
  delivery_days: number;
  revisions: number;
  features: string[];
  is_active: boolean;
  sort_order: number;
}

export interface ServiceMedia {
  id: string;
  service_id: string;
  file_path: string;
  file_type: 'image' | 'video';
  sort_order: number;
  created_at: string;
}

export interface PortfolioItem {
  id: string;
  talent_id: string;
  title: string;
  description: string | null;
  skills: string[];
  cover_image: string | null;
  external_url: string | null;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Proposal {
  id: string;
  job_id: string;
  talent_id: string;
  cover_letter: string;
  bid_amount: number;
  currency: 'BDT' | 'USD';
  delivery_days: number;
  attachment_path: string | null;
  status: 'draft' | 'submitted' | 'shortlisted' | 'accepted' | 'declined' | 'withdrawn';
  created_at: string;
  updated_at: string;
  submitted_at: string | null;
  responded_at: string | null;
}

export interface Contract {
  id: string;
  job_id: string;
  proposal_id: string;
  client_id: string;
  talent_id: string;
  agreed_amount: number;
  currency: 'BDT' | 'USD';
  status: 'active' | 'awaiting_approval' | 'completed' | 'cancelled' | 'disputed';
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Milestone {
  id: string;
  contract_id: string;
  title: string;
  description: string | null;
  amount: number;
  currency: 'BDT' | 'USD';
  due_date: string | null;
  status: 'pending' | 'submitted' | 'approved' | 'revision_requested' | 'disputed';
  submitted_at: string | null;
  approved_at: string | null;
  delivery_notes: string | null;
  delivery_files: string[];
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: string;
  contract_id: string | null;
  client_id: string;
  talent_id: string;
  last_message_at: string;
  created_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  message_text: string | null;
  attachment_path: string | null;
  attachment_name: string | null;
  attachment_size: number | null;
  attachment_mime: string | null;
  is_read: boolean;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string;
  reference_id: string | null;
  reference_type: string | null;
  is_read: boolean;
  created_at: string;
}

export interface Transaction {
  id: string;
  contract_id: string | null;
  milestone_id: string | null;
  user_id: string;
  provider: string;
  provider_ref: string | null;
  amount: number;
  currency: 'BDT' | 'USD';
  status: 'pending' | 'available' | 'paid' | 'failed' | 'refunded';
  type: 'payment' | 'payout' | 'refund' | 'fee';
  is_demo: boolean;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  contract_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  comment: string;
  is_published: boolean;
  created_at: string;
}

export interface SupportTicket {
  id: string;
  user_id: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  admin_response: string | null;
  responded_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AILog {
  id: string;
  user_id: string;
  feature: string;
  status: 'success' | 'error' | 'fallback';
  prompt_summary: string;
  tokens_estimate: number | null;
  cost_estimate: number | null;
  created_at: string;
}

export interface AdminAuditLog {
  id: string;
  admin_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  reason: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface PlatformSettings {
  id: string;
  key: string;
  value: Record<string, unknown>;
  description: string | null;
  updated_at: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  source: string | null;
  is_active: boolean;
  created_at: string;
}

export type Database = {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Omit<Profile, 'created_at' | 'updated_at'>; Update: Partial<Profile> };
      client_profiles: { Row: ClientProfile; Insert: Omit<ClientProfile, 'created_at' | 'updated_at'>; Update: Partial<ClientProfile> };
      talent_profiles: { Row: TalentProfile; Insert: Omit<TalentProfile, 'created_at' | 'updated_at'>; Update: Partial<TalentProfile> };
      categories: { Row: Category; Insert: Omit<Category, 'created_at'>; Update: Partial<Category> };
      jobs: { Row: Job; Insert: Omit<Job, 'created_at' | 'updated_at' | 'views_count' | 'proposals_count'>; Update: Partial<Job> };
      job_attachments: { Row: JobAttachment; Insert: Omit<JobAttachment, 'created_at'>; Update: Partial<JobAttachment> };
      job_invitations: { Row: JobInvitation; Insert: Omit<JobInvitation, 'created_at'>; Update: Partial<JobInvitation> };
      saved_talent: { Row: { id: string; client_id: string; talent_id: string; created_at: string }; Insert: { client_id: string; talent_id: string }; Update: {} };
      saved_jobs: { Row: { id: string; talent_id: string; job_id: string; created_at: string }; Insert: { talent_id: string; job_id: string }; Update: {} };
      services: { Row: Service; Insert: Omit<Service, 'created_at' | 'updated_at'>; Update: Partial<Service> };
      service_packages: { Row: ServicePackage; Insert: Omit<ServicePackage, 'id'>; Update: Partial<ServicePackage> };
      service_media: { Row: ServiceMedia; Insert: Omit<ServiceMedia, 'created_at'>; Update: Partial<ServiceMedia> };
      portfolio_items: { Row: PortfolioItem; Insert: Omit<PortfolioItem, 'created_at' | 'updated_at'>; Update: Partial<PortfolioItem> };
      proposals: { Row: Proposal; Insert: Omit<Proposal, 'created_at' | 'updated_at'>; Update: Partial<Proposal> };
      contracts: { Row: Contract; Insert: Omit<Contract, 'created_at' | 'updated_at'>; Update: Partial<Contract> };
      milestones: { Row: Milestone; Insert: Omit<Milestone, 'created_at' | 'updated_at'>; Update: Partial<Milestone> };
      conversations: { Row: Conversation; Insert: Omit<Conversation, 'created_at'>; Update: Partial<Conversation> };
      messages: { Row: Message; Insert: Omit<Message, 'created_at'>; Update: Partial<Message> };
      notifications: { Row: Notification; Insert: Omit<Notification, 'created_at'>; Update: Partial<Notification> };
      transactions: { Row: Transaction; Insert: Omit<Transaction, 'created_at' | 'updated_at'>; Update: Partial<Transaction> };
      reviews: { Row: Review; Insert: Omit<Review, 'created_at'>; Update: Partial<Review> };
      support_tickets: { Row: SupportTicket; Insert: Omit<SupportTicket, 'created_at' | 'updated_at'>; Update: Partial<SupportTicket> };
      ai_logs: { Row: AILog; Insert: Omit<AILog, 'created_at'>; Update: Partial<AILog> };
      admin_audit_logs: { Row: AdminAuditLog; Insert: Omit<AdminAuditLog, 'created_at'>; Update: Partial<AdminAuditLog> };
      platform_settings: { Row: PlatformSettings; Insert: Omit<PlatformSettings, 'updated_at'>; Update: Partial<PlatformSettings> };
      newsletter_subscribers: { Row: NewsletterSubscriber; Insert: Omit<NewsletterSubscriber, 'created_at'>; Update: Partial<NewsletterSubscriber> };
    };
  };
};