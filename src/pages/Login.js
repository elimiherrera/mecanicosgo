import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const DEMO = {
  mechanic: [
    { email: 'carlos@talleres.sv', pass: '123456', name: 'Carlos Mejía (Taller El Volcán)' },
    { email: 'roberto@mecanico.sv', pass: '123456', name: 'Roberto Flores (Auto Servicio Flores)' },
    { email: 'ana@taller.sv', pass: '123456', name: 'Ana Hernández (Taller Hernández)' },
  ],
  user: [
    { email: 'maria@gmail.com', pass: '123456', name: 'María López' },
    { email: 'jose@gmail.com', pass: '123456', name: 'José Martínez' },
  ],
};

export default function Login() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [role, setRole] = useState('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    const result = login(email, password);
    setLoading(false);
    if (!result.success) { setError(result.error); return; }
    if (result.user.role !== role) {
      setError(`Esta cuenta es de tipo "${result.user.role === 'mechanic' ? 'mecánico' : 'usuario'}". Selecciona el rol correcto.`);
      return;
    }
    navigate(result.user.role === 'mechanic' ? '/panel' : '/inicio');
  }

  function fillDemo(cred) {
    setEmail(cred.email);
    setPassword(cred.pass);
    setError('');
  }

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>🔧</div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '.75rem' }}>MecánicosGo</h2>
        <p style={{ opacity: .75, lineHeight: 1.7, marginBottom: '2rem' }}>
          Conectamos conductores con los mejores talleres mecánicos de Izalco, Sonsonate.
        </p>
        <div style={{ background: 'rgba(255,255,255,.08)', borderRadius: 'var(--radius)', padding: '1.25rem' }}>
          <div style={{ fontWeight: 700, marginBottom: '.75rem', fontSize: '.9rem', color: 'rgba(255,255,255,.85)' }}>
            🎯 Demo — Cuentas de prueba
          </div>
          <div style={{ fontSize: '.78rem', color: 'rgba(255,255,255,.65)', marginBottom: '.75rem' }}>Mecánicos:</div>
          {DEMO.mechanic.map((c) => (
            <div key={c.email} onClick={() => { setRole('mechanic'); fillDemo(c); }}
              style={{ background: 'rgba(255,255,255,.07)', borderRadius: '8px', padding: '.5rem .75rem', marginBottom: '.35rem', cursor: 'pointer', fontSize: '.8rem', transition: 'background .2s' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,.14)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,.07)'}
            >
              <div style={{ fontWeight: 600 }}>{c.name}</div>
              <div style={{ opacity: .65 }}>{c.email} / {c.pass}</div>
            </div>
          ))}
          <div style={{ fontSize: '.78rem', color: 'rgba(255,255,255,.65)', margin: '.75rem 0 .5rem' }}>Usuarios:</div>
          {DEMO.user.map((c) => (
            <div key={c.email} onClick={() => { setRole('user'); fillDemo(c); }}
              style={{ background: 'rgba(255,255,255,.07)', borderRadius: '8px', padding: '.5rem .75rem', marginBottom: '.35rem', cursor: 'pointer', fontSize: '.8rem', transition: 'background .2s' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,.14)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,.07)'}
            >
              <div style={{ fontWeight: 600 }}>{c.name}</div>
              <div style={{ opacity: .65 }}>{c.email} / {c.pass}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '.35rem' }}>Iniciar Sesión</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '.875rem', marginBottom: '1.5rem' }}>
            ¿No tienes cuenta? <Link to="/registro" style={{ color: 'var(--primary)', fontWeight: 600 }}>Regístrate aquí</Link>
          </p>

          {/* ROLE SELECTOR */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.75rem', marginBottom: '1.5rem' }}>
            {[
              { value: 'user', label: '🚗 Soy Usuario', desc: 'Busco talleres' },
              { value: 'mechanic', label: '🔧 Soy Mecánico', desc: 'Tengo un taller' },
            ].map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setRole(r.value)}
                style={{
                  padding: '.9rem', border: `2px solid ${role === r.value ? 'var(--primary)' : 'var(--border)'}`,
                  borderRadius: 'var(--radius-sm)', background: role === r.value ? '#fff7ed' : 'var(--white)',
                  cursor: 'pointer', textAlign: 'center', transition: 'all .2s',
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '.9rem', color: role === r.value ? 'var(--primary)' : 'var(--text)' }}>{r.label}</div>
                <div style={{ fontSize: '.75rem', color: 'var(--text-muted)', marginTop: '.15rem' }}>{r.desc}</div>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="form-stack">
            {error && <div className="alert alert-error">⚠️ {error}</div>}

            <div className="form-group">
              <label className="form-label">Correo electrónico</label>
              <input
                type="email" className="form-input" value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tucorreo@ejemplo.com" required autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label">Contraseña</label>
              <input
                type="password" className="form-input" value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••" required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
              {loading ? <span className="spinner" /> : `Entrar como ${role === 'mechanic' ? 'Mecánico' : 'Usuario'}`}
            </button>
          </form>

          <div className="divider">o</div>

          <p style={{ textAlign: 'center', fontSize: '.83rem', color: 'var(--text-muted)' }}>
            ¿Eres mecánico y quieres registrar tu taller?{' '}
            <Link to="/registro?tipo=mecanico" style={{ color: 'var(--primary)', fontWeight: 600 }}>Regístrate aquí →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
