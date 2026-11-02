export type MatchProfile = {
  skills: string[];
  hourlyRate: number;
  rating: number;
  completedContracts: number;
  availability: 'available' | 'limited' | 'unavailable';
  jobCount?: number;
};

export type MatchJob = {
  skillsRequired: string[];
  budgetMax: number;
  budgetType: 'fixed' | 'hourly';
  experienceLevel?: string;
};

const normalise = (value: string) => value.trim().toLocaleLowerCase();

export function calculateMatchEstimate(talent: MatchProfile, job: MatchJob) {
  const required = [...new Set(job.skillsRequired.map(normalise).filter(Boolean))];
  const offered = new Set(talent.skills.map(normalise));
  const overlap = required.filter((skill) => offered.has(skill)).length;
  const skills = required.length ? Math.round((overlap / required.length) * 50) : 50;

  let rate = 20;
  if (job.budgetType === 'hourly' && job.budgetMax > 0 && talent.hourlyRate > 0) {
    const ratio = job.budgetMax / talent.hourlyRate;
    if (ratio >= 1) rate = 20;
    else if (ratio >= 0.7) rate = 14;
    else if (ratio >= 0.5) rate = 10;
    else rate = 4;
  } else if (job.budgetType === 'fixed' && job.budgetMax > 0 && talent.hourlyRate > 0) {
    const estHours = job.budgetMax / talent.hourlyRate;
    if (estHours >= 10) rate = 20;
    else if (estHours >= 5) rate = 16;
    else if (estHours >= 2) rate = 12;
    else rate = 6;
  }

  const availability = talent.availability === 'available' ? 15 : talent.availability === 'limited' ? 8 : 0;
  const history = Math.round(Math.min(10, (Math.max(0, Math.min(5, talent.rating)) / 5) * 10) + Math.min(5, talent.completedContracts));
  const score = Math.min(100, skills + rate + availability + history);

  return {
    score,
    breakdown: { skills, rate, availability, history },
    factors: [
      { label: 'Skill overlap', value: skills, max: 50, explanation: `${overlap} of ${required.length} required skills matched` },
      { label: 'Budget/rate fit', value: rate, max: 20, explanation: job.budgetType === 'hourly' ? `Budget vs hourly rate (${talent.hourlyRate})` : `Project budget vs estimated hours` },
      { label: 'Availability', value: availability, max: 15, explanation: `Currently ${talent.availability}` },
      { label: 'Work history', value: history, max: 15, explanation: `Rating ${talent.rating}/5, ${talent.completedContracts} completed jobs` },
    ],
  };
}

export function getMatchLabel(score: number, locale: 'en' | 'bn' = 'en') {
  const labels = {
    en: { high: 'Excellent match', med: 'Good match', low: 'Possible match', poor: 'Weak match' },
    bn: { high: 'চমৎকার ম্যাচ', med: 'ভালো ম্যাচ', low: 'সম্ভাব্য ম্যাচ', poor: 'দুর্বল ম্যাচ' },
  };
  if (score >= 80) return labels[locale].high;
  if (score >= 60) return labels[locale].med;
  if (score >= 40) return labels[locale].low;
  return labels[locale].poor;
}