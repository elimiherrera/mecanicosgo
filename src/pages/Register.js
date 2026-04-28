import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const SPECIALTIES = [
  'Mecánica General', 'Motores', 'Frenos', 'Suspensión', 'Eléctrico',
  'Aire Acondicionado', 'Carrocería', 'Pintura', 'Lámina', 'Transmisiones',
  'Mantenimiento Preventivo', 'Diagnóstico', 'Ruedas', 'Escape', 'Diesel',
];

function UserRegister({ onSuccess }) {
  const { registerUser } = useApp();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    if (form.password !== form.confirm) { setError('Las contraseñas no coinciden.'); return; }
    if (form.password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres.'); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    const res = registerUser({ name: form.name, email: form.email, phone: form.phone, password: form.password });
    setLoading(false);
    if (!res.success) { setError(res.error); return; }
    onSuccess('/inicio');
  }

  return (
    <form onSubmit={submit} className="form-stack">
      {error && <div className="alert alert-error">⚠️ {error}</div>}
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Nombre completo</label>
          <input className="form-input" value={form.name} onChange={set('name')} placeholder="Juan García" required />
        </div>
        <div className="form-group">
          <label className="form-label">Teléfono</label>
          <input className="form-input" value={form.phone} onChange={set('phone')} placeholder="7000-0000" />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Correo electrónico</label>
        <input type="email" className="form-input" value={form.email} onChange={set('email')} placeholder="tucorreo@ejemplo.com" required />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Contraseña</label>
          <input type="password" className="form-input" value={form.password} onChange={set('password')} placeholder="Mínimo 6 caracteres" required />
        </div>
        <div className="form-group">
          <label className="form-label">Confirmar contraseña</label>
          <input type="password" className="form-input" value={form.confirm} onChange={set('confirm')} placeholder="Repite la contraseña" required />
        </div>
      </div>
      <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
        {loading ? <span className="spinner" /> : '✅ Crear mi Cuenta'}
      </button>
    </form>
  );
}

