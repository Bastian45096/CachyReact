import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef, type FormEvent, type ChangeEvent } from 'react';
import type { ReactNode } from 'react';

/* ============================================================
   CREAR CUENTA — 2 pasos + fetch real
   MODAL: kitsune en tejado con computadora
   ============================================================ */

type FieldName = 'photo' | 'name' | 'username' | 'email' | 'pass' | 'pass2' | 'terms';
type Errors = Partial<Record<FieldName, string>>;

const API = 'http://localhost:8080/api';
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

const CSS = `
  .register-page {
    position: fixed; inset: 0; z-index: 1;
    background: var(--bg, #05070A);
    display: flex; align-items: center; justify-content: center;
    padding: 16px 20px; overflow: hidden;
    font-family: 'DM Mono', monospace; color: var(--text, #F0F4F8);
  }

  .reg-grid {
    position: absolute; inset: -50%; z-index: 0; pointer-events: none; opacity: .5;
    background-image:
      linear-gradient(rgba(56,189,248,.07) 1px, transparent 1px),
      linear-gradient(90deg, rgba(56,189,248,.07) 1px, transparent 1px);
    background-size: 64px 64px;
    animation: regGridMove 30s linear infinite;
    -webkit-mask-image: radial-gradient(ellipse at center, black 25%, transparent 75%);
    mask-image: radial-gradient(ellipse at center, black 25%, transparent 75%);
  }
  @keyframes regGridMove { from { transform: translate(0,0);} to { transform: translate(64px,64px);} }

  .reg-aurora { position: absolute; inset: 0; z-index: 0; pointer-events: none; filter: blur(80px); opacity: .35; }
  .reg-aurora i { position: absolute; border-radius: 50%; display: block; }
  .reg-aurora i:nth-child(1) { width: 45vw; height: 45vw; left: -12vw; top: -14vw; background: radial-gradient(circle,#0078D4 0%,transparent 65%); animation: regBreathe 14s ease-in-out infinite alternate; }
  .reg-aurora i:nth-child(2) { width: 38vw; height: 38vw; right: -10vw; top: 20vh; background: radial-gradient(circle,#00AA88 0%,transparent 65%); animation: regBreathe 18s 2s ease-in-out infinite alternate; }
  .reg-aurora i:nth-child(3) { width: 42vw; height: 42vw; left: 28vw; bottom: -20vw; background: radial-gradient(circle,#E95420 0%,transparent 65%); animation: regBreathe 16s 4s ease-in-out infinite alternate; }
  @keyframes regBreathe { from { transform: scale(1) translate(0,0); opacity:.6;} to { transform: scale(1.3) translate(4vw,3vh); opacity:1;} }

  .reg-vignette { position: absolute; inset: 0; z-index: 1; pointer-events: none; background: radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,.85) 100%); }

  .reg-card {
    position: relative; z-index: 2;
    width: min(400px, 100%);
    background: linear-gradient(160deg, rgba(20,26,35,.94), rgba(10,13,18,.97));
    border: 1px solid rgba(255,255,255,.1); border-radius: 22px;
    padding: 18px 22px 16px;
    backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
    box-shadow: 0 40px 100px rgba(0,0,0,.7), inset 0 1px 0 rgba(255,255,255,.08);
    animation: regCardIn .9s cubic-bezier(.22,1,.36,1) both;
    overflow: visible;
  }
  @keyframes regCardIn { 0% { opacity:0; transform: translateY(30px) scale(.94);} 60% { opacity:1; transform: translateY(-4px) scale(1.01);} 100% { opacity:1; transform: translateY(0) scale(1);} }
  .reg-card::before {
    content:''; position:absolute; top:0; left:0; right:0; height:3px;
    border-radius: 22px 22px 0 0;
    background: linear-gradient(90deg,#0078D4 0%,#38BDF8 30%,#00AA88 62%,#E95420 100%);
    transform-origin: left; animation: regBarIn 1.2s .3s ease both;
  }
  @keyframes regBarIn { from { transform: scaleX(0);} to { transform: scaleX(1);} }

  .reg-head { display:flex; align-items:center; gap:12px; }
  .reg-logo { width:42px !important; height:42px !important; flex:none; }
  .reg-logo .arc { transform-origin:65px 65px; animation: regSpinRev 6s linear infinite; }
  .reg-logo .ring-dash { transform-origin:65px 65px; animation: regSpin 24s linear infinite; }
  @keyframes regSpin { to { transform: rotate(360deg);} }
  @keyframes regSpinRev { to { transform: rotate(-360deg);} }
  .reg-logo .a-mark { transform-origin:65px 65px; animation: regAIn .9s .35s cubic-bezier(.34,1.56,.64,1) both; }
  @keyframes regAIn { from { opacity:0; transform: scale(.4) rotate(-12deg);} to { opacity:1; transform: scale(1) rotate(0);} }
  .reg-logo .glow { animation: regGlow 3.5s ease-in-out infinite; }
  @keyframes regGlow { 0%,100% { opacity:.35;} 50% { opacity:.85;} }

  .reg-titles h1 {
    font-family:'Unbounded',sans-serif; font-weight:800; font-size:15px;
    line-height:1.1; letter-spacing:-.02em; margin:0;
  }
  .reg-titles h1 em {
    font-style:normal; background:linear-gradient(90deg,#38BDF8,#00AA88);
    -webkit-background-clip:text; background-clip:text; color:transparent;
  }
  .reg-sub { text-align:left; color:#7C8899; font-size:7.5px; margin-top:3px; letter-spacing:.18em; text-transform:uppercase; }

  .reg-progress {
    display:flex; align-items:center; gap:8px;
    margin-top:14px; padding-bottom:12px;
    border-bottom:1px solid rgba(255,255,255,.06);
  }
  .reg-progress-step {
    display:flex; align-items:center; gap:6px;
    font-size:8.5px; letter-spacing:.12em; text-transform:uppercase;
    color:#4C5563; transition:.3s;
  }
  .reg-progress-step.active { color:#38BDF8; }
  .reg-progress-step.done { color:#00AA88; }
  .reg-progress-step .num {
    width:18px; height:18px; border-radius:50%;
    display:flex; align-items:center; justify-content:center;
    font-size:8px; font-weight:700;
    background:rgba(255,255,255,.08);
    border:1.5px solid rgba(255,255,255,.12);
    transition:.3s;
  }
  .reg-progress-step.active .num { background:rgba(56,189,248,.15); border-color:#38BDF8; color:#38BDF8; }
  .reg-progress-step.done .num { background:rgba(0,170,136,.15); border-color:#00AA88; color:#00AA88; }
  .reg-progress-line { flex:1; height:1.5px; background:rgba(255,255,255,.08); position:relative; overflow:hidden; }
  .reg-progress-line .fill {
    position:absolute; inset:0;
    background:linear-gradient(90deg,#38BDF8,#00AA88);
    transform-origin:left; transform:scaleX(0);
    transition:transform .5s cubic-bezier(.22,1,.36,1);
  }
  .reg-progress-line .fill.on { transform:scaleX(1); }

  .reg-row { display:grid; grid-template-columns:1fr 1fr; gap:9px; }

  .reg-photo-section {
    display:flex; align-items:center; gap:12px; margin-top:12px;
    padding:8px 12px; border-radius:12px;
    background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.06);
    position:relative; min-height:72px; box-sizing:border-box;
  }
  .reg-photo-circle {
    width:52px; height:52px; border-radius:50%; cursor:pointer; position:relative; flex:none;
    border:2.5px dashed rgba(56,189,248,.45);
    background:rgba(56,189,248,.06);
    display:flex; align-items:center; justify-content:center;
    overflow:hidden; transition:.3s cubic-bezier(.22,1,.36,1);
    box-sizing:border-box;
  }
  .reg-photo-circle:hover { border-color:#38BDF8; background:rgba(56,189,248,.12); transform:scale(1.05); }
  .reg-photo-circle.has-photo { border-style:solid; border-color:#00AA88; }
  .reg-photo-circle.has-error { border-color:#FF6B6B; border-style:solid; background:rgba(255,107,107,.08); }
  .reg-photo-circle img { width:100%; height:100%; object-fit:cover; }
  .reg-photo-placeholder { display:flex; flex-direction:column; align-items:center; gap:1px; color:#4C5563; font-size:7px; letter-spacing:.08em; text-transform:uppercase; }
  .reg-photo-circle input[type=file] { display:none; }
  .reg-photo-remove {
    position:absolute; top:2px; right:2px; width:16px; height:16px;
    border-radius:50%; border:none; cursor:pointer;
    background:#FF6B6B; color:#fff; font-size:10px; line-height:1;
    display:flex; align-items:center; justify-content:center;
    box-shadow:0 2px 6px rgba(255,107,107,.5); transition:.2s; z-index:2;
  }
  .reg-photo-remove:hover { transform:scale(1.15); }
  .reg-photo-meta { flex:1; min-width:0; display:flex; flex-direction:column; gap:2px; }
  .reg-photo-label { font-size:8px; letter-spacing:.14em; text-transform:uppercase; color:#7C8899; white-space:nowrap; }
  .reg-photo-hint { font-size:8px; color:#4C5563; white-space:nowrap; }
  .reg-photo-label .req, .reg-field > label .req { color:#FF6B6B; margin-left:2px; }

  form.reg-form, .reg-form { margin-top:10px; display:flex; flex-direction:column; gap:8px; }
  .reg-field { display:flex; flex-direction:column; gap:3px; position:relative; min-width:0; }
  .reg-field > label { font-size:7.5px; letter-spacing:.14em; text-transform:uppercase; color:#7C8899; display:flex; align-items:center; gap:4px; }

  .reg-input-row { display:flex; align-items:center; gap:7px; }
  .reg-input-row input, .reg-wrap-rel input {
    flex:1; min-width:0;
    padding:8px 10px;
    background:rgba(255,255,255,.05);
    border:1.5px solid rgba(255,255,255,.12);
    border-radius:10px; color:#F0F4F8;
    font-family:'DM Mono',monospace; font-size:11.5px;
    outline:none; transition:.28s cubic-bezier(.22,1,.36,1);
    box-sizing:border-box;
  }
  .reg-input-row input::placeholder, .reg-wrap-rel input::placeholder { color:#4C5563; }
  .reg-input-row input:focus, .reg-wrap-rel input:focus {
    border-color:#38BDF8; background:rgba(56,189,248,.07);
    box-shadow:0 0 0 3px rgba(0,120,212,.22);
  }
  .reg-input-row input.has-error, .reg-wrap-rel input.has-error {
    border-color:#FF6B6B !important; background:rgba(255,107,107,.06) !important;
  }
  .reg-input-row input.has-error:focus, .reg-wrap-rel input.has-error:focus {
    box-shadow:0 0 0 3px rgba(255,107,107,.2) !important;
  }

  .reg-status {
    width:20px; height:20px; flex:none;
    display:flex; align-items:center; justify-content:center;
    opacity:0; transition:.25s;
  }
  .reg-status.show { opacity:1; }
  .reg-status.err { color:#FF6B6B; animation: iconShake .4s ease; }
  @keyframes iconShake { 0%,100% { transform: rotate(0);} 25% { transform: rotate(-12deg);} 75% { transform: rotate(12deg);} }

  .reg-wrap-rel { position:relative; flex:1; min-width:0; display:flex; }
  .reg-wrap-rel input { flex:1; padding-right:52px !important; }
  .reg-toggle {
    position:absolute; right:6px; top:50%; transform:translateY(-50%);
    background:none; border:none; cursor:pointer; color:#7C8899;
    font-family:'DM Mono',monospace; font-size:8px;
    letter-spacing:.1em; text-transform:uppercase; padding:3px; transition:.2s;
    z-index:1;
  }
  .reg-toggle:hover { color:#38BDF8; }

  .reg-strength { display:flex; gap:3px; margin-top:1px; }
  .reg-strength span { flex:1; height:2.5px; border-radius:2px; background:rgba(255,255,255,.1); transition:background .3s; }
  .reg-strength span.on1 { background:#E95420; }
  .reg-strength span.on2 { background:#38BDF8; }
  .reg-strength span.on3 { background:#00AA88; }
  .reg-strength-txt { font-size:7.5px; color:#7C8899; letter-spacing:.08em; }

  .reg-terms-wrap { position:relative; }
  .reg-check { display:flex; align-items:flex-start; gap:6px; font-size:9px; color:#7C8899; cursor:pointer; line-height:1.4; }
  .reg-check input { width:12px; height:12px; accent-color:#00AA88; margin-top:2px; flex:none; }
  .reg-check.has-error { color:#FF6B6B; }
  .reg-check a { color:#38BDF8; text-decoration:none; }
  .reg-check a:hover { color:#00AA88; }

  .reg-error-bubble {
    position:relative; margin-top:4px; padding:8px 10px;
    border-radius:10px;
    display:flex; align-items:flex-start; gap:8px;
    font-size:10px; line-height:1.35; color:#F0F4F8;
    background:linear-gradient(135deg, rgba(255,107,107,.2) 0%, rgba(56,189,248,.14) 100%);
    box-shadow:
      inset 2px 2px 0 0 rgba(255,107,107,.5),
      inset -2px -2px 0 0 rgba(56,189,248,.5),
      0 6px 20px rgba(0,0,0,.4);
    animation: bubbleIn .3s cubic-bezier(.22,1,.36,1) both;
  }
  @keyframes bubbleIn { from { opacity:0; transform:translateY(-5px) scale(.97);} to { opacity:1; transform:translateY(0) scale(1);} }
  .reg-error-bubble .bubble-pixel { flex:none; }
  .reg-error-bubble .bubble-icon { flex:none; width:18px; height:18px; margin-top:1px; }
  .reg-error-bubble .bubble-text { flex:1; }
  .reg-error-bubble .bubble-text strong { color:#FF6B6B; font-weight:600; }
  .reg-error-bubble .bubble-close {
    flex:none; width:16px; height:16px; border:none; background:rgba(255,255,255,.1);
    border-radius:50%; color:#7C8899; cursor:pointer; font-size:9px;
    display:flex; align-items:center; justify-content:center; transition:.2s;
  }
  .reg-error-bubble .bubble-close:hover { background:rgba(255,107,107,.3); color:#fff; }

  .reg-actions { display:flex; gap:8px; margin-top:4px; }
  .reg-btn {
    flex:1; padding:11px; border:none; border-radius:11px; cursor:pointer;
    font-family:'Unbounded',sans-serif; font-weight:600; font-size:11px; letter-spacing:.06em;
    color:#04070B;
    background:linear-gradient(90deg,#38BDF8,#00AA88);
    position:relative; overflow:hidden;
    box-shadow:0 12px 28px rgba(0,170,136,.3);
    transition:transform .18s ease, box-shadow .3s ease;
  }
  .reg-btn::after {
    content:''; position:absolute; top:0; left:-80%; width:50%; height:100%;
    background:linear-gradient(100deg,transparent,rgba(255,255,255,.55),transparent);
    transform:skewX(-20deg); transition:left .55s ease;
  }
  .reg-btn:hover { transform:translateY(-2px); box-shadow:0 16px 36px rgba(56,189,248,.4); }
  .reg-btn:hover::after { left:130%; }
  .reg-btn:active { transform:translateY(-1px); }
  .reg-btn:disabled { opacity:.55; cursor:not-allowed; transform:none; }
  .reg-btn-back {
    flex:none; padding:11px 16px; border-radius:11px; cursor:pointer;
    font-family:'Unbounded',sans-serif; font-weight:600; font-size:11px; letter-spacing:.06em;
    background:rgba(255,255,255,.06); border:1.5px solid rgba(255,255,255,.12);
    color:#7C8899; transition:.2s;
  }
  .reg-btn-back:hover { border-color:#38BDF8; color:#38BDF8; }

  .reg-msg { font-size:10px; border-radius:10px; padding:7px 9px; margin-top:8px; }
  .reg-msg.ok { color:#5EEAD4; background:rgba(0,170,136,.12); border:1px solid rgba(0,170,136,.4); }
  .reg-msg.err { color:#FF6B6B; background:rgba(255,107,107,.1); border:1px solid rgba(255,107,107,.35); animation: regShake .4s ease; }
  @keyframes regShake { 0%,100% { transform: translateX(0);} 25% { transform: translateX(-6px);} 75% { transform: translateX(6px);} }

  .reg-foot { margin-top:10px; text-align:center; font-size:9.5px; color:#7C8899; }
  .reg-foot a { color:#E95420; text-decoration:none; font-weight:500; }
  .reg-foot a:hover { text-decoration:underline; }

  /* ══════════════════════════════════════
     MODAL — kitsune en tejado con computadora
     ══════════════════════════════════════ */
  .lm-overlay {
    position:fixed; inset:0; z-index:100;
    background:rgba(4,6,10,.9);
    backdrop-filter:blur(8px); -webkit-backdrop-filter:blur(8px);
    display:flex; align-items:center; justify-content:center;
    animation: lmFade .3s ease both;
  }
  @keyframes lmFade { from { opacity:0; } to { opacity:1; } }

  .lm-card {
    width: min(420px, 92vw);
    background: linear-gradient(160deg, rgba(20,26,35,.97), rgba(10,13,18,.99));
    border: 1px solid rgba(255,255,255,.1);
    border-radius: 20px;
    padding: 20px 22px 18px;
    box-shadow: 0 40px 100px rgba(0,0,0,.8), inset 0 1px 0 rgba(255,255,255,.08);
    animation: lmPop .45s cubic-bezier(.22,1,.36,1) both;
    text-align:center;
  }
  @keyframes lmPop { from { opacity:0; transform: scale(.9) translateY(20px);} to { opacity:1; transform: scale(1) translateY(0);} }

  .lm-title {
    font-family:'Unbounded',sans-serif; font-weight:700; font-size:14px;
    margin:0 0 4px; letter-spacing:-.01em;
  }
  .lm-title em {
    font-style:normal;
    background:linear-gradient(90deg,#38BDF8,#00AA88);
    -webkit-background-clip:text; background-clip:text; color:transparent;
  }
  .lm-sub { font-size:8.5px; color:#7C8899; letter-spacing:.16em; text-transform:uppercase; margin:0 0 12px; }

  /* ── escena: tejado nocturno ── */
  .lm-scene {
    position:relative; height:170px;
    border-radius:12px; overflow:hidden;
    background:linear-gradient(180deg, #060b1a 0%, #0a1628 40%, #0d1a30 100%);
    border:1px solid rgba(255,255,255,.06);
  }

  /* estrellas */
  .lm-star {
    position:absolute; width:2px; height:2px; border-radius:50%;
    background:#fff; opacity:.5;
    animation: lmTwinkle 2s ease-in-out infinite;
  }
  @keyframes lmTwinkle { 0%,100% { opacity:.2; } 50% { opacity:.8; } }

  /* luna */
  .lm-moon {
    position:absolute; top:14px; right:24px;
    width:28px; height:28px; border-radius:50%;
    background:#F0F4F8; box-shadow:0 0 20px rgba(240,244,248,.4);
  }
  .lm-moon::after {
    content:''; position:absolute; top:3px; left:6px;
    width:18px; height:18px; border-radius:50%;
    background:#060b1a;
  }

  /* edificios lejanos */
  .lm-skyline {
    position:absolute; bottom:0; left:0; right:0; height:70px;
    display:flex; align-items:flex-end; gap:0;
  }
  .lm-bldg {
    flex:none; position:relative;
    background:linear-gradient(180deg, #0f1f35 0%, #0a1628 100%);
    border-top:2px solid rgba(56,189,248,.15);
  }
  /* ventanas encendidas */
  .lm-bldg::before {
    content:'';
    position:absolute; inset:6px 4px;
    background-image:
      radial-gradient(2px 2px at 25% 20%, rgba(255,220,100,.7), transparent),
      radial-gradient(2px 2px at 75% 20%, rgba(255,220,100,.5), transparent),
      radial-gradient(2px 2px at 25% 55%, rgba(56,189,248,.6), transparent),
      radial-gradient(2px 2px at 75% 55%, rgba(255,220,100,.6), transparent),
      radial-gradient(2px 2px at 25% 85%, rgba(255,150,50,.5), transparent),
      radial-gradient(2px 2px at 75% 85%, rgba(56,189,248,.4), transparent);
    background-size:100% 100%;
    opacity:.6;
  }

  /* tejado principal */
  .lm-roof {
    position:absolute; bottom:58px; left:50%;
    transform:translateX(-50%);
    width:180px; height:14px;
    background:linear-gradient(180deg, #1a2a3a, #122030);
    border-top:3px solid rgba(56,189,248,.3);
    border-radius:3px 3px 0 0;
    z-index:2;
    box-shadow:0 -4px 16px rgba(56,189,248,.1);
  }
  /* barandal */
  .lm-roof::after {
    content:'';
    position:absolute; top:-8px; left:8px; right:8px; height:5px;
    background:repeating-linear-gradient(90deg, rgba(56,189,248,.3) 0 2px, transparent 2px 10px);
    border-radius:2px;
  }

  /* base del edificio */
  .lm-roof-base {
    position:absolute; bottom:0; left:50%;
    transform:translateX(-50%);
    width:140px; height:60px;
    background:linear-gradient(180deg, #0f1f35 0%, #0a1628 100%);
    border-left:2px solid rgba(56,189,248,.1);
    border-right:2px solid rgba(56,189,248,.1);
    z-index:1;
  }

  /* ── kitsune sentado ── */
  .lm-kitsune {
    position:absolute; bottom:70px;
    left:calc(50% - 70px);
    z-index:4;
    filter:drop-shadow(0 4px 8px rgba(0,0,0,.5));
  }
  .lm-kitsune.working { animation: lmType .3s steps(2) infinite; }
  @keyframes lmType {
    0%,100% { transform:translateY(0); }
    50% { transform:translateY(-2px); }
  }
  .lm-kitsune.done { animation: lmCelebrate .6s ease; }
  @keyframes lmCelebrate {
    0%,100% { transform:translateY(0) rotate(0); }
    30% { transform:translateY(-14px) rotate(-8deg); }
    60% { transform:translateY(-4px) rotate(6deg); }
  }

  /* ── computadora ── */
  .lm-computer {
    position:absolute; bottom:70px;
    left:calc(50% + 10px);
    z-index:4;
    filter:drop-shadow(0 4px 8px rgba(0,0,0,.5));
  }
  /* pantalla brilla */
  .lm-screen-glow {
    position:absolute; bottom:74px;
    left:calc(50% + 18px);
    width:44px; height:34px;
    background:radial-gradient(ellipse, rgba(56,189,248,.25) 0%, transparent 70%);
    z-index:3; pointer-events:none;
    animation: lmGlowPulse 1.5s ease-in-out infinite;
  }
  @keyframes lmGlowPulse { 0%,100% { opacity:.5; } 50% { opacity:1; } }

  /* ── palabras volando al monitor ── */
  .lm-word {
    position:absolute;
    font-family:'DM Mono', monospace;
    font-size:8px; font-weight:700;
    letter-spacing:.06em;
    pointer-events:none;
    z-index:5;
    white-space:nowrap;
    animation: lmWordFly .8s ease-in forwards;
    opacity:0;
  }
  @keyframes lmWordFly {
    0%   { opacity:0; transform:translate(0,0) scale(.6) rotate(-8deg); }
    15%  { opacity:1; transform:translate(4px,-12px) scale(1) rotate(0deg); }
    70%  { opacity:1; transform:translate(38px,-6px) scale(.9) rotate(4deg); }
    100% { opacity:0; transform:translate(52px,0) scale(.3) rotate(0deg); }
  }
  .lm-word.w1 { bottom:112px; left:calc(50% - 48px); color:#38BDF8; animation-delay:.1s; }
  .lm-word.w2 { bottom:120px; left:calc(50% - 40px); color:#00AA88; animation-delay:.5s; }
  .lm-word.w3 { bottom:108px; left:calc(50% - 52px); color:#FF6B6B; animation-delay:.9s; }
  .lm-word.w4 { bottom:124px; left:calc(50% - 36px); color:#FFB84D; animation-delay:1.3s; }
  .lm-word.w5 { bottom:114px; left:calc(50% - 44px); color:#7DD3FC; animation-delay:1.7s; }
  .lm-word.w6 { bottom:122px; left:calc(50% - 38px); color:#00AA88; animation-delay:2.1s; }
  .lm-word.w7 { bottom:110px; left:calc(50% - 50px); color:#38BDF8; animation-delay:2.5s; }
  .lm-word.w8 { bottom:118px; left:calc(50% - 42px); color:#FF6B6B; animation-delay:2.9s; }

  /* manzana al final */
  .lm-apple-final {
    position:absolute; bottom:74px;
    left:calc(50% - 70px);
    z-index:5;
    opacity:0; transition:opacity .3s;
  }
  .lm-apple-final.show { opacity:1; animation: lmAppleBounce .5s ease; }
  @keyframes lmAppleBounce {
    0% { transform:scale(0) rotate(-20deg); }
    60% { transform:scale(1.3) rotate(10deg); }
    100% { transform:scale(1) rotate(0); }
  }
  .lm-chomp {
    position:absolute; bottom:110px;
    left:calc(50% - 60px);
    font-family:'Unbounded',sans-serif; font-weight:800; font-size:14px;
    color:#FF6B6B; z-index:6; pointer-events:none;
    animation: lmChompTxt .8s ease forwards;
  }
  @keyframes lmChompTxt {
    0% { opacity:0; transform:translateY(0) scale(.5); }
    30% { opacity:1; transform:translateY(-10px) scale(1.2); }
    100% { opacity:0; transform:translateY(-28px) scale(1); }
  }

  /* barra de carga */
  .lm-bar-wrap { margin-top:14px; }
  .lm-bar-label {
    display:flex; justify-content:space-between;
    font-size:8.5px; letter-spacing:.14em; text-transform:uppercase;
    color:#7C8899; margin-bottom:6px;
  }
  .lm-bar-label .pct { color:#38BDF8; font-weight:700; }
  .lm-bar {
    height:10px; border-radius:5px;
    background:rgba(255,255,255,.08);
    overflow:hidden; position:relative;
    border:1px solid rgba(255,255,255,.06);
  }
  .lm-bar .fill {
    position:absolute; top:0; left:0; bottom:0;
    background:linear-gradient(90deg, #0078D4, #38BDF8 50%, #00AA88);
    border-radius:5px;
    transition:width .1s linear;
    box-shadow:0 0 12px rgba(56,189,248,.5);
  }
  .lm-bar .fill::after {
    content:''; position:absolute; inset:0;
    background:linear-gradient(90deg, transparent, rgba(255,255,255,.35), transparent);
    background-size:60px 100%;
    animation: lmShine 1.2s linear infinite;
  }
  @keyframes lmShine { from { background-position:-60px 0; } to { background-position:calc(100% + 60px) 0; } }

  .lm-status {
    margin-top:10px; font-size:10px; color:#7C8899;
    letter-spacing:.08em; min-height:16px;
  }
  .lm-status.done { color:#00AA88; font-weight:600; }

  @media (prefers-reduced-motion:reduce) {
    .lm-kitsune.working, .lm-screen-glow, .lm-bar .fill::after { animation:none; }
  }
`;

