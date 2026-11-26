import { type ReactNode } from 'react';
import type { FieldName } from '../../types/form';
import { StatusIcon } from './StatusIcon';
import { ErrorBubble } from './ErrorBubble';

interface Props {
  field: FieldName;
  id: string;
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
  extra?: ReactNode;
  showPass?: boolean;
  onTogglePass?: () => void;
  hasError: boolean;
  isValid: boolean;
  errorMessage?: string;
  openError: FieldName | null;
  onOpenError: (f: FieldName | null) => void;
  onFieldChange: (f: FieldName) => void;
  onFieldBlur: (f: FieldName) => void;
  onFieldFocus: (f: FieldName) => void;
}

export function FormField({
  field, id, label, type, placeholder, value, onChange,
  autoComplete, extra, showPass, onTogglePass,
  hasError, isValid, errorMessage, openError, onOpenError,
  onFieldChange, onFieldBlur, onFieldFocus,
}: Props) {
  const inputClass = hasError ? 'has-error' : '';
  const inputProps = {
    id,
    value,
    autoComplete,
    className: inputClass,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => { onChange(e.target.value); onFieldChange(field); },
    onBlur: () => onFieldBlur(field),
    onFocus: () => onFieldFocus(field),
  };

  return (
    <div className="reg-field">
      <label htmlFor={id}>{label} <span className="req">*</span></label>
      <div className="reg-input-row">
        {type === 'password' ? (
          <div className="reg-wrap-rel">
            <input {...inputProps} type={showPass ? 'text' : 'password'} placeholder={placeholder} />
            <button type="button" className="reg-toggle" onClick={onTogglePass}>
              {showPass ? 'ocultar' : 'ver'}
            </button>
          </div>
        ) : (
          <input {...inputProps} type={type} placeholder={placeholder} />
        )}
        <StatusIcon field={field} openError={openError} hasError={hasError} isValid={isValid} errorMessage={errorMessage} />
      </div>
      {extra}
      <ErrorBubble field={field} title={label} message={errorMessage || ''} show={hasError && openError === field} onClose={() => onOpenError(null)} />
    </div>
  );
}