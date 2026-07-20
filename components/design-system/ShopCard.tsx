interface ShopCardProps {
  id: string;
  name: string;
  coverImage?: string;
  rating: number;
  reviewCount: number;
  location: string;
  deliveryTime: string;
}

export function ShopCard(props: ShopCardProps) {
  return (
    <div className="bg-white border border-[#E9E2D9] rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover transition-all">
      {props.coverImage ? (
        <img src={props.coverImage} alt={props.name} className="h-40 w-full object-cover" loading="lazy" referrerPolicy="no-referrer" onError={(e) => { const el = e.currentTarget; if (!el.dataset.fb) { el.dataset.fb = '1'; el.src = `https://picsum.photos/seed/${encodeURIComponent(props.name)}/400/200`; } }} />
      ) : (
        <div className="h-40 w-full bg-[#F3ECE2] flex items-center justify-center text-3xl">🏪</div>
      )}
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{props.name}</h3>
            <p className="text-sm text-[#6B6B6B]">{props.location}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-sm"><span>⭐</span> {props.rating}</div>
            <p className="text-xs text-[#6B6B6B]">{props.reviewCount} reviews</p>
          </div>
        </div>
        <div className="mt-3 text-sm text-[#5FA777]">🚚 {props.deliveryTime} delivery</div>
        <button onClick={() => (window.location.href = `/shop/${props.id}`)} className="mt-4 w-full border border-[#D94F4F] text-[#D94F4F] hover:bg-[#D94F4F] hover:text-white py-2 rounded-2xl font-semibold transition-colors">
          Browse Store
        </button>
      </div>
    </div>
  );
}