/* ═══ KITSUNE PIXEL celeste + rojo (sentado) ═══ */
function PixelKitsune({ size = 40, pose = 'idle' }: { size?: number; pose?: 'idle' | 'type' | 'happy' }) {
  const C = '#38BDF8', L = '#BAE6FD', R = '#FF6B6B', W = '#F0F4F8', D = '#05070A';
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} shapeRendering="crispEdges" aria-hidden="true">
      {/* orejas */}
      <rect x="3" y="0" width="2" height="1" fill={R} />
      <rect x="2" y="1" width="3" height="2" fill={C} />
      <rect x="11" y="0" width="2" height="1" fill={R} />
      <rect x="11" y="1" width="3" height="2" fill={C} />
      {/* cabeza */}
      <rect x="2" y="3" width="12" height="5" fill={C} />
      <rect x="3" y="4" width="10" height="3" fill={L} />
      {/* ojos — según pose */}
      {pose === 'type' ? (
        <>
          <rect x="4" y="5" width="2" height="1" fill={R} />
          <rect x="10" y="5" width="2" height="1" fill={R} />
        </>
      ) : pose === 'happy' ? (
        <>
          <rect x="4" y="4" width="2" height="1" fill={R} />
          <rect x="4" y="5" width="1" height="1" fill={R} />
          <rect x="5" y="4" width="1" height="1" fill={R} />
          <rect x="10" y="4" width="2" height="1" fill={R} />
          <rect x="11" y="5" width="1" height="1" fill={R} />
          <rect x="10" y="5" width="1" height="1" fill={R} />
        </>
      ) : (
        <>
          <rect x="4" y="4" width="2" height="2" fill={R} />
          <rect x="10" y="4" width="2" height="2" fill={R} />
          <rect x="5" y="4" width="1" height="1" fill={W} />
          <rect x="11" y="4" width="1" height="1" fill={W} />
        </>
      )}
      {/* nariz */}
      <rect x="7" y="5" width="2" height="1" fill={R} />
      {/* boca */}
      {pose === 'happy' ? (
        <>
          <rect x="6" y="6" width="1" height="1" fill={D} />
          <rect x="7" y="7" width="2" height="1" fill={D} />
          <rect x="9" y="6" width="1" height="1" fill={D} />
        </>
      ) : (
        <>
          <rect x="6" y="6" width="1" height="1" fill={D} />
          <rect x="7" y="6" width="2" height="1" fill={D} />
          <rect x="9" y="6" width="1" height="1" fill={D} />
        </>
      )}
      {/* cuerpo sentado */}
      <rect x="3" y="8" width="10" height="5" fill={C} />
      <rect x="5" y="9" width="6" height="3" fill={L} />
      {/* patas delanteras (tipo teclado) */}
      {pose === 'type' ? (
        <>
          <rect x="4" y="12" width="2" height="2" fill={C} />
          <rect x="4" y="14" width="2" height="1" fill={R} />
          <rect x="8" y="12" width="2" height="2" fill={C} />
          <rect x="8" y="14" width="2" height="1" fill={R} />
        </>
      ) : (
        <>
          <rect x="3" y="13" width="2" height="2" fill={C} />
          <rect x="11" y="13" width="2" height="2" fill={C} />
          <rect x="3" y="15" width="2" height="1" fill={R} />
          <rect x="11" y="15" width="2" height="1" fill={R} />
        </>
      )}
      {/* 2 colas */}
      <rect x="13" y="8" width="2" height="3" fill={C} />
      <rect x="14" y="7" width="2" height="1" fill={R} />
      <rect x="14" y="11" width="1" height="1" fill={R} />
      <rect x="13" y="12" width="2" height="2" fill={C} />
      <rect x="14" y="14" width="1" height="1" fill={R} />
    </svg>
  );
}

