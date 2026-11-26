export function Logo() {
  return (
    <svg className="reg-logo" viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="GoCachy">
      <circle className="glow" cx="65" cy="65" r="52" fill="url(#reg-halo)" />
      <circle cx="65" cy="65" r="46" stroke="rgba(255,255,255,.12)" strokeWidth="1.5" />
      <circle className="ring-dash" cx="65" cy="65" r="46" stroke="rgba(56,189,248,.4)" strokeWidth="1.5" strokeDasharray="3 9" strokeLinecap="round" />
      <g className="arc">
        <circle cx="65" cy="65" r="52" stroke="url(#reg-ring)" strokeWidth="3" strokeDasharray="86 241" strokeLinecap="round" />
        <circle cx="65" cy="65" r="52" stroke="#38BDF8" strokeWidth="5" strokeDasharray="34 293" strokeLinecap="round" opacity=".9" />
        <circle cx="65" cy="13" r="4" fill="#7DD3FC" />
      </g>
      <g className="a-mark">
        <path d="M65 36 L86 92 L74.5 92 L65 64 L55.5 92 L44 92 Z" fill="url(#reg-az)" />
        <path d="M56.8 74 L73.2 74 L68.5 61 L61.5 61 Z" fill="#05070A" />
      </g>
      <defs>
        <radialGradient id="reg-halo" cx="0" cy="0" r="1" gradientTransform="translate(65 65) scale(52)">
          <stop offset="0%" stopColor="#0078D4" stopOpacity=".4" />
          <stop offset="60%" stopColor="#00AA88" stopOpacity=".15" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="reg-ring" x1="13" y1="13" x2="117" y2="117">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="55%" stopColor="#00AA88" />
          <stop offset="100%" stopColor="#E95420" />
        </linearGradient>
        <linearGradient id="reg-az" x1="44" y1="36" x2="86" y2="92">
          <stop offset="0%" stopColor="#7DD3FC" />
          <stop offset="100%" stopColor="#0078D4" />
        </linearGradient>
      </defs>
    </svg>
  );
}