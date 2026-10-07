// Star rating with partial fill (4.6 = 92% of the gold row visible),
// drawn as a gold row clipped over a grey row, so no SVG ids are needed.
const STAR = "M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z";

function Row({ size, color }: { size: number; color: string }) {
  return (
    <span className="stars__row">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
          <path fill={color} d={STAR} />
        </svg>
      ))}
    </span>
  );
}

export default function Stars({ rating, size = 18, label }: { rating: number; size?: number; label?: string }) {
  const pct = Math.max(0, Math.min(100, (rating / 5) * 100));
  return (
    <span className="stars" role="img" aria-label={label ?? `${rating} out of 5 stars`}>
      <Row size={size} color="#dadce0" />
      <span className="stars__fill" style={{ width: `${pct}%` }}>
        <Row size={size} color="#fbbc04" />
      </span>
    </span>
  );
}
