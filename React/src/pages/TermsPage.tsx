import { Link, useNavigate } from 'react-router-dom';


/* ============================================================
   TÉRMINOS Y CONDICIONES — GoCachy
   Leyes aplicables (Chile):
   - Ley 19.628 (Protección de Datos Personales)
   - Ley 19.496 (Derechos del Consumidor)
   - Ley 17.336 (Propiedad Intelectual)
   - Código Civil (obligaciones y contratos)
   - Ley 20.575 (Ciberdelitos / acceso a datos)
   Uso: /terms — enlazado desde Registro y Login
   ============================================================ */

const CSS = `
  .terms-page {
    position: fixed; inset: 0; z-index: 1;
    background: var(--bg, #05070A);
    overflow-y: auto;
    font-family: 'DM Mono', monospace; color: var(--text, #F0F4F8);
    -webkit-overflow-scrolling: touch;
  }

  /* fondo */
  .terms-page::before {
    content:''; position:fixed; inset:0; z-index:0; pointer-events:none;
    background:
      radial-gradient(ellipse at 15% 10%, rgba(0,120,212,.12) 0%, transparent 50%),
      radial-gradient(ellipse at 85% 80%, rgba(0,170,136,.08) 0%, transparent 50%),
      radial-gradient(ellipse at 50% 50%, rgba(233,84,32,.04) 0%, transparent 60%);
  }
  .terms-page::after {
    content:''; position:fixed; inset:0; z-index:0; pointer-events:none; opacity:.4;
    background-image:
      linear-gradient(rgba(56,189,248,.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(56,189,248,.05) 1px, transparent 1px);
    background-size:72px 72px;
    -webkit-mask-image: radial-gradient(ellipse at center, black 20%, transparent 75%);
    mask-image: radial-gradient(ellipse at center, black 20%, transparent 75%);
  }

  .terms-shell {
    position:relative; z-index:1;
    max-width:820px; margin:0 auto;
    padding:24px 20px 60px;
  }

  /* header */
  .terms-head {
    display:flex; align-items:center; gap:14px;
    padding-bottom:16px; margin-bottom:8px;
    border-bottom:1px solid rgba(255,255,255,.08);
    position:sticky; top:0; z-index:10;
    background:rgba(5,7,10,.85);
    backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px);
    margin-left:-20px; margin-right:-20px;
    padding:16px 20px 14px;
  }
  .terms-back {
    width:36px; height:36px; flex:none;
    display:flex; align-items:center; justify-content:center;
    border-radius:10px; border:1.5px solid rgba(255,255,255,.12);
    background:rgba(255,255,255,.04); color:#7C8899;
    cursor:pointer; transition:.25s; text-decoration:none;
    font-size:16px;
  }
  .terms-back:hover { border-color:#38BDF8; color:#38BDF8; }
  .terms-logo { width:34px !important; height:34px !important; flex:none; }
  .terms-head h1 {
    font-family:'Unbounded',sans-serif; font-weight:800;
    font-size:17px; letter-spacing:-.02em; margin:0; line-height:1.15;
  }
  .terms-head h1 em {
    font-style:normal;
    background:linear-gradient(90deg,#38BDF8,#00AA88);
    -webkit-background-clip:text; background-clip:text; color:transparent;
  }
  .terms-head .sub {
    font-size:8px; color:#7C8899; letter-spacing:.16em;
    text-transform:uppercase; margin-top:3px;
  }

  /* badge de fecha */
  .terms-date {
    display:inline-flex; align-items:center; gap:6px;
    padding:5px 10px; border-radius:20px; font-size:8.5px;
    letter-spacing:.12em; text-transform:uppercase;
    background:rgba(56,189,248,.1); border:1px solid rgba(56,189,248,.25);
    color:#7DD3FC; margin:16px 0 8px;
  }

  /* índice */
  .terms-toc {
    background:rgba(255,255,255,.03);
    border:1px solid rgba(255,255,255,.07);
    border-radius:14px; padding:14px 16px; margin:12px 0 20px;
  }
  .terms-toc h2 {
    font-family:'Unbounded',sans-serif; font-size:9px;
    letter-spacing:.16em; text-transform:uppercase;
    color:#7C8899; margin:0 0 10px;
  }
  .terms-toc ol {
    margin:0; padding-left:18px;
    columns:2; column-gap:24px;
  }
  .terms-toc li {
    font-size:10px; color:#7C8899; margin-bottom:5px;
    break-inside:avoid;
  }
  .terms-toc a {
    color:#38BDF8; text-decoration:none; transition:.2s;
  }
  .terms-toc a:hover { color:#00AA88; text-decoration:underline; }
  @media (max-width:560px) { .terms-toc ol { columns:1; } }

  /* secciones */
  .terms-section {
    margin:0 0 8px;
    padding:16px 18px;
    background:rgba(255,255,255,.025);
    border:1px solid rgba(255,255,255,.06);
    border-radius:14px;
    transition:border-color .3s, background .3s;
  }
  .terms-section:hover {
    border-color:rgba(56,189,248,.2);
    background:rgba(255,255,255,.04);
  }
  .terms-section h2 {
    font-family:'Unbounded',sans-serif; font-weight:700;
    font-size:12px; letter-spacing:-.01em;
    color:#F0F4F8; margin:0 0 10px;
    display:flex; align-items:center; gap:8px;
  }
  .terms-section h2 .num {
    display:inline-flex; align-items:center; justify-content:center;
    width:22px; height:22px; border-radius:7px; flex:none;
    font-size:9px; font-weight:800;
    background:linear-gradient(135deg, rgba(56,189,248,.2), rgba(0,170,136,.15));
    border:1px solid rgba(56,189,248,.3);
    color:#7DD3FC;
  }
  .terms-section h3 {
    font-family:'Unbounded',sans-serif; font-weight:600;
    font-size:10px; letter-spacing:.02em;
    color:#38BDF8; margin:14px 0 6px;
  }
  .terms-section p {
    font-size:10.5px; line-height:1.65; color:#A0ADB8;
    margin:6px 0;
  }
  .terms-section ul, .terms-section ol {
    margin:6px 0; padding-left:20px;
  }
  .terms-section li {
    font-size:10.5px; line-height:1.6; color:#A0ADB8;
    margin-bottom:4px;
  }
  .terms-section strong { color:#F0F4F8; font-weight:600; }
  .terms-section a { color:#38BDF8; text-decoration:none; }
  .terms-section a:hover { text-decoration:underline; }

  /* caja legal destacada */
  .legal-box {
    margin:10px 0; padding:10px 14px;
    border-radius:10px; font-size:10px; line-height:1.55;
    background:rgba(56,189,248,.06);
    border-left:3px solid #38BDF8;
    color:#B8C4D0;
  }
  .legal-box.warn {
    background:rgba(255,107,107,.07);
    border-left-color:#FF6B6B;
  }
  .legal-box.ok {
    background:rgba(0,170,136,.07);
    border-left-color:#00AA88;
  }
  .legal-box strong { color:#F0F4F8; }

  /* tabla de datos */
  .terms-table {
    width:100%; border-collapse:collapse; margin:10px 0;
    font-size:9.5px;
  }
  .terms-table th {
    text-align:left; padding:7px 9px;
    background:rgba(56,189,248,.08);
    color:#7DD3FC; font-weight:600;
    letter-spacing:.08em; text-transform:uppercase; font-size:8px;
    border-bottom:1px solid rgba(56,189,248,.2);
  }
  .terms-table td {
    padding:7px 9px; color:#A0ADB8;
    border-bottom:1px solid rgba(255,255,255,.05);
    vertical-align:top; line-height:1.45;
  }
  .terms-table tr:hover td { background:rgba(255,255,255,.02); }

  /* footer */
  .terms-foot {
    margin-top:28px; padding-top:20px;
    border-top:1px solid rgba(255,255,255,.08);
    text-align:center;
  }
  .terms-foot p { font-size:9.5px; color:#4C5563; line-height:1.6; }
  .terms-foot a { color:#38BDF8; text-decoration:none; }
  .terms-foot a:hover { text-decoration:underline; }
  .terms-actions {
    display:flex; gap:10px; justify-content:center;
    margin-top:16px; flex-wrap:wrap;
  }
  .terms-btn {
    padding:10px 20px; border-radius:10px; cursor:pointer;
    font-family:'Unbounded',sans-serif; font-weight:600; font-size:10px;
    letter-spacing:.06em; text-decoration:none; display:inline-flex;
    align-items:center; gap:6px; transition:.25s;
  }
  .terms-btn.primary {
    background:linear-gradient(90deg,#38BDF8,#00AA88);
    color:#04070B; border:none;
    box-shadow:0 10px 24px rgba(0,170,136,.3);
  }
  .terms-btn.primary:hover { transform:translateY(-2px); box-shadow:0 14px 32px rgba(56,189,248,.4); }
  .terms-btn.ghost {
    background:rgba(255,255,255,.05);
    border:1.5px solid rgba(255,255,255,.12);
    color:#7C8899;
  }
  .terms-btn.ghost:hover { border-color:#38BDF8; color:#38BDF8; }

  @media (max-width:560px) {
    .terms-shell { padding:16px 14px 48px; }
    .terms-head { margin-left:-14px; margin-right:-14px; padding:14px; }
    .terms-head h1 { font-size:14px; }
    .terms-section { padding:14px; }
    .terms-section h2 { font-size:11px; }
  }
`;

