export function OkIcon({ size = 14 }: { size?: number }) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} fill="none">
      <circle cx="8" cy="8" r="7" stroke="#00AA88" strokeWidth="1.5" />
      <path d="M5 8l2 2 4-4" stroke="#00AA88" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}