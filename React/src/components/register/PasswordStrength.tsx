import { strengthOf, STRENGTH_LABELS } from '../../utils/passwordStrength';

export function PasswordStrength({ password }: { password: string }) {
  const s = strengthOf(password);
  return (
    <>
      <div className="reg-strength">
        <span className={s >= 1 ? (s === 1 ? 'on1' : s === 2 ? 'on2' : 'on3') : ''} />
        <span className={s >= 2 ? (s === 2 ? 'on2' : 'on3') : ''} />
        <span className={s >= 3 ? 'on3' : ''} />
      </div>
      <div className="reg-strength-txt">Seguridad: {STRENGTH_LABELS[s]}</div>
    </>
  );
}