/* ═══ COMPUTADORA PIXEL ═══ */
function PixelComputer({ size = 48 }: { size?: number }) {
  const B = '#1a2a3a', D = '#0f1a28', S = '#38BDF8', G = '#0d1a30', K = '#111', L = '#2a3a4a';
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} shapeRendering="crispEdges" aria-hidden="true">
      <rect x="1" y="1" width="14" height="10" fill={B} />
      <rect x="2" y="2" width="12" height="8" fill={G} />
      <rect x="3" y="3" width="4" height="1" fill={S} opacity=".8" />
      <rect x="3" y="5" width="6" height="1" fill="#00AA88" opacity=".7" />
      <rect x="3" y="7" width="3" height="1" fill={S} opacity=".6" />
      <rect x="3" y="4" width="8" height="1" fill="#FF6B6B" opacity=".5" />
      <rect x="8" y="6" width="4" height="1" fill="#FFB84D" opacity=".6" />
      <rect x="5" y="8" width="5" height="1" fill={S} opacity=".4" />
      <rect x="11" y="8" width="1" height="1" fill="#fff" />
      <rect x="6" y="11" width="4" height="2" fill={D} />
      <rect x="2" y="13" width="12" height="2" fill={L} />
      <rect x="3" y="14" width="1" height="1" fill={K} opacity=".4" />
      <rect x="5" y="14" width="1" height="1" fill={K} opacity=".4" />
      <rect x="7" y="14" width="1" height="1" fill={K} opacity=".4" />
      <rect x="9" y="14" width="1" height="1" fill={K} opacity=".4" />
      <rect x="11" y="14" width="1" height="1" fill={K} opacity=".4" />
    </svg>
  );
}

