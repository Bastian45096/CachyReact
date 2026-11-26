export type StrengthLevel = 0 | 1 | 2 | 3;
export const STRENGTH_LABELS = ['—', 'débil', 'media', 'fuerte'] as const;

export function strengthOf(p: string): StrengthLevel {
  let s = 0;
  if (p.length >= 8) s++;
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++;
  if (/\d/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return Math.min(s, 3) as StrengthLevel;
}