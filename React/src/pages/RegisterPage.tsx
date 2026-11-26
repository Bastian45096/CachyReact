import { Link, useNavigate } from 'react-router-dom';
import { useState, type FormEvent } from 'react';

import type { Step, ModalPhase } from '../types/form';
import type { FormValues } from '../utils/validation';
import { useFormValidation } from '../hooks/useFormValidation';

import { Logo } from '../components/icons/Logo';
import { ProgressSteps } from '../components/register/ProgressSteps';
import { PasswordStrength } from '../components/register/PasswordStrength';
import { TermsCheckbox } from '../components/register/TermsCheckbox';
import { LoadingModal } from '../components/register/LoadingModal';
import { FormField } from '../components/ui/FormField';

import '../styles/register.css';

const API = 'http://localhost:8080/api';
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

export default function RegisterPage() {
  const navigate = useNavigate();
  const v = useFormValidation();

  const [step, setStep] = useState<Step>(1);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [pass2, setPass2] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [terms, setTerms] = useState(false);
  const [serverErr, setServerErr] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<ModalPhase>('loading');

  const values: FormValues = { name, username, email, pass, pass2, terms };

  const goNext = () => {
    if (v.validateStep(1, values)) { setStep(2); v.reset(); }
  };
  const goBack = () => {
    setStep(1); v.reset();
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    v.setSubmitted(true);
    setServerErr('');
    if (!v.validateStep(2, values)) return;

    setShowModal(true);
    setPhase('loading');
    setProgress(0);

    const DURATION = 3200;
    const start = Date.now();
    const timer = window.setInterval(() => {
      const p = Math.min(100, ((Date.now() - start) / DURATION) * 100);
      setProgress(p);
      if (p >= 100) window.clearInterval(timer);
    }, 40);

    try {
      const res = await fetch(`${API}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(), username: username.trim(),
          displayName: name.trim(), password: pass,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `Error ${res.status}`);

      const elapsed = Date.now() - start;
      if (elapsed < DURATION) await sleep(DURATION - elapsed);
      window.clearInterval(timer);
      setProgress(100);
      setPhase('eating');
      await sleep(1400);
      navigate('/login');
    } catch (err: any) {
      window.clearInterval(timer);
      setShowModal(false);
      setProgress(0);
      setPhase('loading');
      setServerErr(err.message || 'No se pudo conectar con el servidor');
      setStep(2);
    }
  };

  return (
    <div className="register-page">
      <div className="reg-aurora"><i /><i /><i /></div>
      <div className="reg-grid" />
      <div className="reg-vignette" />

      <div className="reg-card">
        <div className="reg-head">
          <Logo />
          <div className="reg-titles">
            <h1>Crea tu <em>cuenta</em></h1>
            <p className="reg-sub">Plataforma GoCachy</p>
          </div>
        </div>

        <ProgressSteps step={step} />
        {serverErr && <div className="reg-msg err">{serverErr}</div>}

        {step === 1 && (
          <div className="reg-form">
            <div className="reg-row">
              <FormField
                field="name" id="r-name" label="Nombre" type="text"
                placeholder="Tu nombre" value={name} onChange={setName} autoComplete="name"
                hasError={v.showErr('name')} isValid={v.showOk('name', values)} errorMessage={v.errors.name}
                openError={v.openError} onOpenError={v.setOpenError}
                onFieldChange={f => v.handleChange(f, values)}
                onFieldBlur={f => v.handleBlur(f, values)}
                onFieldFocus={v.handleFocus}
              />
              <FormField
                field="username" id="r-username" label="Username" type="text"
                placeholder="tu_usuario" value={username}
                onChange={val => setUsername(val.toLowerCase())} autoComplete="username"
                hasError={v.showErr('username')} isValid={v.showOk('username', values)} errorMessage={v.errors.username}
                openError={v.openError} onOpenError={v.setOpenError}
                onFieldChange={f => v.handleChange(f, values)}
                onFieldBlur={f => v.handleBlur(f, values)}
                onFieldFocus={v.handleFocus}
              />
            </div>
            <div className="reg-actions">
              <button type="button" className="reg-btn" onClick={goNext}>SIGUIENTE →</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <form className="reg-form" onSubmit={handleSubmit} noValidate>
            <FormField
              field="email" id="r-email" label="Correo electrónico" type="email"
              placeholder="tu@correo.com" value={email} onChange={setEmail} autoComplete="email"
              hasError={v.showErr('email')} isValid={v.showOk('email', values)} errorMessage={v.errors.email}
              openError={v.openError} onOpenError={v.setOpenError}
              onFieldChange={f => v.handleChange(f, values)}
              onFieldBlur={f => v.handleBlur(f, values)}
              onFieldFocus={v.handleFocus}
            />
            <div className="reg-row">
              <FormField
                field="pass" id="r-pass" label="Contraseña" type="password"
                placeholder="Mín. 8 caracteres" value={pass} onChange={setPass} autoComplete="new-password"
                showPass={showPass} onTogglePass={() => setShowPass(p => !p)}
                hasError={v.showErr('pass')} isValid={v.showOk('pass', values)} errorMessage={v.errors.pass}
                openError={v.openError} onOpenError={v.setOpenError}
                onFieldChange={f => v.handleChange(f, values)}
                onFieldBlur={f => v.handleBlur(f, values)}
                onFieldFocus={v.handleFocus}
                extra={<PasswordStrength password={pass} />}
              />
              <FormField
                field="pass2" id="r-pass2" label="Confirmar" type="password"
                placeholder="Repite tu contraseña" value={pass2} onChange={setPass2} autoComplete="new-password"
                showPass={showPass} onTogglePass={() => setShowPass(p => !p)}
                hasError={v.showErr('pass2')} isValid={v.showOk('pass2', values)} errorMessage={v.errors.pass2}
                openError={v.openError} onOpenError={v.setOpenError}
                onFieldChange={f => v.handleChange(f, values)}
                onFieldBlur={f => v.handleBlur(f, values)}
                onFieldFocus={v.handleFocus}
              />
            </div>
            <TermsCheckbox
              checked={terms}
              hasError={v.showErr('terms')}
              errorMessage={v.errors.terms}
              openError={v.openError}
              onOpenError={v.setOpenError}
              onChange={checked => {
                setTerms(checked);
                v.setErrorFor('terms', checked ? undefined : 'Debes aceptar los términos');
              }}
              onBlur={() => v.handleBlur('terms', values)}
              onFocus={() => v.handleFocus('terms')}
            />
            <div className="reg-actions">
              <button type="button" className="reg-btn-back" onClick={goBack}>← Atrás</button>
              <button className="reg-btn" type="submit" disabled={showModal}>CREAR CUENTA</button>
            </div>
          </form>
        )}

        <p className="reg-foot">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>

      {showModal && <LoadingModal progress={progress} phase={phase} />}
    </div>
  );
}