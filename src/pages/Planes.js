import React from 'react';
import { useNavigate } from 'react-router-dom';

// ─── EDITA AQUÍ TUS PLANES: nombres, precios y características ──────────────
const PLANS = [
  {
    id: 'basico',
    name: 'Plan Básico',
    priceAnual: 155,
    priceMonthly: 13,
    description: 'Ideal para el mantenimiento esencial de tu vehículo.',
    featured: false,
    features: [
      { label: 'Directorio digital de mecanicos', included: true },
      { label: 'Sistema de cotizacion y agenda de reservas', included: true },
      { label: '1 Afinado menor', included: true },
      { label: '1 Cambio de aceite de motor', included: true },
      { label: 'Cambio de refrigerante de motor', included: true },
      { label: 'Limpieza y ajustes de frenos', included: true },
      { label: 'Lavado de vehiculo', included: false },
      { label: 'Afinado mayor', included: false },
      { label: 'Limpieza y cambio de Bujias', included: false },
      { label: 'Diagnostico de sistema electrico de carga y bateria', included: false },
    ],
  },
  {
    id: 'intermedio',
    name: 'Plan Intermedio',
    priceAnual: 300,
    priceMonthly: 25,
    description: 'Mayor cobertura para conductores más exigentes.',
    featured: true,
    features: [
      { label: 'Directorio digital de mecanicos', included: true },
      { label: 'Sistema de cotizacion y agenda de reservas', included: true },
      { label: '1 Afinado menor', included: true },
      { label: '1 Afinado mayor', included: true },
      { label: '1 Lavado de vehiculo', included: true },
      { label: '1 Cambio de aceite de motor', included: true },
      { label: 'Cambio de refrigerante de motor', included: true },
      { label: 'Limpieza y ajustes de frenos', included: true },
      { label: 'Limpieza y cambio de Bujias', included: true },
      { label: 'Diagnostico de sistema electrico de carga y bateria', included: true },
      { label: 'Lectura de escaneo y borrar codigos ABS', included: false },
      { label: 'Limpieza de aire acondicionado', included: false },
      { label: 'Cambio de filtro de aire ', included: false },      
    ],
  },
  {
    id: 'premium',
    name: 'Plan Premium',
    priceAnual: 420,
    priceMonthly: 35,
    description: 'Cobertura total para tu máxima tranquilidad.',
    featured: false,
    features: [
      { label: 'Directorio digital de mecanicos', included: true },
      { label: 'Sistema de cotizacion y agenda de reservas', included: true },
      { label: '1 Afinado menor', included: true },
      { label: '1 Afinado mayor', included: true },
      { label: '1 Lavado de vehiculo', included: true },
      { label: '1 Cambio de aceite de motor', included: true },
      { label: 'Cambio de refrigerante de motor', included: true },
      { label: 'Limpieza y ajustes de frenos', included: true },
      { label: 'Limpieza y cambio de Bujias', included: true },
      { label: 'Diagnostico de sistema electrico de carga y bateria', included: true },
      { label: 'Lectura de escaneo y borrar codigos ABS', included: true },
      { label: 'Limpieza de aire acondicionado', included: true },
      { label: 'Cambio de filtro de aire ', included: true },
    ],
  },
];

// ─── EDITA AQUÍ LA TABLA COMPARATIVA ────────────────────────────────────────
// true = incluido, false = no incluido, o escribe un texto como '2/año'
const COMPARISON = [
  { feature: 'Afinaciones menores',       basico: true,        intermedio: true,        premium: true },
  { feature: 'Afinaciones mayores',       basico: false,       intermedio: true,        premium: true },
  { feature: 'Cambios de aceite',         basico: '1/año',     intermedio: '2/año',     premium: 'Ilimitado' },
  { feature: 'Lectura de escaneo y borrar', basico: false,       intermedio: false,       premium: true },
  { feature: 'Diagnóstico OBD',          basico: 'No Incluye',    intermedio: 'Avanzado',  premium: 'Completo' },
  { feature: 'Limpieza y ajustes de frenos',        basico: true,        intermedio: true,        premium: true },
  { feature: 'Limpieza de aire acondicionado',         basico: false,       intermedio: false,       premium: true },
  { feature: 'Limpieza y cambio de bujias',    basico: false,       intermedio: true,        premium: true },
];
// ────────────────────────────────────────────────────────────────────────────

