import type { ReactNode } from 'react';
import type { FieldName } from '../../types/form';

const R = '#FF6B6B';
const C = '#38BDF8';

const icons: Record<FieldName, ReactNode> = {
  name: (
    <svg viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4.5" stroke={C} strokeWidth="2" />
      <path d="M4 20c0-3.5 3.6-6 8-6s8 2.5 8 6" stroke={R} strokeWidth="2" strokeLinecap="round" />
      <path d="M16 4l2 2M18 4l-2 2" stroke={R} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  username: (
    <svg viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="4" stroke={R} strokeWidth="2" />
      <path d="M16 12v1.5a2.5 2.5 0 005 0V12a9 9 0 10-3.5 7.1" stroke={C} strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="12" r="1.5" fill={R} />
    </svg>
  ),
  email: (
    <svg viewBox="0 0 24 24" fill="none">
      <rect x="2" y="5" width="20" height="14" rx="2" stroke={C} strokeWidth="2" />
      <path d="M2 7l10 6 10-6" stroke={R} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18 16l2 2M20 16l-2 2" stroke={R} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  ),
  pass: (
    <svg viewBox="0 0 24 24" fill="none">
      <rect x="4" y="10" width="16" height="11" rx="2" stroke={C} strokeWidth="2" />
      <path d="M8 10V7a4 4 0 018 0v3" stroke={R} strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="15.5" r="1.5" fill={R} />
    </svg>
  ),
  pass2: (
    <svg viewBox="0 0 24 24" fill="none">
      <rect x="4" y="10" width="16" height="11" rx="2" stroke={C} strokeWidth="2" />
      <path d="M8 10V7a4 4 0 018 0v3" stroke={R} strokeWidth="2" strokeLinecap="round" />
      <path d="M9 15.5l2 2 4-4" stroke={R} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  terms: (
    <svg viewBox="0 0 24 24" fill="none">
      <rect x="5" y="2" width="14" height="20" rx="2" stroke={C} strokeWidth="2" />
      <path d="M9 7h6M9 11h6M9 15h3" stroke={C} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M14 17l2 2 4-4" stroke={R} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

export function FieldErrorIcon({ field, size = 16 }: { field: FieldName; size?: number }) {
  return <svg width={size} height={size}>{icons[field]}</svg>;
}