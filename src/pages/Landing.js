import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const features = [
  { icon: '🔍', title: 'Busca Talleres Verificados', desc: 'Encuentra talleres y mecánicos certificados cerca de Izalco, filtrados por especialidad, calificación y disponibilidad.' },
  { icon: '📅', title: 'Agenda tu Cita', desc: 'Reserva tu espacio en el taller con fecha y hora según tu conveniencia, sin llamadas ni esperas.' },
  { icon: '⭐', title: 'Reseñas y Calificaciones', desc: 'Lee opiniones reales de otros usuarios y califica el servicio que recibiste para ayudar a la comunidad.' },
  { icon: '📍', title: 'Geolocalización', desc: 'Ve en el mapa dónde están los talleres más cercanos a tu ubicación en Izalco y alrededores.' },
  { icon: '💬', title: 'Cotiza en Línea', desc: 'Consulta los precios de los servicios antes de llevar tu vehículo y evita sorpresas.' },
  { icon: '🔔', title: 'Alertas en Tiempo Real', desc: 'Recibe notificaciones sobre el estado de tu cita, cambios de horario y confirmaciones.' },
];

const stats = [
  { value: '3+', label: 'Talleres Verificados' },
  { value: '15+', label: 'Servicios Disponibles' },
  { value: '5★', label: 'Calificación Promedio' },
  { value: 'Izalco', label: 'Municipio' },
];

export default function Landing() {
  const navigate = useNavigate();
  const { currentUser } = useApp();

  if (currentUser) {
    navigate(currentUser.role === 'mechanic' ? '/panel' : '/inicio');
    return null;
  }

  return (
    <div>
      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem', background: 'rgba(255,255,255,.1)', borderRadius: '99px', padding: '.35rem 1rem', fontSize: '.8rem', fontWeight: 600, marginBottom: '1.5rem', color: 'rgba(255,255,255,.85)' }}>
            📍 Servicio para Izalco, Sonsonate · El Salvador
          </div>
          <h1 className="hero-title">
            Tu mecánico de confianza<br />
            <span>en Izalco, al alcance</span><br />
            de tu mano
          </h1>
          <p className="hero-sub">
            Encuentra talleres verificados, agenda citas, cotiza servicios y lee reseñas de otros usuarios — todo en un solo lugar.
          </p>
          <div className="hero-cta">
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/registro')}>
              🚗 Buscar Taller Ahora
            </button>
            <button className="btn btn-outline btn-lg" onClick={() => navigate('/registro?tipo=mecanico')} style={{ color: '#fff', borderColor: 'rgba(255,255,255,.4)' }}>
              🔧 Soy Mecánico
            </button>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div style={{ background: 'var(--secondary)', color: '#fff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1.5rem', textAlign: 'center' }}>
          {stats.map((s) => (
            <div key={s.label}>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary-light)' }}>{s.value}</div>
              <div style={{ fontSize: '.8rem', color: 'rgba(255,255,255,.6)', marginTop: '.25rem', fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <section className="features">
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Todo lo que necesitas</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '.5rem' }}>
            Una plataforma completa para conectar usuarios con talleres en Izalco
          </p>
        </div>
        <div className="feature-grid">
          {features.map((f) => (
            <div key={f.title} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ background: 'var(--white)', padding: '4rem 1.5rem', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>¿Cómo funciona?</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '.5rem' }}>Solo 3 pasos para encontrar ayuda</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem', textAlign: 'center' }}>
            {[
              { step: '1', icon: '👤', title: 'Regístrate gratis', desc: 'Crea tu cuenta en menos de 2 minutos. Sin costos ocultos.' },
              { step: '2', icon: '🔍', title: 'Encuentra tu taller', desc: 'Busca por especialidad, calificación o cercanía a tu ubicación.' },
              { step: '3', icon: '✅', title: 'Agenda y listo', desc: 'Reserva tu cita, lleva el carro y califica el servicio.' },
            ].map((item) => (
              <div key={item.step}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', margin: '0 auto 1rem', fontWeight: 800 }}>
                  {item.step}
                </div>
                <div style={{ fontSize: '1.5rem', marginBottom: '.5rem' }}>{item.icon}</div>
                <div style={{ fontWeight: 700, marginBottom: '.35rem' }}>{item.title}</div>
                <div style={{ fontSize: '.85rem', color: 'var(--text-muted)' }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)', padding: '4rem 1.5rem', textAlign: 'center', color: '#fff' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '.75rem' }}>¿Eres mecánico o tienes un taller?</h2>
        <p style={{ opacity: .85, marginBottom: '2rem', fontSize: '1.05rem' }}>Registra tu taller gratis y llega a más clientes en Izalco</p>
        <button className="btn btn-lg" onClick={() => navigate('/registro?tipo=mecanico')} style={{ background: '#fff', color: 'var(--primary)', fontWeight: 800 }}>
          Registrar mi Taller →
        </button>
      </section>

      {/* FOOTER */}
      <footer style={{ background: 'var(--secondary)', color: 'rgba(255,255,255,.6)', padding: '2rem 1.5rem', textAlign: 'center', fontSize: '.85rem' }}>
        <div style={{ marginBottom: '.5rem', fontWeight: 700, color: '#fff', fontSize: '1rem' }}>🔧 MecánicosGo</div>
        <div>© 2026 · Izalco, Sonsonate, El Salvador · Conectando conductores con talleres de confianza</div>
      </footer>
    </div>
  );
}
