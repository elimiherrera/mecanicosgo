import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

const STATUS = {
  pending: { label: 'Pendiente', cls: 'badge-yellow', icon: '⏳' },
  confirmed: { label: 'Confirmada', cls: 'badge-green', icon: '✅' },
  completed: { label: 'Completada', cls: 'badge-blue', icon: '🏁' },
  cancelled: { label: 'Cancelada', cls: 'badge-red', icon: '❌' },
};

export default function MyAppointments() {
  const { currentUser, getUserAppointments, updateAppointment } = useApp();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');

  const appointments = getUserAppointments(currentUser.id);

  const filtered = filter === 'all' ? appointments : appointments.filter((a) => a.status === filter);
  const sorted = [...filtered].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  function cancelAppt(id) {
    if (window.confirm('¿Estás seguro de cancelar esta cita?')) {
      updateAppointment(id, { status: 'cancelled' });
    }
  }

  const counts = {
    all: appointments.length,
    pending: appointments.filter((a) => a.status === 'pending').length,
    confirmed: appointments.filter((a) => a.status === 'confirmed').length,
    completed: appointments.filter((a) => a.status === 'completed').length,
    cancelled: appointments.filter((a) => a.status === 'cancelled').length,
  };

  return (
    <div className="page" style={{ maxWidth: '780px' }}>
      <div className="section-header">
        <div>
          <h1 className="section-title">Mis Citas</h1>
          <p className="section-subtitle">Historial y citas programadas</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/talleres')}>
          + Nueva Cita
        </button>
      </div>

      {/* FILTER TABS */}
      <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {[
          { key: 'all', label: 'Todas' },
          { key: 'pending', label: '⏳ Pendientes' },
          { key: 'confirmed', label: '✅ Confirmadas' },
          { key: 'completed', label: '🏁 Completadas' },
          { key: 'cancelled', label: '❌ Canceladas' },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            style={{
              padding: '.45rem .9rem', borderRadius: '99px', fontSize: '.8rem', fontWeight: 600,
              border: `2px solid ${filter === f.key ? 'var(--primary)' : 'var(--border)'}`,
              background: filter === f.key ? 'var(--primary)' : 'var(--white)',
              color: filter === f.key ? '#fff' : 'var(--text-muted)', cursor: 'pointer', transition: 'all .2s',
            }}
          >
            {f.label} {counts[f.key] > 0 && <span style={{ opacity: .75 }}>({counts[f.key]})</span>}
          </button>
        ))}
      </div>

      {sorted.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📅</div>
          <div className="empty-state-title">
            {filter === 'all' ? 'No tienes citas aún' : `No hay citas ${STATUS[filter]?.label.toLowerCase() || ''}`}
          </div>
          <div className="empty-state-text">Busca un taller y agenda tu primera cita</div>
          <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => navigate('/talleres')}>
            Buscar Talleres
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
          {sorted.map((a) => {
            const parts = a.date.split('-');
            const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
            const day = d.getDate();
            const month = d.toLocaleString('es-SV', { month: 'short' }).toUpperCase();
            const weekday = d.toLocaleString('es-SV', { weekday: 'long' });
            const st = STATUS[a.status] || { label: a.status, cls: 'badge-gray', icon: '•' };
            const canCancel = a.status === 'pending' || a.status === 'confirmed';

            return (
              <div key={a.id} className="card">
                <div className="card-body" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  {/* DATE */}
                  <div style={{ textAlign: 'center', minWidth: '60px', background: 'var(--bg)', borderRadius: '10px', padding: '.6rem .75rem', flexShrink: 0 }}>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--secondary)', lineHeight: 1 }}>{day}</div>
                    <div style={{ fontSize: '.65rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted)' }}>{month}</div>
                  </div>

                  {/* INFO */}
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', flexWrap: 'wrap', marginBottom: '.4rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '.95rem' }}>{a.serviceName}</span>
                      <span className={`badge ${st.cls}`}>{st.icon} {st.label}</span>
                    </div>
                    <div style={{ fontSize: '.83rem', color: 'var(--text-muted)' }}>
                      🏪 <strong>{a.workshopName}</strong>
                    </div>
                    <div style={{ fontSize: '.83rem', color: 'var(--text-muted)', marginTop: '.2rem' }}>
                      📅 {weekday} {a.date} · ⏰ {a.time}
                    </div>
                    {a.notes && (
                      <div style={{ fontSize: '.8rem', color: 'var(--text-muted)', marginTop: '.25rem' }}>
                        📝 {a.notes}
                      </div>
                    )}
                    <div style={{ marginTop: '.4rem', fontWeight: 700, color: 'var(--primary)' }}>
                      ${a.price?.toFixed(2) || '—'}
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem', alignItems: 'flex-end' }}>
                    <button className="btn btn-outline btn-sm" onClick={() => navigate(`/talleres/${a.workshopId}`)}>
                      Ver Taller
                    </button>
                    {canCancel && (
                      <button className="btn btn-danger btn-sm" onClick={() => cancelAppt(a.id)}>
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
