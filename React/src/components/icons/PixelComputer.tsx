export function PixelComputer({ size = 48 }: { size?: number }) {
  const B = '#1a2a3a', D = '#0f1a28', S = '#38BDF8', G = '#0d1a30', K = '#111', L = '#2a3a4a';
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} shapeRendering="crispEdges" aria-hidden="true">
      <rect x="1" y="1" width="14" height="10" fill={B} />
      <rect x="2" y="2" width="12" height="8" fill={G} />
      <rect x="3" y="3" width="4" height="1" fill={S} opacity=".8" />
      <rect x="3" y="5" width="6" height="1" fill="#00AA88" opacity=".7" />
      <rect x="3" y="7" width="3" height="1" fill={S} opacity=".6" />
      <rect x="3" y="4" width="8" height="1" fill="#FF6B6B" opacity=".5" />
      <rect x="8" y="6" width="4" height="1" fill="#FFB84D" opacity=".6" />
      <rect x="5" y="8" width="5" height="1" fill={S} opacity=".4" />
      <rect x="11" y="8" width="1" height="1" fill="#fff" />
      <rect x="6" y="11" width="4" height="2" fill={D} />
      <rect x="2" y="13" width="12" height="2" fill={L} />
      <rect x="3" y="14" width="1" height="1" fill={K} opacity=".4" />
      <rect x="5" y="14" width="1" height="1" fill={K} opacity=".4" />
      <rect x="7" y="14" width="1" height="1" fill={K} opacity=".4" />
      <rect x="9" y="14" width="1" height="1" fill={K} opacity=".4" />
      <rect x="11" y="14" width="1" height="1" fill={K} opacity=".4" />
    </svg>
  );
}