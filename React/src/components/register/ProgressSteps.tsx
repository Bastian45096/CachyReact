import type { Step } from '../../types/form';

export function ProgressSteps({ step }: { step: Step }) {
  return (
    <div className="reg-progress">
      <div className={`reg-progress-step ${step === 1 ? 'active' : 'done'}`}>
        <span className="num">{step > 1 ? '✓' : '1'}</span> Perfil
      </div>
      <div className="reg-progress-line">
        <div className={`fill ${step > 1 ? 'on' : ''}`} />
      </div>
      <div className={`reg-progress-step ${step === 2 ? 'active' : ''}`}>
        <span className="num">2</span> Seguridad
      </div>
    </div>
  );
}