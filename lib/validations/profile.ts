import { z } from 'zod';

export const profileFormSchema = z.object({
  headline: z.string().min(20, 'Headline must be at least 20 characters').max(100),
  skills: z.array(z.string()).min(1, 'Add at least one skill').max(12),
  hourlyRate: z.number().min(1, 'Rate must be positive').max(100000),
  country: z.string().min(2).max(50),
  availability: z.enum(['available', 'busy', 'unavailable']).default('available'),
});

export type ProfileFormData = z.infer<typeof profileFormSchema>;