function CarSVG() {
  return (
    <svg viewBox="0 0 540 270" xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', maxWidth: '500px', display: 'block', marginLeft: 'auto' }}>
      {/* shadow */}
      <ellipse cx="270" cy="263" rx="205" ry="9" fill="rgba(0,0,0,0.35)" />

      {/* spare tire on rear */}
      <circle cx="75" cy="122" r="27" fill="#1a1a1a" />
      <circle cx="75" cy="122" r="17" fill="#2e2e2e" />
      <circle cx="75" cy="122" r="7" fill="#111" />
      <line x1="75" y1="105" x2="75" y2="139" stroke="#111" strokeWidth="3" />
      <line x1="58" y1="112" x2="92" y2="132" stroke="#111" strokeWidth="3" />
      <line x1="58" y1="132" x2="92" y2="112" stroke="#111" strokeWidth="3" />

      {/* rear wheel */}
      <circle cx="156" cy="233" r="36" fill="#0f0f0f" />
      <circle cx="156" cy="233" r="26" fill="#1e1e1e" />
      <circle cx="156" cy="233" r="17" fill="#6a6a6a" />
      <circle cx="156" cy="233" r="8" fill="#1e1e1e" />
      <line x1="156" y1="207" x2="156" y2="259" stroke="#111" strokeWidth="4" />
      <line x1="130" y1="218" x2="182" y2="248" stroke="#111" strokeWidth="4" />
      <line x1="130" y1="248" x2="182" y2="218" stroke="#111" strokeWidth="4" />

      {/* front wheel */}
      <circle cx="400" cy="233" r="36" fill="#0f0f0f" />
      <circle cx="400" cy="233" r="26" fill="#1e1e1e" />
      <circle cx="400" cy="233" r="17" fill="#6a6a6a" />
      <circle cx="400" cy="233" r="8" fill="#1e1e1e" />
      <line x1="400" y1="207" x2="400" y2="259" stroke="#111" strokeWidth="4" />
      <line x1="374" y1="218" x2="426" y2="248" stroke="#111" strokeWidth="4" />
      <line x1="374" y1="248" x2="426" y2="218" stroke="#111" strokeWidth="4" />

      {/* running boards */}
      <rect x="97" y="200" width="372" height="11" rx="5" fill="#963700" />

      {/* lower body */}
      <rect x="78" y="148" width="408" height="60" rx="8" fill="#E85D04" />

      {/* rear panel */}
      <rect x="60" y="150" width="32" height="58" rx="6" fill="#CF4D00" />

      {/* front panel */}
      <rect x="456" y="150" width="36" height="58" rx="6" fill="#CF4D00" />

      {/* cab */}
      <path d="M122,148 L147,76 L182,59 L384,59 L418,76 L442,148 Z" fill="#E85D04" />

      {/* windshield */}
      <path d="M161,143 L180,69 L384,69 L403,143 Z" fill="#0a1e3d" fillOpacity="0.87" />

      {/* A-pillar front */}
      <path d="M403,143 L384,69 L418,76 L442,148 Z" fill="#CF4D00" />

      {/* A-pillar rear */}
      <path d="M161,143 L180,69 L147,76 L122,148 Z" fill="#CF4D00" />

      {/* roof */}
      <rect x="150" y="54" width="244" height="10" rx="5" fill="#CF4D00" />

      {/* roof rack base */}
      <rect x="159" y="46" width="228" height="9" rx="4" fill="#1a1a1a" />
      <rect x="166" y="38" width="6" height="11" rx="2" fill="#252525" />
      <rect x="258" y="38" width="6" height="11" rx="2" fill="#252525" />
      <rect x="350" y="38" width="6" height="11" rx="2" fill="#252525" />
      <rect x="163" y="33" width="200" height="7" rx="3" fill="#111" />

      {/* B-pillar (center door post) */}
      <rect x="280" y="148" width="8" height="60" fill="#CF4D00" />

      {/* body accent line */}
      <rect x="78" y="175" width="408" height="4" rx="2" fill="#CF4D00" />

      {/* door handles */}
      <rect x="182" y="170" width="22" height="5" rx="2.5" fill="#963700" />
      <rect x="322" y="170" width="22" height="5" rx="2.5" fill="#963700" />

      {/* headlight upper */}
      <rect x="477" y="153" width="16" height="13" rx="3" fill="#FFF9C4" fillOpacity="0.97" />
      {/* headlight lower DRL */}
      <rect x="477" y="169" width="16" height="7" rx="3" fill="#FFE082" fillOpacity="0.85" />

      {/* grille */}
      <rect x="487" y="183" width="11" height="26" rx="3" fill="#090909" />
      <rect x="487" y="188" width="11" height="2" fill="#1a1a1a" />
      <rect x="487" y="196" width="11" height="2" fill="#1a1a1a" />
      <rect x="487" y="204" width="11" height="2" fill="#1a1a1a" />

      {/* front bumper */}
      <rect x="458" y="207" width="32" height="8" rx="4" fill="#9E3900" />

      {/* tail light */}
      <rect x="62" y="158" width="12" height="22" rx="3" fill="#CC1111" fillOpacity="0.9" />

      {/* rear bumper */}
      <rect x="46" y="207" width="32" height="8" rx="4" fill="#9E3900" />
    </svg>
  );
}

