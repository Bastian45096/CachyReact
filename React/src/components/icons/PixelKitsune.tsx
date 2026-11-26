interface Props { size?: number; pose?: 'idle' | 'type' | 'happy' }

export function PixelKitsune({ size = 40, pose = 'idle' }: Props) {
  const C = '#38BDF8', L = '#BAE6FD', R = '#FF6B6B', W = '#F0F4F8', D = '#05070A';
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} shapeRendering="crispEdges" aria-hidden="true">
      <rect x="3" y="0" width="2" height="1" fill={R} />
      <rect x="2" y="1" width="3" height="2" fill={C} />
      <rect x="11" y="0" width="2" height="1" fill={R} />
      <rect x="11" y="1" width="3" height="2" fill={C} />
      <rect x="2" y="3" width="12" height="5" fill={C} />
      <rect x="3" y="4" width="10" height="3" fill={L} />
      {pose === 'type' ? (
        <>
          <rect x="4" y="5" width="2" height="1" fill={R} />
          <rect x="10" y="5" width="2" height="1" fill={R} />
        </>
      ) : pose === 'happy' ? (
        <>
          <rect x="4" y="4" width="2" height="1" fill={R} />
          <rect x="4" y="5" width="1" height="1" fill={R} />
          <rect x="5" y="4" width="1" height="1" fill={R} />
          <rect x="10" y="4" width="2" height="1" fill={R} />
          <rect x="11" y="5" width="1" height="1" fill={R} />
          <rect x="10" y="5" width="1" height="1" fill={R} />
        </>
      ) : (
        <>
          <rect x="4" y="4" width="2" height="2" fill={R} />
          <rect x="10" y="4" width="2" height="2" fill={R} />
          <rect x="5" y="4" width="1" height="1" fill={W} />
          <rect x="11" y="4" width="1" height="1" fill={W} />
        </>
      )}
      <rect x="7" y="5" width="2" height="1" fill={R} />
      {pose === 'happy' ? (
        <>
          <rect x="6" y="6" width="1" height="1" fill={D} />
          <rect x="7" y="7" width="2" height="1" fill={D} />
          <rect x="9" y="6" width="1" height="1" fill={D} />
        </>
      ) : (
        <>
          <rect x="6" y="6" width="1" height="1" fill={D} />
          <rect x="7" y="6" width="2" height="1" fill={D} />
          <rect x="9" y="6" width="1" height="1" fill={D} />
        </>
      )}
      <rect x="3" y="8" width="10" height="5" fill={C} />
      <rect x="5" y="9" width="6" height="3" fill={L} />
      {pose === 'type' ? (
        <>
          <rect x="4" y="12" width="2" height="2" fill={C} />
          <rect x="4" y="14" width="2" height="1" fill={R} />
          <rect x="8" y="12" width="2" height="2" fill={C} />
          <rect x="8" y="14" width="2" height="1" fill={R} />
        </>
      ) : (
        <>
          <rect x="3" y="13" width="2" height="2" fill={C} />
          <rect x="11" y="13" width="2" height="2" fill={C} />
          <rect x="3" y="15" width="2" height="1" fill={R} />
          <rect x="11" y="15" width="2" height="1" fill={R} />
        </>
      )}
      <rect x="13" y="8" width="2" height="3" fill={C} />
      <rect x="14" y="7" width="2" height="1" fill={R} />
      <rect x="14" y="11" width="1" height="1" fill={R} />
      <rect x="13" y="12" width="2" height="2" fill={C} />
      <rect x="14" y="14" width="1" height="1" fill={R} />
    </svg>
  );
}