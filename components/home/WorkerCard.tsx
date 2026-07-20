'use client';

interface WorkerCardProps {
  id: string;
  name: string;
  avatar?: string;
  role: string;
  location: string;
  distance: string;
  trustScore: number;
  hourlyRate: number;
  completedJobs: number;
  availability: 'available' | 'emergency' | 'appointment';
  matchScore?: number;
}

export function WorkerCard(props: WorkerCardProps) {
  const dot = props.availability === 'available' ? 'bg-[#5FA777]' : props.availability === 'emergency' ? 'bg-[#D94F4F]' : 'bg-[#D8B26E]';
  return (
    <div className="bg-white border border-[#E9E2D9] rounded-3xl p-6 shadow-card hover:shadow-card-hover transition-all duration-200 hover:-translate-y-1 group">
      <div className="flex items-center gap-4">
        <div className="relative">
          {props.avatar ? (
            <img src={props.avatar} alt={props.name} className="w-16 h-16 rounded-full object-cover ring-2 ring-white" loading="lazy" referrerPolicy="no-referrer" onError={(e) => { const el = e.currentTarget; if (!el.dataset.fb) { el.dataset.fb = '1'; el.src = `https://picsum.photos/seed/${encodeURIComponent(props.name)}/200/200`; } }} />
          ) : (
            <div className="w-16 h-16 rounded-full bg-[#D94F4F]/10 flex items-center justify-center text-2xl font-bold text-[#D94F4F] ring-2 ring-white">{props.name.charAt(0)}</div>
          )}
          <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${dot}`} />
        </div>
        <div>
          <h3 className="font-semibold text-lg">{props.name}</h3>
          <p className="text-sm text-[#6B6B6B]">{props.role}</p>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <div className="bg-[#FAF5EB] border border-[#D8B26E] text-[#1A1A1A] text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">⭐ {props.trustScore}</div>
        <div className="bg-[#F0F7F2] text-[#5FA777] text-xs px-2.5 py-1 rounded-full">NID Verified</div>
        {props.matchScore != null && <div className="bg-[#FAF5EB] border border-[#D8B26E] text-[#1A1A1A] text-xs font-semibold px-3 py-1 rounded-full">{props.matchScore}% match</div>}
      </div>
      <div className="mt-3 text-sm text-[#6B6B6B]">{props.location} • {props.distance}</div>
      <div className="mt-4 flex items-center justify-between">
        <div><span className="text-xl font-semibold">৳{props.hourlyRate}</span><span className="text-sm text-[#6B6B6B]">/hr</span></div>
        <span className="text-sm text-[#6B6B6B]">{props.completedJobs} jobs</span>
      </div>
      <button onClick={() => (window.location.href = `/talent/${props.id}`)} className="mt-4 w-full bg-[#D94F4F] hover:bg-[#C24040] text-white py-2.5 rounded-2xl font-semibold transition-colors">
        View Profile
      </button>
    </div>
  );
}
