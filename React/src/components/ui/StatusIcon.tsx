import type { FieldName } from '../../types/form';
import { FieldErrorIcon } from '../icons/FieldErrorIcon';
import { OkIcon } from '../icons/OkIcon';

interface Props {
  field: FieldName;
  openError: FieldName | null;
  hasError: boolean;
  isValid: boolean;
  errorMessage?: string;
}

export function StatusIcon({ field, openError, hasError, isValid, errorMessage }: Props) {
  if (openError === field) return <span className="reg-status" />;
  if (hasError) return <span className="reg-status err show" title={errorMessage}><FieldErrorIcon field={field} /></span>;
  if (isValid) return <span className="reg-status show" title="Válido"><OkIcon /></span>;
  return <span className="reg-status" />;
}