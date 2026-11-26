export function PixelPizza({ size = 24 }: { size?: number }) {
  const CRUST = '#E8A838';
  const CRUST_D = '#C48820';
  const CHEESE = '#FFD93D';
  const PEPPERONI = '#FF6B6B';
  const OLIVE = '#2D5016';
  const GREEN = '#00AA88';

  return (
    <svg viewBox="0 0 16 16" width={size} height={size} shapeRendering="crispEdges" aria-hidden="true">
      {/* borde masa inferior */}
      <rect x="2" y="12" width="12" height="2" fill={CRUST_D} />
      <rect x="3" y="13" width="10" height="1" fill={CRUST_D} />

      {/* queso */}
      <rect x="3" y="4" width="10" height="8" fill={CHEESE} />
      <rect x="4" y="3" width="8" height="9" fill={CHEESE} />
      <rect x="5" y="2" width="6" height="10" fill={CHEESE} />

      {/* masa borde superior */}
      <rect x="3" y="4" width="10" height="1" fill={CRUST} />
      <rect x="4" y="3" width="8" height="1" fill={CRUST} />
      <rect x="5" y="2" width="6" height="1" fill={CRUST} />
      <rect x="5" y="12" width="6" height="1" fill={CRUST} />

      {/* pepperoni */}
      <rect x="5" y="4" width="2" height="2" fill={PEPPERONI} />
      <rect x="9" y="5" width="2" height="2" fill={PEPPERONI} />
      <rect x="7" y="7" width="2" height="2" fill={PEPPERONI} />
      <rect x="5" y="9" width="2" height="2" fill={PEPPERONI} />
      <rect x="10" y="9" width="1" height="1" fill={PEPPERONI} />

      {/* aceitunas */}
      <rect x="8" y="4" width="1" height="1" fill={OLIVE} />
      <rect x="6" y="7" width="1" height="1" fill={OLIVE} />
      <rect x="9" y="10" width="1" height="1" fill={OLIVE} />

      {/* albahaca */}
      <rect x="11" y="7" width="1" height="2" fill={GREEN} />
      <rect x="5" y="6" width="1" height="1" fill={GREEN} />
    </svg>
  );
}