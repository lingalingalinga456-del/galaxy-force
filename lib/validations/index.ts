import { z } from 'zod';

export const registerSchema = z.object({
  role: z.enum(['client', 'talent'], { required_error: 'Please select a role' }),
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(100),
  language: z.enum(['en', 'bn']).default('en'),
  termsAccepted: z.literal(true, { errorMap: () => ({ message: 'You must accept the terms' }) }),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  remember: z.boolean().optional(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Password must be at least 8 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const clientOnboardingSchema = z.object({
  organizationName: z.string().min(2, 'Organization name is required').max(100),
  businessType: z.string().min(2).max(50),
  country: z.string().min(2).max(50),
  timezone: z.string().min(2).max(50).default('UTC'),
});

export const talentOnboardingSchema = z.object({
  headline: z.string().min(10, 'Headline must be at least 10 characters').max(100),
  skills: z.array(z.string().min(1).max(50)).min(1, 'Add at least one skill').max(8),
  hourlyRate: z.number().min(1, 'Rate must be positive').max(100000),
  country: z.string().min(2).max(50),
  availability: z.enum(['available', 'busy', 'unavailable']).default('available'),
});

export const jobSchema = z.object({
  title: z.string().min(10, 'Title must be 10-100 characters').max(100),
  description: z.string().min(50, 'Description must be 50-5000 characters').max(5000),
  categoryId: z.string().uuid().optional().nullable(),
  skills: z.array(z.string().min(1).max(50)).min(1, 'Add at least 1 skill').max(8),
  budgetType: z.enum(['fixed', 'hourly']),
  budgetMin: z.number().positive('Budget must be positive').optional().nullable(),
  budgetMax: z.number().positive('Budget must be positive').optional().nullable(),
  experienceLevel: z.enum(['entry', 'intermediate', 'expert']).optional().nullable(),
  timelineDays: z.number().int().positive().optional().nullable(),
  timezone: z.string().optional().nullable(),
  visibility: z.enum(['public', 'private', 'invite_only']).default('public'),
});

export const proposalSchema = z.object({
  coverLetter: z.string().min(100, 'Cover letter must be 100-3000 characters').max(3000),
  bidAmount: z.number().positive('Bid must be positive'),
  currency: z.enum(['BDT', 'USD']).default('BDT'),
  deliveryDays: z.number().int().positive('Delivery days must be positive'),
  attachmentPath: z.string().optional().nullable(),
});

export const serviceSchema = z.object({
  title: z.string().min(5).max(100),
  summary: z.string().min(20).max(300),
  description: z.string().min(50).max(5000),
  categoryId: z.string().uuid().optional().nullable(),
  tags: z.array(z.string().min(1).max(50)).max(12).default([]),
  deliveryDays: z.number().int().positive(),
  revisionsIncluded: z.number().int().min(0),
  coverImage: z.string().optional().nullable(),
  packages: z.array(z.object({
    name: z.enum(['basic', 'standard', 'premium']),
    title: z.string().min(2).max(100),
    description: z.string().min(10).max(500),
    price: z.number().positive(),
    currency: z.enum(['BDT', 'USD']).default('BDT'),
    deliveryDays: z.number().int().positive(),
    revisions: z.number().int().min(0),
    features: z.array(z.string().min(1).max(100)).max(20).default([]),
  })).min(1, 'At least one package required').max(3),
});

export const contractSchema = z.object({
  jobId: z.string().uuid(),
  proposalId: z.string().uuid(),
  agreedAmount: z.number().positive(),
  currency: z.enum(['BDT', 'USD']).default('BDT'),
});

export const milestoneSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().max(2000).optional(),
  amount: z.number().positive('Amount must be positive'),
  currency: z.enum(['BDT', 'USD']).default('BDT'),
  dueDate: z.string().optional().nullable(),
});

export const messageSchema = z.object({
  conversationId: z.string().uuid(),
  messageText: z.string().max(5000).optional(),
  attachmentPath: z.string().optional().nullable(),
  attachmentName: z.string().optional().nullable(),
  attachmentSize: z.number().optional().nullable(),
  attachmentMime: z.string().optional().nullable(),
}).refine((data) => data.messageText || data.attachmentPath, {
  message: 'Message must contain text or attachment',
});

export const reviewSchema = z.object({
  contractId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(20, 'Comment must be 20-1000 characters').max(1000),
});

export const supportTicketSchema = z.object({
  subject: z.string().min(5).max(200),
  description: z.string().min(10).max(5000),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
});

export const acceptProposalSchema = z.object({
  targetProposalId: z.string().uuid(),
  firstMilestoneTitle: z.string().min(3).max(200),
  firstMilestoneAmount: z.number().positive('Milestone amount must be positive'),
  firstMilestoneDueDate: z.string(),
});

export const aiRequestSchema = z.object({
  feature: z.enum(['job_brief', 'job_improve', 'proposal_draft', 'profile_optimize', 'career_tip', 'contract_summary']),
  payload: z.object({
    title: z.string().max(100).optional(),
    description: z.string().max(5000).optional(),
    skills: z.array(z.string().max(50)).max(12).optional(),
    language: z.enum(['en', 'bn']).default('en'),
  }),
});

export const sandboxPaymentSchema = z.object({
  provider: z.enum(['manual_demo', 'bkash_sandbox', 'nagad_sandbox', 'sslcommerz_sandbox']),
  contractId: z.string().uuid(),
  milestoneId: z.string().uuid(),
  demoAccountNumber: z.string().regex(/^\d{0,20}$/, 'Invalid test account number'),
  demoAuthCode: z.string().regex(/^\d{0,6}$/, 'Invalid auth code'),
});

export const profileUpdateSchema = z.object({
  fullName: z.string().min(2).max(100).optional(),
  username: z.string().min(3).max(30).regex(/^[a-z0-9_]+$/, 'Username must be lowercase alphanumeric').optional(),
  avatarUrl: z.string().url().optional().nullable(),
  country: z.string().max(50).optional().nullable(),
  timezone: z.string().max(50).optional().nullable(),
  language: z.enum(['en', 'bn']).optional(),
  profileVisibility: z.enum(['public', 'private']).optional(),
});

export const talentProfileUpdateSchema = profileUpdateSchema.extend({
  headline: z.string().min(10).max(100).optional(),
  bio: z.string().max(2000).optional(),
  skills: z.array(z.string().min(1).max(50)).max(8).optional(),
  hourlyRate: z.number().min(1).max(100000).optional(),
  availability: z.enum(['available', 'busy', 'unavailable']).optional(),
  experienceLevel: z.enum(['entry', 'intermediate', 'expert']).optional(),
  education: z.string().max(1000).optional(),
  certifications: z.array(z.string().min(1).max(100)).max(20).optional(),
  portfolioUrl: z.string().url().optional().nullable(),
  linkedinUrl: z.string().url().optional().nullable(),
  githubUrl: z.string().url().optional().nullable(),
});

export const clientProfileUpdateSchema = profileUpdateSchema.extend({
  organizationName: z.string().min(2).max(100).optional(),
  businessType: z.string().max(50).optional(),
  website: z.string().url().optional().nullable(),
  description: z.string().max(1000).optional(),
});