function MechanicRegister({ onSuccess }) {
  const { registerMechanic } = useApp();
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [mech, setMech] = useState({ name: '', email: '', phone: '', password: '', confirm: '', experience: '' });
  const [shop, setShop] = useState({
    name: '', description: '', address: '', phone: '', whatsapp: '', email: '',
    coordinates: { lat: '13.7394', lng: '-89.6699' },
    specialties: [],
  });

  const setM = (k) => (e) => setMech((f) => ({ ...f, [k]: e.target.value }));
  const setS = (k) => (e) => setShop((f) => ({ ...f, [k]: e.target.value }));

  function toggleSpecialty(s) {
    setShop((f) => ({
      ...f,
      specialties: f.specialties.includes(s) ? f.specialties.filter((x) => x !== s) : [...f.specialties, s],
    }));
  }

  function nextStep(e) {
    e.preventDefault();
    setError('');
    if (mech.password !== mech.confirm) { setError('Las contraseñas no coinciden.'); return; }
    if (mech.password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres.'); return; }
    setStep(2);
  }

  async function submit(e) {
    e.preventDefault();
    if (!shop.name) { setError('El nombre del taller es requerido.'); return; }
    if (!shop.address) { setError('La dirección es requerida.'); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    const workshopData = {
      ...shop,
      coordinates: {
        lat: parseFloat(shop.coordinates.lat) || 13.7394,
        lng: parseFloat(shop.coordinates.lng) || -89.6699,
      },
    };
    const res = registerMechanic(
      { name: mech.name, email: mech.email, phone: mech.phone, password: mech.password, experience: mech.experience },
      workshopData
    );
    setLoading(false);
    if (!res.success) { setError(res.error); setStep(1); return; }
    onSuccess('/panel');
  }

  return (
    <div>
      <div className="steps">
        {['Datos Personales', 'Datos del Taller'].map((label, i) => (
          <div key={label} className={`step-item ${step === i + 1 ? 'active' : step > i + 1 ? 'done' : ''}`}>
            <div className="step-num">{step > i + 1 ? '✓' : i + 1}</div>
            {label}
          </div>
        ))}
      </div>

      {error && <div className="alert alert-error" style={{ marginBottom: '1rem' }}>⚠️ {error}</div>}

      {step === 1 && (
        <form onSubmit={nextStep} className="form-stack">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Nombre completo</label>
              <input className="form-input" value={mech.name} onChange={setM('name')} placeholder="Carlos Mejía" required />
            </div>
            <div className="form-group">
              <label className="form-label">Teléfono</label>
              <input className="form-input" value={mech.phone} onChange={setM('phone')} placeholder="7000-0000" required />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Correo electrónico</label>
            <input type="email" className="form-input" value={mech.email} onChange={setM('email')} placeholder="mecánico@ejemplo.com" required />
          </div>
          <div className="form-group">
            <label className="form-label">Años de experiencia</label>
            <input type="number" className="form-input" value={mech.experience} onChange={setM('experience')} placeholder="Ej: 10" min="0" max="60" />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Contraseña</label>
              <input type="password" className="form-input" value={mech.password} onChange={setM('password')} placeholder="Mínimo 6 caracteres" required />
            </div>
            <div className="form-group">
              <label className="form-label">Confirmar contraseña</label>
              <input type="password" className="form-input" value={mech.confirm} onChange={setM('confirm')} placeholder="Repite" required />
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-block btn-lg">Siguiente →</button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={submit} className="form-stack">
          <div className="form-group">
            <label className="form-label">Nombre del Taller *</label>
            <input className="form-input" value={shop.name} onChange={setS('name')} placeholder="Ej: Taller Los Mecánicos" required />
          </div>
          <div className="form-group">
            <label className="form-label">Descripción</label>
            <textarea className="form-textarea" value={shop.description} onChange={setS('description')} placeholder="Describe los servicios que ofreces, tu experiencia, etc." rows={3} />
          </div>
          <div className="form-group">
            <label className="form-label">Dirección completa *</label>
            <input className="form-input" value={shop.address} onChange={setS('address')} placeholder="Ej: 5a Calle Poniente #10, Izalco, Sonsonate" required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Teléfono del taller</label>
              <input className="form-input" value={shop.phone} onChange={setS('phone')} placeholder="2453-0000" />
            </div>
            <div className="form-group">
              <label className="form-label">WhatsApp</label>
              <input className="form-input" value={shop.whatsapp} onChange={setS('whatsapp')} placeholder="70000000" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Correo del taller (opcional)</label>
            <input type="email" className="form-input" value={shop.email} onChange={setS('email')} placeholder="taller@ejemplo.com" />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Latitud (GPS)</label>
              <input className="form-input" value={shop.coordinates.lat} onChange={(e) => setShop((f) => ({ ...f, coordinates: { ...f.coordinates, lat: e.target.value } }))} placeholder="13.7394" />
              <span className="form-hint">Predeterminado: Centro de Izalco</span>
            </div>
            <div className="form-group">
              <label className="form-label">Longitud (GPS)</label>
              <input className="form-input" value={shop.coordinates.lng} onChange={(e) => setShop((f) => ({ ...f, coordinates: { ...f.coordinates, lng: e.target.value } }))} placeholder="-89.6699" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Especialidades</label>
            <div className="chip-list">
              {SPECIALTIES.map((s) => (
                <button key={s} type="button" className={`chip ${shop.specialties.includes(s) ? 'selected' : ''}`} onClick={() => toggleSpecialty(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '.75rem' }}>
            <button type="button" className="btn btn-ghost" onClick={() => { setStep(1); setError(''); }}>← Atrás</button>
            <button type="submit" className="btn btn-primary btn-lg" style={{ flex: 1 }} disabled={loading}>
              {loading ? <span className="spinner" /> : '🎉 Registrar Taller'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentUser } = useApp();
  const [tab, setTab] = useState(searchParams.get('tipo') === 'mecanico' ? 'mechanic' : 'user');

  useEffect(() => {
    if (currentUser) navigate(currentUser.role === 'mechanic' ? '/panel' : '/inicio');
  }, [currentUser, navigate]);

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>🔧</div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '.75rem' }}>Únete a MecánicosGo</h2>
        <p style={{ opacity: .75, lineHeight: 1.7, marginBottom: '2rem' }}>
          Plataforma de talleres mecánicos verificados para Izalco y sus alrededores.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
          {['🔍 Encuentra talleres verificados cercanos', '📅 Agenda citas en línea fácilmente', '⭐ Lee reseñas y califica servicios', '📍 Ver ubicación en mapa', '🔔 Notificaciones en tiempo real'].map((t) => (
            <div key={t} style={{ fontSize: '.85rem', color: 'rgba(255,255,255,.75)', display: 'flex', gap: '.5rem' }}>
              {t}
            </div>
          ))}
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card" style={{ maxWidth: '560px' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '.35rem' }}>Crear Cuenta</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '.875rem', marginBottom: '1.5rem' }}>
            ¿Ya tienes cuenta? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Inicia sesión</Link>
          </p>

          <div className="tabs">
            <button className={`tab ${tab === 'user' ? 'active' : ''}`} onClick={() => setTab('user')}>
              🚗 Soy Usuario
            </button>
            <button className={`tab ${tab === 'mechanic' ? 'active' : ''}`} onClick={() => setTab('mechanic')}>
              🔧 Soy Mecánico
            </button>
          </div>

          {tab === 'user' ? (
            <UserRegister onSuccess={(path) => navigate(path)} />
          ) : (
            <MechanicRegister onSuccess={(path) => navigate(path)} />
          )}
        </div>
      </div>
    </div>
  );
}
