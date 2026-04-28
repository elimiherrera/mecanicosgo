import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

const STATUS = {
  pending: { label: 'Pendiente', cls: 'badge-yellow', icon: '⏳' },
  confirmed: { label: 'Confirmada', cls: 'badge-green', icon: '✅' },
  completed: { label: 'Completada', cls: 'badge-blue', icon: '🏁' },
  cancelled: { label: 'Cancelada', cls: 'badge-red', icon: '❌' },
};

export default function MechanicDashboard() {
  const { currentUser, getMyWorkshop, getWorkshopAppointments, getWorkshopReviews, updateAppointment } = useApp();
  const navigate = useNavigate();
  const workshop = getMyWorkshop(currentUser.id);

  if (!workshop) {
    return (
      <div className="page">
        <div className="empty-state">
          <div className="empty-state-icon">🏪</div>
          <div className="empty-state-title">Taller no registrado</div>
          <div className="empty-state-text">Algo salió mal. Por favor cierra sesión y vuelve a registrarte.</div>
        </div>
      </div>
    );
  }

  const appointments = getWorkshopAppointments(workshop.id);
  const reviews = getWorkshopReviews(workshop.id);
  const pending = appointments.filter((a) => a.status === 'pending');
  const confirmed = appointments.filter((a) => a.status === 'confirmed');
  const completed = appointments.filter((a) => a.status === 'completed');
  const revenue = completed.reduce((s, a) => s + (a.price || 0), 0);

  const recentAppointments = [...appointments]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  function confirmAppt(id) { updateAppointment(id, { status: 'confirmed' }); }
  function completeAppt(id) { updateAppointment(id, { status: 'completed' }); }
  function cancelAppt(id) { updateAppointment(id, { status: 'cancelled' }); }

  return (
    <div className="page">
      {/* HEADER */}
      <div style={{
        background: 'linear-gradient(135deg, var(--secondary) 0%, #1e3a5f 100%)',
        borderRadius: 'var(--radius-lg)', padding: '2rem', color: '#fff', marginBottom: '2rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem',
      }}>
        <div>
          <div style={{ fontSize: '.85rem', opacity: .7, marginBottom: '.35rem' }}>👋 Bienvenido,</div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{currentUser.name.split(' ')[0]}</h1>
          <div style={{ opacity: .75, marginTop: '.25rem', fontSize: '.9rem', display: 'flex', alignItems: 'center', gap: '.5rem' }}>
            🏪 {workshop.name}
            {workshop.isVerified && <span style={{ background: 'rgba(37,99,235,.3)', color: '#93c5fd', padding: '.1rem .5rem', borderRadius: '99px', fontSize: '.72rem', fontWeight: 700 }}>✓ Verificado</span>}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap' }}>
          <button className="btn btn-outline btn-sm" onClick={() => navigate('/panel/taller')} style={{ color: '#fff', borderColor: 'rgba(255,255,255,.3)' }}>
            ✏️ Editar Taller
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/panel/citas')}>
            📅 Ver Citas
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        {[
          { icon: '⏳', label: 'Citas Pendientes', value: pending.length, cls: 'orange', urgent: pending.length > 0 },
          { icon: '✅', label: 'Confirmadas', value: confirmed.length, cls: 'blue' },
          { icon: '🏁', label: 'Completadas', value: completed.length, cls: 'green' },
          { icon: '⭐', label: 'Calificación', value: workshop.rating > 0 ? workshop.rating.toFixed(1) : 'N/A', cls: 'purple' },
        ].map((s) => (
          <div key={s.label} className="stat-card" style={s.urgent ? { borderColor: 'var(--warning)', boxShadow: '0 0 0 2px rgba(217,119,6,.15)' } : {}}>
            <div className={`stat-icon ${s.cls}`}>{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* REVENUE */}
        <div className="card">
          <div className="card-header"><span style={{ fontWeight: 700 }}>💰 Ingresos Estimados</span></div>
          <div className="card-body" style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--success)' }}>${revenue.toFixed(2)}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '.85rem', marginTop: '.25rem' }}>de {completed.length} servicio(s) completado(s)</div>
          </div>
        </div>

        {/* WORKSHOP STATUS */}
        <div className="card">
          <div className="card-header"><span style={{ fontWeight: 700 }}>🏪 Estado del Taller</span></div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '.875rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Disponibilidad</span>
                <span className={`badge ${workshop.isAvailable ? 'badge-green' : 'badge-red'}`}>
                  {workshop.isAvailable ? '🟢 Disponible' : '🔴 No Disponible'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '.875rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Servicios</span>
                <span style={{ fontWeight: 700 }}>{workshop.services.length}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '.875rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Reseñas</span>
                <span style={{ fontWeight: 700 }}>{reviews.length}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '.875rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Verificado</span>
                <span className={`badge ${workshop.isVerified ? 'badge-blue' : 'badge-gray'}`}>
                  {workshop.isVerified ? '✓ Sí' : 'Pendiente'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RECENT APPOINTMENTS */}
      <div>
        <div className="section-header">
          <div>
            <h2 className="section-title">Citas Recientes</h2>
            <p className="section-subtitle">Últimas solicitudes recibidas</p>
          </div>
          <button className="btn btn-outline btn-sm" onClick={() => navigate('/panel/citas')}>Ver todas →</button>
        </div>

        {recentAppointments.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📅</div>
            <div className="empty-state-title">No hay citas aún</div>
            <div className="empty-state-text">Cuando los usuarios agenden citas, aparecerán aquí.</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
            {recentAppointments.map((a) => {
              const st = STATUS[a.status] || { label: a.status, cls: 'badge-gray', icon: '•' };
              return (
                <div key={a.id} className="appt-card">
                  <div style={{ textAlign: 'center', minWidth: '56px', background: 'var(--bg)', borderRadius: '8px', padding: '.5rem', flexShrink: 0 }}>
                    <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--secondary)', lineHeight: 1 }}>
                      {new Date(a.date).getDate()}
                    </div>
                    <div style={{ fontSize: '.6rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted)' }}>
                      {new Date(a.date + 'T00:00:00').toLocaleString('es-SV', { month: 'short' }).toUpperCase()}
                    </div>
                  </div>
                  <div className="appt-card-info">
                    <div style={{ fontWeight: 700, fontSize: '.9rem' }}>{a.userName}</div>
                    <div style={{ fontSize: '.82rem', color: 'var(--text-muted)' }}>
                      🛠️ {a.serviceName} · ⏰ {a.time} · 💵 ${a.price}
                    </div>
                    {a.notes && <div style={{ fontSize: '.78rem', color: 'var(--text-muted)' }}>📝 {a.notes}</div>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', flexWrap: 'wrap' }}>
                    <span className={`badge ${st.cls}`}>{st.icon} {st.label}</span>
                    {a.status === 'pending' && (
                      <>
                        <button className="btn btn-success btn-sm" onClick={() => confirmAppt(a.id)}>Confirmar</button>
                        <button className="btn btn-danger btn-sm" onClick={() => cancelAppt(a.id)}>Rechazar</button>
                      </>
                    )}
                    {a.status === 'confirmed' && (
                      <button className="btn btn-primary btn-sm" onClick={() => completeAppt(a.id)}>Completar</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
