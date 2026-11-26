import { Link } from 'react-router-dom';
import { ErrorBubble } from '../ui/ErrorBubble';
import type { FieldName } from '../../types/form';

interface Props {
  checked: boolean;
  hasError: boolean;
  errorMessage?: string;
  openError: FieldName | null;
  onOpenError: (f: FieldName | null) => void;
  onChange: (checked: boolean) => void;
  onBlur: () => void;
  onFocus: () => void;
}

export function TermsCheckbox({ checked, hasError, errorMessage, openError, onOpenError, onChange, onBlur, onFocus }: Props) {
  return (
    <div className="reg-field reg-terms-wrap">
      <label className={`reg-check ${hasError ? 'has-error' : ''}`}>
        <input
          type="checkbox" checked={checked}
          onChange={e => onChange(e.target.checked)}
          onBlur={onBlur} onFocus={onFocus}
        />
        <span>
          Acepto los{' '}
          <Link to="/terms" target="_blank" rel="noopener noreferrer">términos</Link>{' '}
          y la{' '}
          <Link to="/terms" target="_blank" rel="noopener noreferrer">privacidad</Link>{' '}
          <span className="req">*</span>
        </span>
      </label>
      <ErrorBubble field="terms" title="Términos" message={errorMessage || ''} show={hasError && openError === 'terms'} onClose={() => onOpenError(null)} />
    </div>
  );
}