function CellVal({ val }) {
  if (val === true)  return <span className="check-icon">✓</span>;
  if (val === false) return <span className="x-icon">✗</span>;
  return <span style={{ fontSize: '.8rem', fontWeight: 600, color: '#475569' }}>{val}</span>;
}

export default function Planes() {
  const navigate = useNavigate();

  return (
    <div>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="planes-hero">
        <div className="planes-hero-inner">
          <div className="planes-hero-left">
            <span className="planes-hero-tag">MecánicosGo — Planes</span>
            <h1 className="planes-hero-title">
              ¡Elige el plan <span>perfecto</span><br />para tu vehículo!
            </h1>
            <p className="planes-hero-sub">
              Protege tu auto con el respaldo de los mejores mecánicos
              certificados de Izalco, El Salvador. Cobertura completa, precio justo.
            </p>
            <div className="planes-hero-stats">
              {[['3+', 'Talleres'], ['15+', 'Mecánicos'], ['5★', 'Calificación'], ['Izalco', 'Cobertura']].map(([v, l]) => (
                <div key={l} className="planes-stat">
                  <span className="planes-stat-val">{v}</span>
                  <span className="planes-stat-label">{l}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="planes-hero-car">
            <CarSVG />
          </div>
        </div>
      </section>

      {/* ── PLAN CARDS ───────────────────────────────────────── */}
      <section className="plans-section">
        <div className="plans-section-header">
          <p className="plans-eyebrow">Precios</p>
          <h2 className="plans-title">
            Un plan para cada tipo de <span>conductor</span>.
          </h2>
          <p className="plans-subtitle">
            Planes anuales con cobertura completa. Cancela cuando quieras.
          </p>
        </div>

        <div className="plans-grid">
          {PLANS.map(plan => (
            <div key={plan.id} className={`plan-card${plan.featured ? ' featured' : ''}`}>
              <div className="plan-header">
                {plan.featured && <span className="plan-badge">⭐ Más popular</span>}
                <div className="plan-name">{plan.name}</div>
                <div className="plan-desc">{plan.description}</div>
                <div className="plan-price-block">
                  <div className="plan-price">
                    <sup>$</sup>{plan.priceAnual}
                  </div>
                  <div className="plan-price-period">
                    /anual &nbsp;·&nbsp; <strong>${plan.priceMonthly}</strong>/mes
                  </div>
                </div>
              </div>

              <div className="plan-divider" />

              <ul className="plan-features">
                {plan.features.map((f, i) => (
                  <li key={i} className={`plan-feature${f.included ? '' : ' disabled'}`}>
                    <span className={f.included ? 'plan-feature-check' : 'plan-feature-x'}>
                      {f.included ? '✓' : '✗'}
                    </span>
                    {f.label}
                  </li>
                ))}
              </ul>

              <div className="plan-footer">
                <button
                  className={`btn btn-block btn-lg ${plan.featured ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => navigate('/registro')}
                >
                  Seleccionar plan
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── COMPARISON TABLE ─────────────────────────────────── */}
      <section className="comparison-section">
        <div className="comparison-inner">
          <div style={{ textAlign: 'center', marginBottom: '2.25rem' }}>
            <h2 className="section-title" style={{ fontSize: '1.5rem' }}>
              ¿No estás seguro de cuál elegir?
            </h2>
            <p className="section-subtitle" style={{ marginTop: '.4rem' }}>
              Compara las características de cada plan.
            </p>
          </div>

          <div className="scroll-x">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th style={{ textAlign: 'left' }}>Característica</th>
                  <th>Básico</th>
                  <th className="featured-col">Intermedio</th>
                  <th>Premium</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={i}>
                    <td>{row.feature}</td>
                    <td><CellVal val={row.basico} /></td>
                    <td><CellVal val={row.intermedio} /></td>
                    <td><CellVal val={row.premium} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ────────────────────────────────────────── */}
      <section className="planes-cta">
        <h2 className="planes-cta-title">¿Listo para proteger tu vehículo?</h2>
        <p className="planes-cta-sub">
          Únete a cientos de conductores satisfechos en Izalco.
        </p>
        <div className="planes-cta-btns">
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/registro')}>
            Comenzar ahora
          </button>
          <button className="btn btn-lg planes-cta-ghost" onClick={() => navigate('/login')}>
            Iniciar sesión
          </button>
        </div>
      </section>

    </div>
  );
}
