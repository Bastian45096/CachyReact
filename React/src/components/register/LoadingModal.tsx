import { createPortal } from 'react-dom';
import type { ModalPhase } from '../../types/form';
import { PixelKitsune } from '../icons/PixelKitsune';
import { PixelComputer } from '../icons/PixelComputer';
import { PixelPizza } from '../icons/PixelPizza';
import '../../styles/loading-modal.css';  // ← CSS correcto

const WORDS = ['user', 'email', 'hash', 'uuid', 'cosmos', 'token', 'avatar', 'ready'];

interface Props {
  progress: number;
  phase: ModalPhase;
}

export function LoadingModal({ progress, phase }: Props) {
  const eating = phase === 'eating';

  const activeWords = WORDS.filter((_, i) => {
    const threshold = ((i + 1) / WORDS.length) * 95;
    return progress >= threshold - 8 && progress <= threshold + 12;
  });

  const stars = Array.from({ length: 12 }, (_, i) => (
    <div key={i} className="lm-star"
      style={{ left: `${(i * 37 + 10) % 95}%`, top: `${(i * 23 + 5) % 55}%`, animationDelay: `${i * 0.3}s` }} />
  ));

  return createPortal(
    <div className="lm-overlay">
      <div className="lm-card">
        <h2 className="lm-title">Creando tu <em>cuenta</em></h2>
        <p className="lm-sub">GoCachy · registro seguro</p>

        <div className="lm-scene">
          {stars}
          <div className="lm-moon" />
          <div className="lm-skyline">
            {[45,55,40,60,48,52,42,58,44].map((h, i) => (
              <div key={i} className="lm-bldg" style={{ width: `${22 + i * 2}px`, height: `${h}px` }} />
            ))}
          </div>
          <div className="lm-roof-base" />
          <div className="lm-roof" />

          <div className={`lm-kitsune ${eating ? 'done' : 'working'}`}>
            <PixelKitsune size={44} pose={eating ? 'happy' : 'type'} />
          </div>

          <div className="lm-computer"><PixelComputer size={50} /></div>
          {!eating && <div className="lm-screen-glow" />}

          {!eating && activeWords.map((w, i) => (
            <span key={`${w}-${i}`} className={`lm-word w${(i % 8) + 1}`}>{w}</span>
          ))}

          {eating && (
            <>
              <div className="lm-portal" />
              <div className="lm-portal-ring" />
              <div className="lm-pizza"><PixelPizza size={28} /></div>
              <div className="lm-pizza-glow" />
            </>
          )}

          {eating && <div className="lm-chomp">¡ÑAM!</div>}
        </div>

        <div className="lm-bar-wrap">
          <div className="lm-bar-label">
            <span>{eating ? '¡Cuenta lista!' : 'Procesando...'}</span>
            <span className="pct">{Math.round(eating ? 100 : progress)}%</span>
          </div>
          <div className="lm-bar">
            <div className="fill" style={{ width: `${eating ? 100 : progress}%` }} />
          </div>
          <p className={`lm-status ${eating ? 'done' : ''}`}>
            {eating
              ? '✓ Listo — yendo al login'
              : progress < 30 ? 'Validando datos...'
              : progress < 60 ? 'Hasheando contraseña...'
              : progress < 90 ? 'Guardando en Cosmos DB...'
              : 'Finalizando...'}
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}