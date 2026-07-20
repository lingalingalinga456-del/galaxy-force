'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bookmark, MapPin, Clock, Star, BadgeCheck, Zap, X, Send, MessageSquare, ArrowLeft, Briefcase, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { buildDemoJobs } from '@/lib/jobs-data';
import { SiteHeader, SiteFooter } from '@/components/layout/SiteChrome';

type Job = any;

const QUICK = [
  { key: 'all', label: 'All Jobs' },
  { key: 'urgent', label: 'Urgent / Emergency' },
  { key: 'nearby', label: 'Nearby (10km)' },
  { key: 'high', label: 'High Paying' },
  { key: 'today', label: "Today's Jobs" },
];

export function FindWorkClient({ realJobs = [] as Job[] }) {
  const demo = useMemo(() => buildDemoJobs(), []);
  const jobs: Job[] = useMemo(() => {
    const real = Array.isArray(realJobs) ? realJobs : [];
    if (!real.length) return demo;
    if (real.length >= 30) return real;
    return [...real, ...demo.slice(0, 30 - real.length)];
  }, [realJobs, demo]);

  const [query, setQuery] = useState('');
  const [quick, setQuick] = useState('all');
  const [visible, setVisible] = useState(25);
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [openJob, setOpenJob] = useState<Job | null>(null);
  const [showPortfolio, setShowPortfolio] = useState(false);

  const filtered = useMemo(() => {
    let r = jobs;
    const q = query.trim().toLowerCase();
    if (q) r = r.filter((j: Job) => `${j.title} ${j.subcategory} ${(j.skills || []).join(' ')} ${j.clientName}`.toLowerCase().includes(q));
    if (quick === 'urgent') r = r.filter((j: Job) => j.jobType === 'Emergency' || j.urgent);
    if (quick === 'nearby') r = r.filter((j: Job) => Number(j.distanceKm || 50) <= 10);
    if (quick === 'high') r = r.filter((j: Job) => (j.budgetType === 'hourly' ? j.budget * 8 : j.budget) >= 8000);
    if (quick === 'today') r = r.filter((j: Job) => ['2h', '3h', '4h', '5h', '6h', '8h', '12h'].includes(j.postedAt));
    return r;
  }, [jobs, query, quick]);

  const shown = filtered.slice(0, visible);

  function toggleSave(id: string) { setSaved((s) => ({ ...s, [id]: !s[id] })); }

  return (
    <div className="min-h-screen bg-warm-cream">
      <SiteHeader />
      <div className="max-w-[1280px] mx-auto px-4">
        {/* Page header */}
        <div className="pt-10 pb-4">
          <h1 className="text-heading text-4xl md:text-5xl font-bold text-warm-ink">Find Work</h1>
          <p className="text-warm-muted mt-2">Browse jobs posted by clients and send proposals.</p>
        </div>

        {/* Search + quick filters */}
        <div className="sticky top-[64px] z-30 bg-warm-cream/95 backdrop-blur-sm py-3 mb-6">
          <div className="flex items-center gap-2 rounded-full bg-white shadow-card-lift border border-transparent focus-within:border-warm-gold focus-within:ring-4 focus-within:ring-warm-gold/15 transition-all px-5 py-3">
            <Search className="w-5 h-5 text-warm-muted shrink-0" />
            <input value={query} onChange={(e) => { setQuery(e.target.value); setVisible(25); }} placeholder="Search jobs by title, skill, or client…" className="flex-1 bg-transparent outline-none text-warm-ink placeholder:text-warm-muted" />
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {QUICK.map((q) => (
              <button key={q.key} onClick={() => { setQuick(q.key); setVisible(25); }} className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm border transition-all ${quick === q.key ? 'bg-warm-red text-white border-warm-red' : 'bg-white text-warm-ink border-warm-border hover:border-warm-red hover:text-warm-red'}`}>
                {q.key === 'urgent' && <Zap className="w-3.5 h-3.5" />}{q.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-warm-muted mb-4">{filtered.length} jobs found</p>

        {/* Job grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 pb-10">
          {shown.map((j: Job, i: number) => (
            <JobCard key={j.id} job={j} idx={i} saved={!!saved[j.id]} onOpen={() => setOpenJob(j)} onSave={() => toggleSave(j.id)} />
          ))}
        </div>

        {shown.length === 0 && <div className="text-center py-16 text-warm-muted">No jobs match your filters.</div>}

        {visible < filtered.length && (
          <div className="text-center pb-16">
            <Button variant="secondary" size="lg" onClick={() => setVisible((v) => v + 25)}>Show More</Button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {openJob && <JobDetailModal job={openJob} saved={!!saved[openJob.id]} onSave={() => toggleSave(openJob.id)} onClose={() => setOpenJob(null)} onPortfolio={() => setShowPortfolio(true)} />}
      </AnimatePresence>
      <AnimatePresence>
        {showPortfolio && <WorkerPortfolio onClose={() => setShowPortfolio(false)} />}
      </AnimatePresence>

      <SiteFooter />
    </div>
  );
}

// ---- Job Card ----
function JobCard({ job, idx = 0, saved, onOpen, onSave }: any) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: (idx % 3) * 0.05 }}
      className="group rounded-[24px] bg-white border border-warm-border shadow-card hover:shadow-card-lift hover:-translate-y-1 transition-all duration-200 p-5 flex flex-col cursor-pointer" onClick={onOpen}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {job.urgent && <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-warm-red/10 text-warm-red font-semibold"><Zap className="w-3 h-3" /> Urgent</span>}
            <h3 className="font-semibold text-warm-ink text-lg leading-tight group-hover:text-warm-red transition-colors">{job.title}</h3>
          </div>
          <div className="flex items-center gap-1.5 mt-1.5 text-sm text-warm-muted">
            <span>{job.clientName}</span>
            {job.clientVerified && <BadgeCheck className="w-3.5 h-3.5 text-warm-green" />}
          </div>
        </div>
        <button onClick={(e) => { e.stopPropagation(); onSave(); }} className={`shrink-0 transition-colors ${saved ? 'text-warm-red' : 'text-warm-muted hover:text-warm-red'}`} aria-label="Save">
          <Bookmark className={`w-5 h-5 ${saved ? 'fill-warm-red' : ''}`} />
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-3 text-sm text-warm-muted">
        <span className="font-semibold text-warm-red">{job.budgetType === 'hourly' ? `৳${job.budget}/hr` : `৳${Number(job.budget).toLocaleString()}`}</span>
        <span className="inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.location} · {job.distanceKm}km</span>
        <span className="px-2 py-0.5 rounded-full bg-warm-beige text-xs">{job.jobType}</span>
      </div>

      <div className="flex items-center justify-between mt-4 text-sm">
        <span className="text-warm-muted">{job.proposalsCount} proposals · {job.postedAt} ago</span>
        {job.matchScore !== undefined && <span className="inline-flex items-center gap-1 rounded-full bg-warm-gold/15 px-2.5 py-0.5 text-xs font-medium text-warm-ink">{job.matchScore}% match</span>}
      </div>
    </motion.div>
  );
}

// ---- Proposal Form ----
function ProposalForm({ job, onClose }: any) {
  const [msg, setMsg] = useState(`Hi ${job.clientName}, I'm interested in your "${job.title}" job. I have experience with ${job.subcategory} and can start promptly.`);
  const [rate, setRate] = useState(job.budgetType === 'hourly' ? String(job.budget) : String(Math.round(job.budget * 0.9)));
  const [delivery, setDelivery] = useState(job.timeline || '2 days');
  const [sent, setSent] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
    setTimeout(() => onClose(), 1200);
  }

  if (sent) {
    return (
      <div className="text-center py-10">
        <CheckCircle2 className="w-12 h-12 text-warm-green mx-auto" />
        <h3 className="text-xl font-semibold text-warm-ink mt-3">Proposal sent!</h3>
        <p className="text-warm-muted mt-1">Your proposal was delivered to {job.clientName}.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="text-sm text-warm-muted">Cover letter / message</label>
        <textarea value={msg} onChange={(e) => setMsg(e.target.value)} rows={4} className="mt-1 w-full rounded-xl border border-warm-border px-3 py-2 text-sm bg-warm-cream outline-none focus:border-warm-gold" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm text-warm-muted">Proposed rate (৳{job.budgetType === 'hourly' ? '/hr' : ''})</label>
          <input value={rate} onChange={(e) => setRate(e.target.value)} type="number" className="mt-1 w-full rounded-xl border border-warm-border px-3 py-2 text-sm bg-warm-cream outline-none focus:border-warm-gold" />
        </div>
        <div>
          <label className="text-sm text-warm-muted">Delivery time</label>
          <input value={delivery} onChange={(e) => setDelivery(e.target.value)} className="mt-1 w-full rounded-xl border border-warm-border px-3 py-2 text-sm bg-warm-cream outline-none focus:border-warm-gold" />
        </div>
      </div>
      <Button type="submit" className="w-full gap-2"><Send className="w-4 h-4" /> Send Proposal</Button>
    </form>
  );
}

// ---- Job Detail Modal ----
function JobDetailModal({ job, saved, onSave, onClose, onPortfolio }: any) {
  const [tab, setTab] = useState<'detail' | 'proposal'>('detail');
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center p-4 overflow-y-auto" onClick={onClose}>
      <motion.div initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 24, opacity: 0 }} transition={{ type: 'spring', damping: 28 }} onClick={(e) => e.stopPropagation()} className="bg-warm-cream rounded-[28px] w-full max-w-2xl my-8 shadow-card-lift overflow-hidden">
        <div className="relative p-6 bg-gradient-to-br from-warm-cream to-warm-beige">
          <button onClick={onClose} className="absolute top-4 right-4 text-warm-muted hover:text-warm-ink"><X className="w-5 h-5" /></button>
          <div className="flex items-center gap-2">
            {job.urgent && <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-warm-red/10 text-warm-red font-semibold"><Zap className="w-3 h-3" /> Urgent</span>}
            <span className="px-2 py-0.5 rounded-full bg-warm-beige text-xs text-warm-ink">{job.jobType}</span>
          </div>
          <h2 className="text-heading text-2xl font-bold text-warm-ink mt-2">{job.title}</h2>
          <div className="flex items-center gap-2 mt-2 text-sm text-warm-muted">
            <button onClick={onPortfolio} className="inline-flex items-center gap-1 hover:text-warm-red">{job.clientName} {job.clientVerified && <BadgeCheck className="w-3.5 h-3.5 text-warm-green" />}</button>
            <span>· {job.location} · {job.distanceKm}km</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-3">
            <span className="font-semibold text-warm-red text-lg">{job.budgetType === 'hourly' ? `৳${job.budget}/hr` : `৳${Number(job.budget).toLocaleString()}`}</span>
            <span className="text-sm text-warm-muted inline-flex items-center gap-1"><Star className="w-4 h-4 fill-warm-gold text-warm-gold" /> {job.matchScore}% match</span>
            <span className="text-sm text-warm-muted">{job.proposalsCount} proposals</span>
          </div>
        </div>

        <div className="px-6">
          <div className="flex gap-2 border-b border-warm-border">
            {[['detail', 'Details'], ['proposal', 'Send Proposal']].map(([k, l]: any) => (
              <button key={k} onClick={() => setTab(k)} className={`px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${tab === k ? 'border-warm-red text-warm-red' : 'border-transparent text-warm-muted'}`}>{l}</button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {tab === 'detail' ? (
            <div className="space-y-4">
              <p className="text-warm-muted">{job.description}</p>
              <div>
                <h4 className="text-sm font-semibold text-warm-ink mb-1">Required skills</h4>
                <div className="flex flex-wrap gap-1.5">{job.skills.map((s: string, i: number) => <span key={i} className="px-2.5 py-1 rounded-full bg-warm-beige text-xs text-warm-ink">{s}</span>)}</div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <Detail label="Payment" value={job.budgetType === 'hourly' ? `Hourly ৳${job.budget}` : `Fixed ৳${Number(job.budget).toLocaleString()}`} />
                <Detail label="Timeline" value={job.timeline} />
                <Detail label="Experience" value={job.experienceLevel} />
                <Detail label="Workers needed" value={String(job.workersNeeded)} />
                <Detail label="Category" value={job.subcategory} />
                <Detail label="Posted" value={`${job.postedAt} ago`} />
              </div>
              <div className="flex gap-3 pt-2">
                <Button className="flex-1 gap-2" onClick={() => setTab('proposal')}><Send className="w-4 h-4" /> Send Proposal</Button>
                <Button variant="secondary" className="gap-2" onClick={onSave}>{saved ? <Bookmark className="w-4 h-4 fill-warm-red" /> : <Bookmark className="w-4 h-4" />} {saved ? 'Saved' : 'Save'}</Button>
                <Button variant="ghost" className="gap-2"><MessageSquare className="w-4 h-4" /> Message</Button>
              </div>
            </div>
          ) : (
            <ProposalForm job={job} onClose={onClose} />
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white border border-warm-border px-3 py-2">
      <div className="text-xs text-warm-muted">{label}</div>
      <div className="text-warm-ink font-medium capitalize">{value}</div>
    </div>
  );
}

// ---- Worker Portfolio (demo) ----
function WorkerPortfolio({ onClose }: any) {
  const skills = [['Plumbing', 'Expert'], ['Electrical', 'Intermediate'], ['Carpentry', 'Advanced'], ['Painting', 'Intermediate']];
  const reviews = [
    { name: 'Rafi H.', rating: 5, text: 'Very professional, finished on time. Highly recommend.' },
    { name: 'Nasreen B.', rating: 5, text: 'Great communication and fair pricing.' },
    { name: 'Apu D.', rating: 4, text: 'Good work, will hire again.' },
  ];
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center p-4 overflow-y-auto" onClick={onClose}>
      <motion.div initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 24, opacity: 0 }} transition={{ type: 'spring', damping: 28 }} onClick={(e) => e.stopPropagation()} className="bg-warm-cream rounded-[28px] w-full max-w-2xl my-8 shadow-card-lift overflow-hidden">
        <div className="relative p-6 bg-gradient-to-br from-warm-cream to-warm-beige text-center">
          <button onClick={onClose} className="absolute top-4 left-4 text-warm-muted hover:text-warm-ink"><ArrowLeft className="w-5 h-5" /></button>
          <div className="w-20 h-20 rounded-full bg-warm-beige mx-auto flex items-center justify-center text-3xl font-bold text-warm-red/40">R</div>
          <h2 className="text-heading text-2xl font-bold text-warm-ink mt-3">Rahim Ahmed</h2>
          <div className="flex items-center justify-center gap-2 mt-1 text-sm text-warm-muted">
            <BadgeCheck className="w-4 h-4 text-warm-green" /> Verified · <span className="text-warm-green">Available</span>
          </div>
          <div className="inline-flex items-center gap-1 mt-2 rounded-full bg-warm-gold/15 px-3 py-1 text-sm font-medium text-warm-ink"><Star className="w-4 h-4 fill-warm-gold text-warm-gold" /> 4.9 Trust Score</div>
          <p className="text-warm-muted mt-3 max-w-md mx-auto">Experienced multi-skilled technician with 8+ years helping Dhaka households with plumbing, electrical, and repair work.</p>
        </div>
        <div className="p-6 space-y-5">
          <Section title="Skills & Expertise">
            <div className="flex flex-wrap gap-2">{skills.map(([s, l]: any) => <span key={s} className="px-3 py-1 rounded-full bg-warm-beige text-sm text-warm-ink">{s} · <span className="text-warm-muted">{l}</span></span>)}</div>
          </Section>
          <Section title="Stats">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Stat icon={<Briefcase className="w-4 h-4" />} label="Jobs" value="312" />
              <Stat icon={<CheckCircle2 className="w-4 h-4" />} label="On-time" value="98%" />
              <Stat icon={<Clock className="w-4 h-4" />} label="Response" value="12m" />
              <Stat icon={<Star className="w-4 h-4" />} label="Trust" value="4.9" />
            </div>
          </Section>
          <Section title="Reviews & Ratings">
            <div className="space-y-3">{reviews.map((r, i) => (
              <div key={i} className="rounded-xl bg-white border border-warm-border p-3">
                <div className="flex items-center justify-between"><span className="font-medium text-warm-ink text-sm">{r.name}</span><span className="text-warm-gold text-sm">{'★'.repeat(r.rating)}</span></div>
                <p className="text-sm text-warm-muted mt-1">{r.text}</p>
              </div>
            ))}</div>
          </Section>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Section({ title, children }: any) {
  return (<div><h4 className="text-sm font-semibold text-warm-ink mb-2">{title}</h4>{children}</div>);
}
function Stat({ icon, label, value }: any) {
  return (<div className="rounded-xl bg-white border border-warm-border p-3 text-center"><div className="flex justify-center text-warm-red">{icon}</div><div className="font-semibold text-warm-ink mt-1">{value}</div><div className="text-xs text-warm-muted">{label}</div></div>);
}

// Header/Footer come from shared SiteHeader/SiteFooter
