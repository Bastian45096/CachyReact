import type { FieldName } from '../../types/form';
import { PixelKitsune } from '../icons/PixelKitsune';
import { FieldErrorIcon } from '../icons/FieldErrorIcon';

interface Props {
  field: FieldName;
  title: string;
  message: string;
  show: boolean;
  onClose: () => void;
}

export function ErrorBubble({ field, title, message, show, onClose }: Props) {
  if (!show) return null;
  return (
    <div className="reg-error-bubble">
      <PixelKitsune size={32} />
      <div className="bubble-icon"><FieldErrorIcon field={field} /></div>
      <div className="bubble-text"><strong>{title}:</strong> {message}</div>
      <button type="button" className="bubble-close" onClick={onClose}>×</button>
    </div>
  );
}