/* ═══ MANZANA PIXEL ═══ */
function PixelApple({ size = 22 }: { size?: number }) {
  const R = '#FF6B6B', D = '#C4441A', G = '#00AA88', B = '#5a3a1a', H = '#FF9E9E';
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} shapeRendering="crispEdges" aria-hidden="true">
      <rect x="7" y="1" width="2" height="3" fill={B} />
      <rect x="9" y="2" width="3" height="2" fill={G} />
      <rect x="3" y="4" width="10" height="9" fill={R} />
      <rect x="4" y="5" width="8" height="7" fill={R} />
      <rect x="5" y="6" width="2" height="2" fill={H} />
      <rect x="4" y="12" width="8" height="1" fill={D} />
      <rect x="6" y="13" width="4" height="1" fill={D} />
    </svg>
  );
}

/* ═══ ICONOS DE ERROR ÚNICOS ═══ */
function FieldErrorIcon({ field, size = 16 }: { field: FieldName; size?: number }) {
  const R = '#FF6B6B', C = '#38BDF8';
  const icons: Record<FieldName, ReactNode> = {
    photo: (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
        <rect x="2" y="6" width="20" height="14" rx="2" stroke={C} strokeWidth="2" />
        <rect x="7" y="3" width="6" height="4" rx="1" stroke={C} strokeWidth="1.5" />
        <circle cx="12" cy="13" r="4" stroke={R} strokeWidth="2" />
        <circle cx="12" cy="13" r="1.5" fill={R} />
      </svg>
    ),
    name: (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
        <circle cx="12" cy="8" r="4.5" stroke={C} strokeWidth="2" />
        <path d="M4 20c0-3.5 3.6-6 8-6s8 2.5 8 6" stroke={R} strokeWidth="2" strokeLinecap="round" />
        <path d="M16 4l2 2M18 4l-2 2" stroke={R} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    username: (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
        <circle cx="12" cy="12" r="4" stroke={R} strokeWidth="2" />
        <path d="M16 12v1.5a2.5 2.5 0 005 0V12a9 9 0 10-3.5 7.1" stroke={C} strokeWidth="2" strokeLinecap="round" />
        <circle cx="12" cy="12" r="1.5" fill={R} />
      </svg>
    ),
    email: (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
        <rect x="2" y="5" width="20" height="14" rx="2" stroke={C} strokeWidth="2" />
        <path d="M2 7l10 6 10-6" stroke={R} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18 16l2 2M20 16l-2 2" stroke={R} strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
    pass: (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
        <rect x="4" y="10" width="16" height="11" rx="2" stroke={C} strokeWidth="2" />
        <path d="M8 10V7a4 4 0 018 0v3" stroke={R} strokeWidth="2" strokeLinecap="round" />
        <circle cx="12" cy="15.5" r="1.5" fill={R} />
      </svg>
    ),
    pass2: (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
        <rect x="4" y="10" width="16" height="11" rx="2" stroke={C} strokeWidth="2" />
        <path d="M8 10V7a4 4 0 018 0v3" stroke={R} strokeWidth="2" strokeLinecap="round" />
        <path d="M9 15.5l2 2 4-4" stroke={R} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    terms: (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
        <rect x="5" y="2" width="14" height="20" rx="2" stroke={C} strokeWidth="2" />
        <path d="M9 7h6M9 11h6M9 15h3" stroke={C} strokeWidth="1.4" strokeLinecap="round" />
        <path d="M14 17l2 2 4-4" stroke={R} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  };
  return icons[field] || null;
}

function OkIcon({ size = 14 }: { size?: number }) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} fill="none">
      <circle cx="8" cy="8" r="7" stroke="#00AA88" strokeWidth="1.5" />
      <path d="M5 8l2 2 4-4" stroke="#00AA88" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Logo() {
  return (
    <svg className="reg-logo" viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="GoCachy">
      <circle className="glow" cx="65" cy="65" r="52" fill="url(#reg-halo)" />
      <circle cx="65" cy="65" r="46" stroke="rgba(255,255,255,.12)" strokeWidth="1.5" />
      <circle className="ring-dash" cx="65" cy="65" r="46" stroke="rgba(56,189,248,.4)" strokeWidth="1.5" strokeDasharray="3 9" strokeLinecap="round" />
      <g className="arc">
        <circle cx="65" cy="65" r="52" stroke="url(#reg-ring)" strokeWidth="3" strokeDasharray="86 241" strokeLinecap="round" />
        <circle cx="65" cy="65" r="52" stroke="#38BDF8" strokeWidth="5" strokeDasharray="34 293" strokeLinecap="round" opacity=".9" />
        <circle cx="65" cy="13" r="4" fill="#7DD3FC" />
      </g>
      <g className="a-mark">
        <path d="M65 36 L86 92 L74.5 92 L65 64 L55.5 92 L44 92 Z" fill="url(#reg-az)" />
        <path d="M56.8 74 L73.2 74 L68.5 61 L61.5 61 Z" fill="#05070A" />
      </g>
      <defs>
        <radialGradient id="reg-halo" cx="0" cy="0" r="1" gradientTransform="translate(65 65) scale(52)">
          <stop offset="0%" stopColor="#0078D4" stopOpacity=".4" />
          <stop offset="60%" stopColor="#00AA88" stopOpacity=".15" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="reg-ring" x1="13" y1="13" x2="117" y2="117">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="55%" stopColor="#00AA88" />
          <stop offset="100%" stopColor="#E95420" />
        </linearGradient>
        <linearGradient id="reg-az" x1="44" y1="36" x2="86" y2="92">
          <stop offset="0%" stopColor="#7DD3FC" />
          <stop offset="100%" stopColor="#0078D4" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function strengthOf(p: string) {
  let s = 0;
  if (p.length >= 8) s++;
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++;
  if (/\d/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return Math.min(s, 3);
}

/* ══════════════════════════════════════
   MODAL — kitsune en tejado con computadora
   ══════════════════════════════════════ */
const WORDS = ['user', 'email', 'hash', 'uuid', 'cosmos', 'token', 'avatar', 'ready'];

function LoadingModal({
  progress,
  phase,
}: {
  progress: number;
  phase: 'loading' | 'eating';
}) {
  const eating = phase === 'eating';

  const activeWords = WORDS.filter((_, i) => {
    const threshold = ((i + 1) / WORDS.length) * 95;
    return progress >= threshold - 8 && progress <= threshold + 12;
  });

  const stars = Array.from({ length: 12 }, (_, i) => (
    <div
      key={i}
      className="lm-star"
      style={{
        left: `${(i * 37 + 10) % 95}%`,
        top: `${(i * 23 + 5) % 55}%`,
        animationDelay: `${i * 0.3}s`,
      }}
    />
  ));

  return (
    <div className="lm-overlay">
      <div className="lm-card">
        <h2 className="lm-title">Creando tu <em>cuenta</em></h2>
        <p className="lm-sub">GoCachy · registro seguro</p>

        <div className="lm-scene">
          {stars}
          <div className="lm-moon" />
          <div className="lm-skyline">
            <div className="lm-bldg" style={{ width: '30px', height: '45px' }} />
            <div className="lm-bldg" style={{ width: '22px', height: '55px' }} />
            <div className="lm-bldg" style={{ width: '36px', height: '40px' }} />
            <div className="lm-bldg" style={{ width: '26px', height: '60px' }} />
            <div className="lm-bldg" style={{ width: '32px', height: '48px' }} />
            <div className="lm-bldg" style={{ width: '24px', height: '52px' }} />
            <div className="lm-bldg" style={{ width: '38px', height: '42px' }} />
            <div className="lm-bldg" style={{ width: '28px', height: '58px' }} />
            <div className="lm-bldg" style={{ width: '34px', height: '44px' }} />
          </div>

          <div className="lm-roof-base" />
          <div className="lm-roof" />

          <div className={`lm-kitsune ${eating ? 'done' : 'working'}`}>
            <PixelKitsune size={44} pose={eating ? 'happy' : 'type'} />
          </div>

          <div className="lm-computer">
            <PixelComputer size={50} />
          </div>

          {!eating && <div className="lm-screen-glow" />}

          {!eating && activeWords.map((w, i) => (
            <span key={`${w}-${i}`} className={`lm-word w${(i % 8) + 1}`}>
              {w}
            </span>
          ))}

          <div className={`lm-apple-final ${eating ? 'show' : ''}`}>
            <PixelApple size={20} />
          </div>
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
              : progress < 30
                ? 'Validando datos...'
                : progress < 60
                  ? 'Hasheando contraseña...'
                  : progress < 90
                    ? 'Guardando en Cosmos DB...'
                    : 'Finalizando...'}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   PÁGINA
   ══════════════════════════════════════ */
export default function RegisterPage() {
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2>(1);

  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [pass2, setPass2] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [terms, setTerms] = useState(false);

  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [openError, setOpenError] = useState<FieldName | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [serverErr, setServerErr] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'loading' | 'eating'>('loading');

  const fileRef = useRef<HTMLInputElement>(null);
  const s = strengthOf(pass);
  const strengthLabel = ['—', 'débil', 'media', 'fuerte'][s];

  const validateField = (field: FieldName): string | undefined => {
    switch (field) {
      case 'photo':
        return photo ? undefined : 'Debes elegir una foto de perfil';
      case 'name':
        if (!name.trim()) return 'El nombre es obligatorio';
        if (name.trim().length < 3) return 'Mínimo 3 caracteres';
        return undefined;
      case 'username':
        if (!username.trim()) return 'El username es obligatorio';
        if (!/^[a-z0-9_]{3,20}$/.test(username)) return '3–20: minúsculas, números, _';
        return undefined;
      case 'email':
        if (!email.trim()) return 'El correo es obligatorio';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Formato inválido';
        return undefined;
      case 'pass':
        if (!pass) return 'La contraseña es obligatoria';
        if (pass.length < 8) return 'Mínimo 8 caracteres';
        return undefined;
      case 'pass2':
        if (!pass2) return 'Confirma tu contraseña';
        if (pass2 !== pass) return 'Las contraseñas no coinciden';
        return undefined;
      case 'terms':
        return terms ? undefined : 'Debes aceptar los términos';
      default:
        return undefined;
    }
  };

  const setErrorFor = (field: FieldName, msg: string | undefined) => {
    setErrors(prev => {
      const next = { ...prev };
      if (msg) next[field] = msg;
      else delete next[field];
      return next;
    });
    if (!msg && openError === field) setOpenError(null);
  };

  const handleChange = (field: FieldName) => {
    if (touched[field] || submitted) setErrorFor(field, validateField(field));
  };

  const handleBlur = (field: FieldName) => {
    setTouched(p => ({ ...p, [field]: true }));
    setErrorFor(field, validateField(field));
  };

  const handleFocus = (field: FieldName) => {
    if (errors[field]) setOpenError(field);
  };

  const validateStep = (s: 1 | 2): boolean => {
    const fields: FieldName[] = s === 1
      ? ['photo', 'name', 'username']
      : ['email', 'pass', 'pass2', 'terms'];
    const errs: Errors = {};
    const newTouched: Partial<Record<FieldName, boolean>> = {};
    for (const f of fields) {
      newTouched[f] = true;
      const msg = validateField(f);
      if (msg) errs[f] = msg;
    }
    setTouched(p => ({ ...p, ...newTouched }));
    setErrors(errs);
    const first = fields.find(f => errs[f]);
    setOpenError(first || null);
    return Object.keys(errs).length === 0;
  };

  const goNext = () => {
    if (validateStep(1)) { setStep(2); setOpenError(null); setErrors({}); setSubmitted(false); }
  };

  const goBack = () => {
    setStep(1); setOpenError(null); setErrors({}); setSubmitted(false);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    setServerErr('');
    if (!validateStep(2)) return;

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
          email: email.trim(),
          username: username.trim(),
          displayName: name.trim(),
          password: pass,
        }),
      });
      const data = await res.json().catch(() => ({} as any));
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

  const handlePhoto = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setTouched(p => ({ ...p, photo: true }));
      setErrorFor('photo', 'Debe ser una imagen (jpg, png, webp)');
      setOpenError('photo'); return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setTouched(p => ({ ...p, photo: true }));
      setErrorFor('photo', 'Máximo 2 MB');
      setOpenError('photo'); return;
    }
    setPhoto(file);
    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
    setTouched(p => ({ ...p, photo: true }));
    setErrorFor('photo', undefined);
  };

  const removePhoto = () => {
    setPhoto(null); setPhotoPreview('');
    if (fileRef.current) fileRef.current.value = '';
    setTouched(p => ({ ...p, photo: true }));
    setErrorFor('photo', 'Debes elegir una foto de perfil');
    setOpenError('photo');
  };

  const showErr = (field: FieldName) => !!errors[field] && (touched[field] || submitted);

  const showOk = (field: FieldName) => {
    if (showErr(field)) return false;
    if (!touched[field] && !submitted) return false;
    switch (field) {
      case 'photo': return !!photo;
      case 'terms': return terms;
      case 'name': return name.trim().length >= 3;
      case 'username': return /^[a-z0-9_]{3,20}$/.test(username);
      case 'email': return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      case 'pass': return pass.length >= 8;
      case 'pass2': return pass2.length > 0 && pass2 === pass;
      default: return false;
    }
  };

  const StatusIcon = ({ field }: { field: FieldName }) => {
    if (openError === field) return <span className="reg-status" />;
    if (showErr(field)) return <span className="reg-status err show" title={errors[field]}><FieldErrorIcon field={field} /></span>;
    if (showOk(field)) return <span className="reg-status show" title="Válido"><OkIcon /></span>;
    return <span className="reg-status" />;
  };

  const Bubble = ({ field, title }: { field: FieldName; title: string }) => {
    if (!showErr(field) || openError !== field) return null;
    return (
      <div className="reg-error-bubble">
        <PixelKitsune size={32} />
        <div className="bubble-icon"><FieldErrorIcon field={field} /></div>
        <div className="bubble-text"><strong>{title}:</strong> {errors[field]}</div>
        <button type="button" className="bubble-close" onClick={() => setOpenError(null)}>×</button>
      </div>
    );
  };

  const renderField = (
    field: FieldName, id: string, label: string, type: string,
    placeholder: string, value: string, onChange: (v: string) => void,
    autoComplete?: string, extra?: ReactNode,
  ) => (
    <div className="reg-field">
      <label htmlFor={id}>{label} <span className="req">*</span></label>
      <div className="reg-input-row">
        {type === 'password' ? (
          <div className="reg-wrap-rel">
            <input
              id={id} type={showPass ? 'text' : 'password'} placeholder={placeholder}
              autoComplete={autoComplete} value={value}
              className={showErr(field) ? 'has-error' : ''}
              onChange={e => { onChange(e.target.value); handleChange(field); }}
              onBlur={() => handleBlur(field)} onFocus={() => handleFocus(field)}
            />
            <button type="button" className="reg-toggle" onClick={() => setShowPass(v => !v)}>
              {showPass ? 'ocultar' : 'ver'}
            </button>
          </div>
        ) : (
          <input
            id={id} type={type} placeholder={placeholder} autoComplete={autoComplete}
            value={value} className={showErr(field) ? 'has-error' : ''}
            onChange={e => { onChange(e.target.value); handleChange(field); }}
            onBlur={() => handleBlur(field)} onFocus={() => handleFocus(field)}
          />
        )}
        <StatusIcon field={field} />
      </div>
      {extra}
      <Bubble field={field} title={label} />
    </div>
  );

  return (
    <div className="register-page">
      <style>{CSS}</style>

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

        {serverErr && <div className="reg-msg err">{serverErr}</div>}

        {step === 1 && (
          <div className="reg-form">
            <div className="reg-photo-section">
              <div
                className={`reg-photo-circle ${photoPreview ? 'has-photo' : ''} ${showErr('photo') ? 'has-error' : ''}`}
                onClick={() => fileRef.current?.click()}
                role="button" tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && fileRef.current?.click()}
              >
                {photoPreview ? (
                  <>
                    <img src={photoPreview} alt="Preview" />
                    <button type="button" className="reg-photo-remove" onClick={(e) => { e.stopPropagation(); removePhoto(); }}>×</button>
                  </>
                ) : (
                  <div className="reg-photo-placeholder">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="9" r="4" stroke="#4C5563" strokeWidth="1.5" />
                      <path d="M4 20c0-3 3.6-5 8-5s8 2 8 5" stroke="#4C5563" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M18 4v4M16 6h4" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <span>Elegir</span>
                  </div>
                )}
                <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} />
              </div>
              <div className="reg-photo-meta">
                <span className="reg-photo-label">Foto de perfil <span className="req">*</span></span>
                <span className="reg-photo-hint">JPG, PNG o WEBP · máx 2 MB</span>
              </div>
              <StatusIcon field="photo" />
              <Bubble field="photo" title="Foto" />
            </div>

            <div className="reg-row">
              {renderField('name', 'r-name', 'Nombre', 'text', 'Tu nombre', name, setName, 'name')}
              {renderField('username', 'r-username', 'Username', 'text', 'tu_usuario', username, v => setUsername(v.toLowerCase()), 'username')}
            </div>

            <div className="reg-actions">
              <button type="button" className="reg-btn" onClick={goNext}>SIGUIENTE →</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <form className="reg-form" onSubmit={handleSubmit} noValidate>
            {renderField('email', 'r-email', 'Correo electrónico', 'email', 'tu@correo.com', email, setEmail, 'email')}

            <div className="reg-row">
              {renderField(
                'pass', 'r-pass', 'Contraseña', 'password', 'Mín. 8 caracteres', pass, setPass, 'new-password',
                <>
                  <div className="reg-strength">
                    <span className={s >= 1 ? (s === 1 ? 'on1' : s === 2 ? 'on2' : 'on3') : ''} />
                    <span className={s >= 2 ? (s === 2 ? 'on2' : 'on3') : ''} />
                    <span className={s >= 3 ? 'on3' : ''} />
                  </div>
                  <div className="reg-strength-txt">Seguridad: {strengthLabel}</div>
                </>
              )}
              {renderField('pass2', 'r-pass2', 'Confirmar', 'password', 'Repite tu contraseña', pass2, setPass2, 'new-password')}
            </div>

            <div className="reg-field reg-terms-wrap">
              <label className={`reg-check ${showErr('terms') ? 'has-error' : ''}`}>
                <input
                  type="checkbox" checked={terms}
                  onChange={e => {
                    setTerms(e.target.checked);
                    setTouched(p => ({ ...p, terms: true }));
                    setErrorFor('terms', e.target.checked ? undefined : 'Debes aceptar los términos');
                  }}
                  onBlur={() => handleBlur('terms')} onFocus={() => handleFocus('terms')}
                />
                <span>
                  Acepto los{' '}
                  <Link to="/terms" target="_blank" rel="noopener noreferrer">términos</Link>{' '}
                  y la{' '}
                  <Link to="/terms" target="_blank" rel="noopener noreferrer">privacidad</Link>{' '}
                  <span className="req">*</span>
                </span>
              </label>
              <Bubble field="terms" title="Términos" />
            </div>

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