/* ══════════════════════════════════════
   COMPONENTE
   ══════════════════════════════════════ */
export default function TermsPage() {
  const navigate = useNavigate();
  

  const today = new Date().toLocaleDateString('es-CL', {
    day: '2-digit', month: 'long', year: 'numeric',
  });

  return (
    <div className="terms-page">
      <style>{CSS}</style>

      <div className="terms-shell">
        {/* ── HEADER ── */}
        <header className="terms-head">
          <button className="terms-back" onClick={() => navigate(-1)} aria-label="Volver">←</button>
          <div>
            <h1>Términos y <em>Condiciones</em></h1>
            <p className="sub">GoCachy · Plataforma para reclutadores</p>
          </div>
        </header>

        <div className="terms-date">📅 Última actualización: {today}</div>

        {/* ── ÍNDICE ── */}
        <nav className="terms-toc">
          <h2>Índice</h2>
          <ol>
            <li><a href="#t1">Identificación del prestador</a></li>
            <li><a href="#t2">Aceptación de los términos</a></li>
            <li><a href="#t3">Descripción del servicio</a></li>
            <li><a href="#t4">Registro y datos personales</a></li>
            <li><a href="#t5">Datos falsos y veracidad</a></li>
            <li><a href="#t6">Protección de datos (Ley 19.628)</a></li>
            <li><a href="#t7">Derechos ARCO</a></li>
            <li><a href="#t8">Límite de almacenamiento 25 GB</a></li>
            <li><a href="#t9">Supresión y eliminación de cuentas</a></li>
            <li><a href="#t10">Uso aceptable y prohibido</a></li>
            <li><a href="#t11">Propiedad intelectual (Ley 17.336)</a></li>
            <li><a href="#t12">Responsabilidad</a></li>
            <li><a href="#t13">Ley del consumidor (Ley 19.496)</a></li>
            <li><a href="#t14">Ciberseguridad (Ley 20.575)</a></li>
            <li><a href="#t15">Cookies y rastreo</a></li>
            <li><a href="#t16">Menores de edad</a></li>
            <li><a href="#t17">Modificaciones</a></li>
            <li><a href="#t18">Ley aplicable y jurisdicción</a></li>
            <li><a href="#t19">Contacto</a></li>
          </ol>
        </nav>

        {/* ═══ 1 ═══ */}
        <section className="terms-section" id="t1">
          <h2><span className="num">1</span> Identificación del prestador</h2>
          <p>
            Este sitio web es operado bajo el nombre comercial <strong>GoCachy</strong> (en adelante,
            "la Plataforma"), una plataforma digital de reclutamiento y talento dirigida a
            reclutadores, empresas y profesionales.
          </p>
          <div className="legal-box">
            <strong>Responsable:</strong> GoCachy · Plataforma de reclutamiento digital.<br />
            <strong>Contacto:</strong> <a href="mailto:soporte@gocachy.com">soporte@gocachy.com</a><br />
            <strong>Jurisdicción:</strong> República de Chile.
          </div>
          <p>
            Al acceder o utilizar la Plataforma, el usuario declara haber leído, entendido y
            aceptado íntegramente los presentes Términos y Condiciones, conformes a lo dispuesto
            en los artículos <strong>1445</strong> y siguientes del <strong>Código Civil chileno</strong>.
          </p>
        </section>

        {/* ═══ 2 ═══ */}
        <section className="terms-section" id="t2">
          <h2><span className="num">2</span> Aceptación de los términos</h2>
          <p>
            La creación de una cuenta en GoCachy implica la aceptación <strong>expresa e
            irrevocable</strong> de estos Términos y Condiciones, así como de la Política de
            Privacidad.
          </p>
          <ul>
            <li>El usuario debe marcar la casilla <strong>"Acepto los términos y la privacidad"</strong> durante el registro.</li>
            <li>Si el usuario <strong>no está de acuerdo</strong> con alguna cláusula, no debe utilizar la Plataforma.</li>
            <li>La aceptación queda registrada con fecha, hora e IP del usuario para efectos probatorios.</li>
          </ul>
          <div className="legal-box ok">
            <strong>Base legal:</strong> Artículo 1445 del Código Civil — El contrato se forma por
            el consentimiento de las partes.
          </div>
        </section>

        {/* ═══ 3 ═══ */}
        <section className="terms-section" id="t3">
          <h2><span className="num">3</span> Descripción del servicio</h2>
          <p>GoCachy es una plataforma <strong>dirigida exclusivamente a reclutadores</strong> y profesionales del área de talento humano, que ofrece:</p>
          <ul>
            <li><strong>Publicación y gestión de vacantes</strong> laborales.</li>
            <li><strong>Recepción y filtrado de postulaciones</strong> de candidatos.</li>
            <li><strong>Búsqueda de perfiles</strong> profesionales según criterios del reclutador.</li>
            <li><strong>Comunicación directa</strong> entre reclutadores y candidatos.</li>
            <li><strong>Almacenamiento de documentos</strong> CV, cartas de presentación y antecedentes profesionales.</li>
          </ul>
          <p>
            La Plataforma es una <strong>herramienta de intermediación</strong>: no garantiza la
            contratación, ni la idoneidad de los candidatos, ni la veracidad de la información
            publicada por terceros.
          </p>
        </section>

        {/* ═══ 4 ═══ */}
        <section className="terms-section" id="t4">
          <h2><span className="num">4</span> Registro y datos personales</h2>
          <p>Para acceder a la Plataforma, el usuario debe crear una cuenta proporcionando:</p>
          <table className="terms-table">
            <thead>
              <tr>
                <th>Dato</th>
                <th>Obligatorio</th>
                <th>Finalidad</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Nombre completo</td>
                <td>Sí</td>
                <td>Identificación del usuario</td>
              </tr>
              <tr>
                <td>Username</td>
                <td>Sí</td>
                <td>Identificación pública única</td>
              </tr>
              <tr>
                <td>Correo electrónico</td>
                <td>Sí</td>
                <td>Login, notificaciones y recuperación</td>
              </tr>
              <tr>
                <td>Contraseña</td>
                <td>Sí</td>
                <td>Acceso cifrado a la cuenta</td>
              </tr>
              <tr>
                <td>Foto de perfil</td>
                <td>Sí</td>
                <td>Identificación visual en la plataforma</td>
              </tr>
              <tr>
                <td>CV / antecedentes</td>
                <td>No</td>
                <td>Perfil profesional del usuario</td>
              </tr>
            </tbody>
          </table>
          <p>
            Las contraseñas se almacenan <strong>hasheadas con bcrypt</strong> (costo 12) y en
            <strong> ningún caso se guardan en texto plano</strong>.
          </p>
          <div className="legal-box">
            <strong>Base legal:</strong> Ley 19.628, artículo 4 — Tratamiento de datos personales
            con consentimiento informado del titular.
          </div>
        </section>

        {/* ═══ 5 ═══ */}
        <section className="terms-section" id="t5">
          <h2><span className="num">5</span> Datos falsos y veracidad de la información</h2>
          <div className="legal-box warn">
            <strong>ADVERTENCIA LEGAL:</strong> El usuario se compromete a proporcionar
            <strong> exclusivamente datos veraces, reales y actualizados</strong>. El uso de
            información falsa, suplantación de identidad o documentos adulterados está
            <strong> estrictamente prohibido</strong> y puede constituir delito.
          </div>
          <h3>5.1 Obligación de veracidad</h3>
          <ul>
            <li>El usuario declara y garantiza que <strong>todos los datos ingresados son reales</strong> y corresponden a su persona.</li>
            <li>Queda <strong>expresamente prohibido</strong> usar nombres falsos, correos ajenos, fotos de terceros o currículums inventados.</li>
            <li>El usuario se <strong>compromete a no facilitar información falsa</strong> en ningún campo del registro ni en su perfil profesional.</li>
            <li>Los reclutadores que publiquen vacantes falsas serán <strong>suspendidos permanentemente</strong>.</li>
          </ul>
          <h3>5.2 Consecuencias del uso de datos falsos</h3>
          <ol>
            <li><strong>Suspensión inmediata</strong> de la cuenta sin previo aviso.</li>
            <li><strong>Eliminación definitiva</strong> del perfil y todos sus datos.</li>
            <li><strong>Denuncia ante las autoridades</strong> competentes por posible delito.</li>
          </ol>
          <div className="legal-box warn">
            <strong>Delitos aplicables (Código Penal chileno):</strong>
            <ul style={{ marginTop: 6 }}>
              <li><strong>Art. 196</strong> — Suplantación de identidad: pena de 61 días a 3 años de presidio.</li>
              <li><strong>Art. 194 N°4</strong> — Falsificación de documentos: pena de 541 días a 3 años.</li>
              <li><strong>Art. 261 N°1</strong> — Suplantación de personalidad.</li>
            </ul>
          </div>
        </section>

        {/* ═══ 6 ═══ */}
        <section className="terms-section" id="t6">
          <h2><span className="num">6</span> Protección de datos personales (Ley 19.628)</h2>
          <p>
            GoCachy trata los datos personales de sus usuarios conforme a la
            <strong> Ley 19.628 sobre Protección de la Vida Privada</strong> y sus modificatorias.
          </p>
          <h3>6.1 Principios aplicados</h3>
          <ul>
            <li><strong>Consentimiento:</strong> el usuario otorga su consentimiento al registrarse.</li>
            <li><strong>Finalidad:</strong> los datos se usan exclusivamente para las finalidades informadas.</li>
            <li><strong>Proporcionalidad:</strong> solo se recolectan los datos necesarios.</li>
            <li><strong>Calidad:</strong> los datos deben mantenerse actualizados y exactos.</li>
            <li><strong>Seguridad:</strong> se aplican medidas técnicas y organizativas para protegerlos.</li>
          </ul>
          <h3>6.2 Encargado del tratamiento</h3>
          <p>
            GoCachy actúa como <strong>encargado del tratamiento</strong> de los datos personales
            ingresados por el usuario. Los datos se almacenan en <strong>Microsoft Azure Cosmos DB</strong>
            y <strong>Azure Blob Storage</strong>, con cifrado en tránsito (TLS 1.2+) y en reposo.
          </p>
          <h3>6.3 Conservación</h3>
          <p>
            Los datos se conservan mientras la cuenta esté activa o según lo exija la ley.
            Al eliminar la cuenta, los datos se suprimen en un plazo máximo de
            <strong> 30 días corridos</strong>.
          </p>
        </section>

        {/* ═══ 7 ═══ */}
        <section className="terms-section" id="t7">
          <h2><span className="num">7</span> Derechos ARCO del titular</h2>
          <p>Conforme a la Ley 19.628, el usuario titular tiene derecho a:</p>
          <table className="terms-table">
            <thead>
              <tr>
                <th>Derecho</th>
                <th>Descripción</th>
                <th>Cómo ejercerlo</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>A</strong> — Acceso</td>
                <td>Saber qué datos personales tiene GoCachy sobre usted</td>
                <td>Email a soporte@gocachy.com</td>
              </tr>
              <tr>
                <td><strong>R</strong> — Rectificación</td>
                <td>Corregir datos inexactos o incompletos</td>
                <td>Editar perfil o enviar solicitud</td>
              </tr>
              <tr>
                <td><strong>C</strong> — Cancelación</td>
                <td>Eliminar datos cuando ya no sean necesarios</td>
                <td>Solicitud escrita por email</td>
              </tr>
              <tr>
                <td><strong>O</strong> — Oposición</td>
                <td>Oponerse al tratamiento de sus datos</td>
                <td>Solicitud escrita por email</td>
              </tr>
            </tbody>
          </table>
          <div className="legal-box ok">
            <strong>Plazo de respuesta:</strong> máximo <strong>10 días hábiles</strong> desde la
            recepción de la solicitud, conforme a la Ley 19.628, artículo 28.
          </div>
        </section>

        {/* ═══ 8 ═══ */}
        <section className="terms-section" id="t8">
          <h2><span className="num">8</span> Límite de almacenamiento: 25 GB</h2>
          <div className="legal-box warn">
            <strong>LÍMITE DE ALMACENAMIENTO:</strong> Cada cuenta de usuario tiene un límite
            máximo de <strong>25 GB (veinticinco gigabytes)</strong> de almacenamiento para
            documentos, CVs, fotos y archivos subidos a la plataforma.
          </div>
          <h3>8.1 ¿Qué incluye el límite?</h3>
          <ul>
            <li>Foto de perfil y galería de imágenes</li>
            <li>CVs, cartas de presentación y portafolios</li>
            <li>Archivos adjuntos en mensajes y vacantes</li>
            <li>Respaldos de la cuenta</li>
          </ul>
          <h3>8.2 Exceder el límite</h3>
          <ol>
            <li>Al llegar al <strong>80% (20 GB)</strong>: notificación por correo y en la plataforma.</li>
            <li>Al llegar al <strong>95% (23.75 GB)</strong>: bloqueo temporal de nuevas subidas.</li>
            <li>Al llegar al <strong>100% (25 GB)</strong>: <strong>GoCachy se reserva el derecho de eliminar automáticamente</strong> los archivos más antiguos hasta liberar espacio, o en su defecto, <strong>eliminar la cuenta completa</strong> si el usuario no subsana la situación en <strong>15 días corridos</strong>.</li>
          </ol>
          <div className="legal-box">
            <strong>Nota:</strong> el usuario será notificado por correo electrónico con
            <strong> mínimo 15 días de anticipación</strong> antes de cualquier eliminación
            automática, conforme a los principios de buena fe del artículo 1546 del Código Civil.
          </div>
        </section>

        {/* ═══ 9 ═══ */}
        <section className="terms-section" id="t9">
          <h2><span className="num">9</span> Supresión y eliminación de cuentas</h2>
          <h3>9.1 Eliminación voluntaria por el usuario</h3>
          <p>El usuario puede eliminar su cuenta en cualquier momento desde <strong>Configuración → Eliminar cuenta</strong>. Al hacerlo:</p>
          <ul>
            <li>Se eliminan todos los datos personales, CVs y archivos adjuntos.</li>
            <li>La eliminación se completa en un máximo de <strong>30 días corridos</strong>.</li>
            <li>Los datos se borran de forma <strong>irreversible e intransferible</strong>.</li>
          </ul>
          <h3>9.2 Eliminación por GoCachy</h3>
          <p>GoCachy puede eliminar o suspender cuentas cuando:</p>
          <ul>
            <li>Se exceda el límite de <strong>25 GB</strong> sin subsanar en 15 días.</li>
            <li>Se detecte <strong>uso de datos falsos</strong> o suplantación de identidad.</li>
            <li>Se infrinja el <strong>uso aceptable</strong> (sección 10).</li>
            <li>La cuenta esté <strong>inactiva por más de 24 meses</strong>.</li>
            <li>Se requiera por <strong>orden judicial</strong> o resolución de autoridad competente.</li>
          </ul>
          <div className="legal-box">
            <strong>Notificación previa:</strong> salvo orden judicial o delito flagrante, GoCachy
            notificará al usuario por correo con <strong>mínimo 15 días</strong> antes de
            eliminar la cuenta.
          </div>
        </section>

        {/* ═══ 10 ═══ */}
        <section className="terms-section" id="t10">
          <h2><span className="num">10</span> Uso aceptable y prohibido</h2>
          <h3>10.1 Usos permitidos</h3>
          <ul>
            <li>Publicar vacantes laborales <strong>legítimas y reales</strong>.</li>
            <li>Buscar y contactar candidatos para <strong>fines de reclutamiento honesto</strong>.</li>
            <li>Subir documentos propios o con autorización del titular.</li>
            <li>Usar la plataforma conforme a la <strong>buena fe</strong> (art. 1546 Código Civil).</li>
          </ul>
          <h3>10.2 Usos prohibidos</h3>
          <div className="legal-box warn">
            <ul>
              <li>Publicar <strong>vacantes falsas</strong>, estafas o fraudes laborales.</li>
              <li>Solicitar <strong>pagos a candidatos</strong> (prohibido por ley chilena).</li>
              <li>Suplantar identidades o usar <strong>datos de terceros</strong> sin autorización.</li>
              <li>Enviar <strong>spam</strong>, cadenas, o mensajes masivos no solicitados.</li>
              <li>Intentar <strong>acceder sin autorización</strong> a cuentas ajenas.</li>
              <li>Subir <strong>malware, virus</strong> o archivos dañinos.</li>
              <li>Discriminar por raza, género, religión, orientación sexual o discapacidad
                  (<strong>Ley 20.805 y Código del Trabajo</strong>).</li>
              <li>Recolectar datos de usuarios para <strong>fines ajenos</strong> a la plataforma.</li>
            </ul>
          </div>
        </section>

        {/* ═══ 11 ═══ */}
        <section className="terms-section" id="t11">
          <h2><span className="num">11</span> Propiedad intelectual (Ley 17.336)</h2>
          <p>
            Todos los elementos de la Plataforma (código, diseño, logo, marca, textos,
            ilustraciones y animaciones) son propiedad de GoCachy o de sus licenciantes,
            protegidos por la <strong>Ley 17.336 de Propiedad Intelectual</strong>.
          </p>
          <ul>
            <li>El usuario <strong>no puede copiar, distribuir, modificar o revender</strong> el contenido de la Plataforma.</li>
            <li>Los <strong>CVs y documentos</strong> subidos pertenecen a sus autores.</li>
            <li>Al subir contenido, el usuario otorga a GoCachy una <strong>licencia limitada</strong> para almacenarlo, mostrarlo y transmitirlo dentro de la plataforma.</li>
            <li>La licencia termina cuando el contenido o la cuenta se eliminan.</li>
          </ul>
        </section>

        {/* ═══ 12 ═══ */}
        <section className="terms-section" id="t12">
          <h2><span className="num">12</span> Limitación de responsabilidad</h2>
          <p>GoCachy presta el servicio <strong>"tal cual"</strong> (as-is) y <strong>no garantiza</strong>:</p>
          <ul>
            <li>La <strong>contratación</strong> de candidatos ni la obtención de empleo.</li>
            <li>La <strong>veracidad</strong> de la información publicada por otros usuarios.</li>
            <li>La <strong>idoneidad</strong> de los reclutadores o candidatos.</li>
            <li>Disponibilidad <strong>ininterrumpida</strong> del servicio (puede haber mantenimiento).</li>
          </ul>
          <div className="legal-box">
            <strong>Responsabilidad máxima:</strong> En la medida permitida por la ley, GoCachy
            no será responsable por daños indirectos, lucro cesante o pérdida de datos derivados
            del uso o imposibilidad de uso de la plataforma. Nuestra responsabilidad total se
            limita al <strong>monto pagado por el usuario en los últimos 3 meses</strong>, o
            $0 si el servicio es gratuito.
          </div>
        </section>

        {/* ═══ 13 ═══ */}
        <section className="terms-section" id="t13">
          <h2><span className="num">13</span> Derechos del consumidor (Ley 19.496)</h2>
          <p>
            Si GoCachy presta <strong>servicios pagos</strong>, el usuario es considerado
            consumidor conforme a la <strong>Ley 19.496 de Protección de los Derechos de los
            Consumidores</strong>.
          </p>
          <ul>
            <li><strong>Derecho a información clara</strong> sobre precios y condiciones.</li>
            <li><strong>Derecho a retracto</strong> dentro de <strong>10 días</strong> desde la compra (art. 3° letra e).</li>
            <li><strong>Derecho a reclamar</strong> por calidad del servicio.</li>
            <li>GoCachy se somete a los <strong>Servicios de Atención al Consumidor (SERNAC)</strong>.</li>
          </ul>
          <div className="legal-box ok">
            <strong>SERNAC:</strong> <a href="https://www.sernac.cl" target="_blank" rel="noreferrer">www.sernac.cl</a>
            · Teléfono <strong>800 700 300</strong> (gratuito).
          </div>
        </section>

        {/* ═══ 14 ═══ */}
        <section className="terms-section" id="t14">
          <h2><span className="num">14</span> Ciberseguridad y delitos informáticos</h2>
          <p>
            GoCachy implementa medidas de seguridad acordes a la <strong>Ley 20.575</strong>
            y al <strong>artículo 496 del Código Penal</strong> (acceso ilícito a sistemas informáticos).
          </p>
          <ul>
            <li><strong>Cifrado TLS 1.2+</strong> en todas las comunicaciones.</li>
            <li><strong>Hash bcrypt</strong> para contraseñas (nunca en texto plano).</li>
            <li><strong>Cifrado en reposo</strong> de datos en Azure Cosmos DB.</li>
            <li><strong>Registro de accesos</strong> (logs) para detección de intrusiones.</li>
            <li>El usuario es responsable de <strong>mantener su contraseña segura</strong> y no compartirla.</li>
          </ul>
          <div className="legal-box warn">
            <strong>Delitos aplicables:</strong> Artículo <strong>496 N°5</strong> del Código
            Penal — acceso a sistemas informáticos ajenos sin autorización: pena de
            <strong> 61 días a 5 años</strong> de presidio menor.
          </div>
        </section>

        {/* ═══ 15 ═══ */}
        <section className="terms-section" id="t15">
          <h2><span className="num">15</span> Cookies y tecnologías de rastreo</h2>
          <p>GoCachy utiliza:</p>
          <ul>
            <li><strong>Cookies técnicas</strong> (necesarias para el login y la sesión).</li>
            <li><strong>Tokens de autenticación</strong> almacenados localmente en el navegador.</li>
            <li><strong>Almacenamiento local</strong> para preferencias de interfaz.</li>
          </ul>
          <p>
            No utilizamos cookies de publicidad de terceros. El usuario puede eliminar las
            cookies desde la configuración de su navegador; sin embargo, esto cerrará su sesión.
          </p>
          <div className="legal-box">
            <strong>Base legal:</strong> Ley 19.628 — El usuario es informado del uso de cookies
            al aceptar estos términos.
          </div>
        </section>

        {/* ═══ 16 ═══ */}
        <section className="terms-section" id="t16">
          <h2><span className="num">16</span> Menores de edad</h2>
          <div className="legal-box warn">
            <strong>RESTRICCIÓN:</strong> La Plataforma está dirigida a personas
            <strong> mayores de 18 años</strong>. El registro de menores de edad está prohibido.
          </div>
          <p>
            Conforme al <strong>artículo 1446 del Código Civil</strong>, los menores de 18 años
            no pueden celebrar contratos válidamente sin autorización de sus representantes
            legales. Si GoCachy detecta una cuenta de menor de edad, procederá a su
            <strong> eliminación inmediata</strong>.
          </p>
          <p>
            Para contratos de trabajo o prácticas profesionales de jóvenes entre 15 y 18 años,
            se aplicará el <strong>Código del Trabajo</strong> (artículos 28 y siguientes).
          </p>
        </section>

        {/* ═══ 17 ═══ */}
        <section className="terms-section" id="t17">
          <h2><span className="num">17</span> Modificaciones de los términos</h2>
          <ul>
            <li>GoCachy puede actualizar estos términos en cualquier momento.</li>
            <li>Los cambios sustanciales serán notificados por correo con <strong>15 días de anticipación</strong>.</li>
            <li>El uso continuado tras la notificación implica <strong>aceptación</strong> de los nuevos términos.</li>
            <li>El usuario puede rechazar los cambios eliminando su cuenta antes de la fecha efectiva.</li>
            <li>La fecha de la última actualización siempre aparecerá al inicio de este documento.</li>
          </ul>
        </section>

        {/* ═══ 18 ═══ */}
        <section className="terms-section" id="t18">
          <h2><span className="num">18</span> Ley aplicable y jurisdicción</h2>
          <div className="legal-box ok">
            <strong>LEY APLICABLE:</strong> Estos Términos se rigen por las leyes de la
            <strong> República de Chile</strong>, en particular:
            <ul style={{ marginTop: 6 }}>
              <li><strong>Código Civil</strong> (contratos, obligaciones, buena fe)</li>
              <li><strong>Ley 19.628</strong> (protección de datos personales)</li>
              <li><strong>Ley 19.496</strong> (derechos del consumidor)</li>
              <li><strong>Ley 17.336</strong> (propiedad intelectual)</li>
              <li><strong>Ley 20.575</strong> (protección de datos en sistemas informáticos)</li>
            </ul>
          </div>
          <div className="legal-box">
            <strong>JURISDICCIÓN:</strong> Para cualquier controversia derivada de estos términos,
            las partes se someten a los tribunales de justicia de
            <strong> Santiago de Chile</strong>, renunciando a cualquier otro fuero que pudiere
            corresponderles (art. 42 Código de Procedimiento Civil).
          </div>
          <p>
            Previo a cualquier acción judicial, las partes se comprometen a intentar una
            <strong> solución amigable</strong> por correo electrónico durante un plazo de
            <strong> 30 días corridos</strong>.
          </p>
        </section>

        {/* ═══ 19 ═══ */}
        <section className="terms-section" id="t19">
          <h2><span className="num">19</span> Contacto y consultas</h2>
          <p>Para consultas sobre estos términos, protección de datos o ejercer sus derechos ARCO:</p>
          <table className="terms-table">
            <thead>
              <tr>
                <th>Medio</th>
                <th>Detalle</th>
                <th>Plazo de respuesta</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Email</strong></td>
                <td>soporte@gocachy.com</td>
                <td>10 días hábiles</td>
              </tr>
              <tr>
                <td><strong>Asunto</strong></td>
                <td>"Derechos ARCO" o "Consulta Términos"</td>
                <td>—</td>
              </tr>
              <tr>
                <td><strong>SERNAC</strong></td>
                <td>www.sernac.cl · 800 700 300</td>
                <td>Según SERNAC</td>
              </tr>
            </tbody>
          </table>
          <div className="legal-box">
            <strong>La solicitud debe incluir:</strong> nombre completo, RUT, correo registrado,
            descripción del derecho que desea ejercer y copia de cédula de identidad.
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="terms-foot">
          <p>
            Al continuar navegando en GoCachy, usted confirma haber leído y aceptado
            estos <strong>Términos y Condiciones</strong> en su totalidad.
          </p>
          <div className="terms-actions">
            <button className="terms-btn primary" onClick={() => navigate(-1)}>
              ← Volver al registro
            </button>
            <Link to="/login" className="terms-btn ghost">
              Ir al login
            </Link>
          </div>
          <p style={{ marginTop: 18 }}>
            GoCachy © {new Date().getFullYear()} · Santiago, Chile<br />
            <a href="#">Política de Privacidad</a> · <a href="#">Términos y Condiciones</a>
          </p>
        </footer>
      </div>
    </div>
  );
}