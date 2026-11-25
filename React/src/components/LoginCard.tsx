import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';

export default function LoginCard() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState(false);
  const [ok, setOk] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setOk(false);

    if (!email.trim() || !pass) {
      setError(true);
      setTimeout(() => setError(false), 2500);
      return;
    }
    setError(false);
    // Aqui va la llamada al backend Go
    setOk(true);
  };

  return (
    <div className="card">
      <svg
        className="logo"
        width={90}
        height={90}
        viewBox="0 0 130 130"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="CachyOS Cloud"
      >
        <circle className="glow" cx="65" cy="65" r="52" fill="url(#halo)" />
        <circle cx="65" cy="65" r="46" stroke="rgba(255,255,255,.12)" strokeWidth="1.5" />
        <circle
          className="ring-dash"
          cx="65" cy="65" r="46"
          stroke="rgba(56,189,248,.4)"
          strokeWidth="1.5"
          strokeDasharray="3 9"
          strokeLinecap="round"
        />
        <g className="arc">
          <circle cx="65" cy="65" r="52" stroke="url(#ring)" strokeWidth="3"
                  strokeDasharray="86 241" strokeLinecap="round" />
          <circle cx="65" cy="65" r="52" stroke="#38BDF8" strokeWidth="5"
                  strokeDasharray="34 293" strokeLinecap="round" opacity=".9" />
          <circle cx="65" cy="13" r="4" fill="#7DD3FC" />
        </g>
        <g className="a-mark">
          <path d="M65 36 L86 92 L74.5 92 L65 64 L55.5 92 L44 92 Z" fill="url(#az)" />
          <path d="M56.8 74 L73.2 74 L68.5 61 L61.5 61 Z" fill="#05070A" />
        </g>
        <defs>
          <radialGradient id="halo" cx="0" cy="0" r="1" gradientTransform="translate(65 65) scale(52)">
            <stop offset="0%" stopColor="#0078D4" stopOpacity=".4" />
            <stop offset="60%" stopColor="#00AA88" stopOpacity=".15" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="ring" x1="13" y1="13" x2="117" y2="117">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="55%" stopColor="#00AA88" />
            <stop offset="100%" stopColor="#E95420" />
          </linearGradient>
          <linearGradient id="az" x1="44" y1="36" x2="86" y2="92">
            <stop offset="0%" stopColor="#7DD3FC" />
            <stop offset="100%" stopColor="#0078D4" />
          </linearGradient>
        </defs>
      </svg>

      <h1>
        Bienvenido <em>de nuevo</em>
      </h1>
      <p className="sub">Plataforma CachyOS Cloud</p>

      {error && <div className="err">⚠️ Correo o contraseña incorrectos</div>}
      {ok && <div className="ok">✅ Verificado — redirigiendo…</div>}

      <form onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="email">Correo electrónico</label>
          <input
            id="email"
            type="email"
            placeholder="tu@correo.com"
            autoComplete="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="pass">Contraseña</label>
          <div className="input-wrap">
            <input
              id="pass"
              type={showPass ? 'text' : 'password'}
              placeholder="••••••••"
              autoComplete="current-password"
              value={pass}
              onChange={e => setPass(e.target.value)}
            />
            <button
              type="button"
              className="toggle"
              onClick={() => setShowPass(s => !s)}
            >
              {showPass ? 'ocultar' : 'ver'}
            </button>
          </div>
        </div>

        <div className="row">
          <label className="remember">
            <input type="checkbox" defaultChecked /> Recordarme
          </label>
          <a href="#">¿Olvidaste tu clave?</a>
        </div>

        <button className="btn" type="submit">
          ENTRAR
        </button>
      </form>

      <p className="foot">
        ¿Sin cuenta? <Link to="/register">Solicitar acceso</Link>
      </p>
    </div>
  );
}