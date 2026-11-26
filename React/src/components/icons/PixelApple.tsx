export function PixelApple({ size = 22 }: { size?: number }) {
  const R = '#FF6B6B', D = '#C4441A', G = '#00AA88', B = '#5a3a1a', H = '#FF9E9E';
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} shapeRendering="crispEdges" aria-hidden="true">
      <rect x="7" y="1" width="2" height="3" fill={B} />
      <rect x="9" y="2" width="3" height="2" fill={G} />
      <rect x="3" y="4" width="10" height="9" fill={R} />
      <rect x="4" y="5" width="8" height="7" fill={R} />
      <rect x="5" y="6" width="2" height="2" fill={H} />
      <rect x="4" y="12" width="8" height="1" fill={D} />
      <rect x="6" y="13" width="4" height="1" fill={D} />
    </svg>
  );
}