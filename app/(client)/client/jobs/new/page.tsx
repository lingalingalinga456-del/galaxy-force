'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles } from 'lucide-react';

export default function NewJobPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState('');
  const [budgetType, setBudgetType] = useState('fixed');
  const [budgetMax, setBudgetMax] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('intermediate');
  const [aiLoading, setAiLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function improveWithAI() {
    setAiLoading(true);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feature: 'job_brief',
          payload: { title, description, skills: skills.split(',').map((s) => s.trim()).filter(Boolean), language: 'en' },
        }),
      });
      const data = await res.json();
      if (data.content) setDescription(data.content);
    } finally {
      setAiLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const res = await fetch('/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        description,
        skills: skills.split(',').map((s) => s.trim()).filter(Boolean),
        budgetType,
        budgetMax,
        experienceLevel,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Failed to post job');
      setSubmitting(false);
      return;
    }
    router.push('/client/jobs');
    router.refresh();
  }

  return (
    <div className="p-6 lg:p-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-warm-ink mb-1">Post a Job</h1>
      <p className="text-warm-muted mb-6">Describe your project. Use AI to draft a clear brief.</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Label htmlFor="title">Job title</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. Build a marketing website" className="mt-1" />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="description">Description</Label>
            <Button type="button" variant="ghost" size="sm" onClick={improveWithAI} disabled={aiLoading || !title}>
              <Sparkles className="w-4 h-4 mr-1" /> {aiLoading ? 'Generating...' : 'AI Draft'}
            </Button>
          </div>
          <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required rows={8} className="mt-1" placeholder="Describe the work, deliverables, and requirements..." />
        </div>
        <div>
          <Label htmlFor="skills">Skills (comma separated)</Label>
          <Input id="skills" value={skills} onChange={(e) => setSkills(e.target.value)} className="mt-1" placeholder="React, Node.js, Figma" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="budgetType">Budget type</Label>
            <select id="budgetType" value={budgetType} onChange={(e) => setBudgetType(e.target.value)} className="mt-1 block w-full rounded-md border-warm-border bg-white px-3 py-2 text-sm ring-1 ring-warm-border">
              <option value="fixed">Fixed</option>
              <option value="hourly">Hourly</option>
            </select>
          </div>
          <div>
            <Label htmlFor="budgetMax">Max budget (BDT)</Label>
            <Input id="budgetMax" type="number" value={budgetMax} onChange={(e) => setBudgetMax(e.target.value)} className="mt-1" placeholder="80000" />
          </div>
        </div>
        <div>
          <Label htmlFor="experienceLevel">Experience level</Label>
          <select id="experienceLevel" value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)} className="mt-1 block w-full rounded-md border-warm-border bg-white px-3 py-2 text-sm ring-1 ring-warm-border">
            <option value="entry">Entry</option>
            <option value="intermediate">Intermediate</option>
            <option value="expert">Expert</option>
          </select>
        </div>

        {error && <p className="text-sm text-warm-red">{error}</p>}
        <Button type="submit" disabled={submitting} className="w-full">{submitting ? 'Posting...' : 'Post Job'}</Button>
      </form>
    </div>
  );
}
