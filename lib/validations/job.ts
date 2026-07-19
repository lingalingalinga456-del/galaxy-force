import { z } from 'zod';

export const jobFormSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters').max(100),
  description: z.string().min(50, 'Description must be at least 50 characters').max(5000),
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

export type JobFormData = z.infer<typeof jobFormSchema>;