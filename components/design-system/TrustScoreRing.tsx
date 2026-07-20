// components/design-system/components/TrustScoreRing.tsx
export const TrustScoreRing = ({ score }: { score: number }) => {
  return (
    <div className="relative w-12 h-12">
      <svg viewBox="0 0 80 80" className="w-12 h-12">
        <circle 
          cx="40" 
          cy="40" 
          r="38" 
          stroke="#F3ECE2" 
          strokeWidth="4" 
        />
        <path 
          d="M40,2 a38,38 0 0,1 0,76 a38,38 0 0,1 0,-76" 
          stroke={score > 70 ? '#D8B26E' : score > 40 ? '#D94F4F' : '#D94F4F'} 
          strokeWidth="4" 
          fill="none" 
          strokeLinecap="round"
        />
        <text 
          x="50%" 
          y="50%" 
          dy="4" 
          textAnchor="middle" 
          fill="#1A1A1A" 
          fontWeight="600" 
          fontSize="12"
        >
          {score}
        </text>
      </svg>
    </div>
  );
};