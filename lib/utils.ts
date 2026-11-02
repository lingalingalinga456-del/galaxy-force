import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: 'BDT' | 'USD' = 'BDT', locale: 'en' | 'bn' = 'en') {
  const formatter = new Intl.NumberFormat(locale === 'bn' ? 'bn-BD' : 'en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: currency === 'BDT' ? 0 : 2,
    maximumFractionDigits: currency === 'BDT' ? 0 : 2,
  });
  return formatter.format(amount);
}

export function formatDate(date: Date | string, locale: 'en' | 'bn' = 'en', options?: Intl.DateTimeFormatOptions) {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString(locale === 'bn' ? 'bn-BD' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  });
}

export function formatRelativeTime(date: Date | string, locale: 'en' | 'bn' = 'en') {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  const texts = {
    en: { min: 'min ago', hour: 'hr ago', day: 'd ago', just: 'just now' },
    bn: { min: 'মিনিট আগে', hour: 'ঘণ্টা আগে', day: 'দিন আগে', just: 'একক্ষণ আগে' },
  };
  const t = texts[locale];

  if (diffMins < 1) return t.just;
  if (diffMins < 60) return `${diffMins}${t.min}`;
  if (diffHours < 24) return `${diffHours}${t.hour}`;
  return `${diffDays}${t.day}`;
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function truncate(text: string, length: number) {
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + '...';
}

export function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function calculateMatchScore(
  jobSkills: string[],
  talentSkills: string[],
  jobBudget: number,
  jobBudgetType: 'fixed' | 'hourly',
  talentRate: number,
  talentAvailability: 'available' | 'busy' | 'unavailable',
  talentRating: number,
  talentCompletedJobs: number
): { score: number; breakdown: Record<string, number> } {
  const skillOverlap = jobSkills.filter((s) => talentSkills.includes(s)).length;
  const skillScore = jobSkills.length > 0 ? Math.min((skillOverlap / jobSkills.length) * 100, 100) : 0;

  let budgetScore = 50;
  if (jobBudgetType === 'hourly' && talentRate > 0) {
    const ratio = jobBudget / talentRate;
    if (ratio >= 1) budgetScore = 100;
    else if (ratio >= 0.7) budgetScore = 80;
    else if (ratio >= 0.5) budgetScore = 60;
    else budgetScore = 30;
  } else if (jobBudgetType === 'fixed' && talentRate > 0) {
    const estimatedHours = jobBudget / talentRate;
    if (estimatedHours >= 10) budgetScore = 100;
    else if (estimatedHours >= 5) budgetScore = 80;
    else if (estimatedHours >= 2) budgetScore = 60;
    else budgetScore = 40;
  }

  const availabilityScore = talentAvailability === 'available' ? 100 : talentAvailability === 'busy' ? 60 : 20;

  const historyScore = Math.min(50 + talentCompletedJobs * 5 + talentRating * 10, 100);

  const breakdown = {
    skills: Math.round(skillScore * 0.5),
    budget: Math.round(budgetScore * 0.2),
    availability: Math.round(availabilityScore * 0.15),
    history: Math.round(historyScore * 0.15),
  };

  const score = Math.round(
    breakdown.skills + breakdown.budget + breakdown.availability + breakdown.history
  );

  return { score: Math.min(score, 100), breakdown };
}

export const STATUS_CONFIG = {
  job: {
    draft: { label: { en: 'Draft', bn: 'খসড়া' }, color: 'bg-warm-beige text-warm-muted' },
    open: { label: { en: 'Open', bn: 'খোলা' }, color: 'bg-warm-green/10 text-warm-green' },
    paused: { label: { en: 'Paused', bn: 'বিরত' }, color: 'bg-amber-100 text-amber-700' },
    in_progress: { label: { en: 'In Progress', bn: 'চলমান' }, color: 'bg-blue-100 text-blue-700' },
    completed: { label: { en: 'Completed', bn: 'সম্পন্ন' }, color: 'bg-warm-green/10 text-warm-green' },
    closed: { label: { en: 'Closed', bn: 'বন্ধ' }, color: 'bg-warm-beige text-warm-muted' },
  },
  proposal: {
    draft: { label: { en: 'Draft', bn: 'খসড়া' }, color: 'bg-warm-beige text-warm-muted' },
    submitted: { label: { en: 'Submitted', bn: 'জমা দেওয়া' }, color: 'bg-blue-100 text-blue-700' },
    shortlisted: { label: { en: 'Shortlisted', bn: 'সংক্ষিপ্ত তালিকায়' }, color: 'bg-warm-gold/20 text-warm-gold' },
    accepted: { label: { en: 'Accepted', bn: 'গ্রহণ করা' }, color: 'bg-warm-green/10 text-warm-green' },
    declined: { label: { en: 'Declined', bn: 'অস্বীকৃত' }, color: 'bg-warm-red/10 text-warm-red' },
    withdrawn: { label: { en: 'Withdrawn', bn: 'ফেরত নেওয়া' }, color: 'bg-warm-beige text-warm-muted' },
  },
  contract: {
    active: { label: { en: 'Active', bn: 'সক্রিয়' }, color: 'bg-warm-green/10 text-warm-green' },
    awaiting_approval: { label: { en: 'Awaiting Approval', bn: 'অনুমোদন প্রতীক্ষায়' }, color: 'bg-amber-100 text-amber-700' },
    completed: { label: { en: 'Completed', bn: 'সম্পন্ন' }, color: 'bg-blue-100 text-blue-700' },
    cancelled: { label: { en: 'Cancelled', bn: 'বাতিল' }, color: 'bg-warm-red/10 text-warm-red' },
    disputed: { label: { en: 'Disputed', bn: 'বিতর্কাধীন' }, color: 'bg-warm-red/10 text-warm-red' },
  },
  transaction: {
    pending: { label: { en: 'Pending', bn: 'অপেক্ষমান' }, color: 'bg-amber-100 text-amber-700' },
    available: { label: { en: 'Available', bn: 'উপলব্ধ' }, color: 'bg-warm-green/10 text-warm-green' },
    paid: { label: { en: 'Paid', bn: 'প্রদত্ত' }, color: 'bg-blue-100 text-blue-700' },
    failed: { label: { en: 'Failed', bn: 'বিফল' }, color: 'bg-warm-red/10 text-warm-red' },
  },
} as const;

export type JobStatus = keyof typeof STATUS_CONFIG.job;
export type ProposalStatus = keyof typeof STATUS_CONFIG.proposal;
export type ContractStatus = keyof typeof STATUS_CONFIG.contract;
export type TransactionStatus = keyof typeof STATUS_CONFIG.transaction;