import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import WorkshopCard from '../../components/WorkshopCard';

function formatDate(str) {
  if (!str) return '';
  const d = new Date(str);
  return d.toLocaleDateString('es-SV', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

const STATUS_LABELS = {
  pending: { label: 'Pendiente', cls: 'status-pending' },
  confirmed: { label: 'Confirmada', cls: 'status-confirmed' },
  completed: { label: 'Completada', cls: 'status-completed' },
  cancelled: { label: 'Cancelada', cls: 'status-cancelled' },
};

export default function UserDashboard() {
  const { currentUser, workshops, getUserAppointments } = useApp();
  const navigate = useNavigate();

  const myAppointments = getUserAppointments(currentUser.id);
  const upcoming = myAppointments.filter((a) => a.status !== 'cancelled' && a.status !== 'completed').slice(0, 3);
  const topWorkshops = [...workshops].sort((a, b) => b.rating - a.rating).slice(0, 3);

  return (
    <div className="page">
      {/* WELCOME */}
      <div style={{
        background: 'linear-gradient(135deg, var(--secondary) 0%, #1e3a5f 100%)',
        borderRadius: 'var(--radius-lg)', padding: '2rem', color: '#fff', marginBottom: '2rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem',
      }}>
        <div>
          <div style={{ fontSize: '.85rem', opacity: .7, marginBottom: '.35rem' }}>👋 Bienvenido de vuelta,</div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{currentUser.name.split(' ')[0]}</h1>
          <p style={{ opacity: .75, marginTop: '.35rem', fontSize: '.9rem' }}>¿Necesitas un taller? Encuentra el mejor cerca de ti.</p>
        </div>
        <button className="btn btn-primary btn-lg" onClick={() => navigate('/talleres')}>
          🔍 Buscar Talleres
        </button>
      </div>

      {/* STATS */}
      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        {[
          { icon: '🏪', label: 'Talleres Disponibles', value: workshops.filter((w) => w.isAvailable).length, cls: 'orange' },
          { icon: '📅', label: 'Mis Citas', value: myAppointments.length, cls: 'blue' },
          { icon: '✅', label: 'Citas Completadas', value: myAppointments.filter((a) => a.status === 'completed').length, cls: 'green' },
          { icon: '⭐', label: 'Reseñas Dadas', value: 0, cls: 'purple' },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <div className={`stat-icon ${s.cls}`}>{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* UPCOMING APPOINTMENTS */}
      {upcoming.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <div className="section-header">
            <div>
              <h2 className="section-title">Próximas Citas</h2>
              <p className="section-subtitle">Tus citas programadas</p>
            </div>
            <button className="btn btn-outline btn-sm" onClick={() => navigate('/mis-citas')}>Ver todas →</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
            {upcoming.map((a) => {
              const parts = a.date.split('-');
              const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
              const day = d.getDate();
              const month = d.toLocaleString('es-SV', { month: 'short' }).toUpperCase();
              const st = STATUS_LABELS[a.status] || { label: a.status, cls: '' };
              return (
                <div key={a.id} className="appt-card">
                  <div className="appt-card-date">
                    <div className="appt-card-day">{day}</div>
                    <div className="appt-card-month">{month}</div>
                  </div>
                  <div className="appt-card-info">
                    <div className="appt-card-title">{a.serviceName}</div>
                    <div className="appt-card-sub">
                      🏪 {a.workshopName} · ⏰ {a.time}
                    </div>
                    {a.notes && <div className="appt-card-sub">📝 {a.notes}</div>}
                  </div>
                  <div className="appt-card-actions">
                    <span className={`badge ${st.cls}`}>{st.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TOP WORKSHOPS */}
      <div>
        <div className="section-header">
          <div>
            <h2 className="section-title">Talleres Mejor Calificados</h2>
            <p className="section-subtitle">Los favoritos de Izalco</p>
          </div>
          <button className="btn btn-outline btn-sm" onClick={() => navigate('/talleres')}>Ver todos →</button>
        </div>
        <div className="grid-3">
          {topWorkshops.map((w) => (
            <WorkshopCard key={w.id} workshop={w} />
          ))}
        </div>
      </div>

      {/* QUICK ACCESS */}
      <div style={{ marginTop: '2rem', background: 'var(--white)', borderRadius: 'var(--radius)', padding: '1.5rem', border: '1px solid var(--border)' }}>
        <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Acceso Rápido</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem' }}>
          {[
            { icon: '🔍', label: 'Buscar Talleres', path: '/talleres' },
            { icon: '📅', label: 'Mis Citas', path: '/mis-citas' },
          ].map((item) => (
            <button key={item.label} onClick={() => navigate(item.path)}
              style={{ padding: '1rem', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', background: 'var(--bg)', cursor: 'pointer', textAlign: 'center', transition: 'all .2s', fontFamily: 'inherit' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.background = '#fff7ed'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg)'; }}
            >
              <div style={{ fontSize: '1.75rem', marginBottom: '.5rem' }}>{item.icon}</div>
              <div style={{ fontSize: '.82rem', fontWeight: 600 }}>{item.label}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
