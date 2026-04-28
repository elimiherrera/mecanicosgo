import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

const STATUS = {
  pending: { label: 'Pendiente', cls: 'badge-yellow', icon: '⏳' },
  confirmed: { label: 'Confirmada', cls: 'badge-green', icon: '✅' },
  completed: { label: 'Completada', cls: 'badge-blue', icon: '🏁' },
  cancelled: { label: 'Cancelada', cls: 'badge-red', icon: '❌' },
};

export default function ManageAppointments() {
  const { currentUser, getMyWorkshop, getWorkshopAppointments, updateAppointment } = useApp();
  const workshop = getMyWorkshop(currentUser.id);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const appointments = workshop ? getWorkshopAppointments(workshop.id) : [];

  const filtered = appointments.filter((a) => {
    if (filter !== 'all' && a.status !== filter) return false;
    const term = search.toLowerCase();
    if (term && !a.userName?.toLowerCase().includes(term) && !a.serviceName?.toLowerCase().includes(term)) return false;
    return true;
  });
  const sorted = [...filtered].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`);
    const dateB = new Date(`${b.date}T${b.time}`);
    return dateB - dateA;
  });

  const counts = {
    all: appointments.length,
    pending: appointments.filter((a) => a.status === 'pending').length,
    confirmed: appointments.filter((a) => a.status === 'confirmed').length,
    completed: appointments.filter((a) => a.status === 'completed').length,
    cancelled: appointments.filter((a) => a.status === 'cancelled').length,
  };

  function confirm(id) { updateAppointment(id, { status: 'confirmed' }); }
  function complete(id) { updateAppointment(id, { status: 'completed' }); }
  function cancel(id) {
    if (window.confirm('¿Cancelar esta cita?')) updateAppointment(id, { status: 'cancelled' });
  }

  return (
    <div className="page" style={{ maxWidth: '900px' }}>
      <div className="section-header">
        <div>
          <h1 className="section-title">Gestión de Citas</h1>
          <p className="section-subtitle">{workshop?.name}</p>
        </div>
      </div>

      {/* STATS ROW */}
      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        {[
          { key: 'pending', icon: '⏳', label: 'Pendientes', cls: 'orange' },
          { key: 'confirmed', icon: '✅', label: 'Confirmadas', cls: 'blue' },
          { key: 'completed', icon: '🏁', label: 'Completadas', cls: 'green' },
          { key: 'cancelled', icon: '❌', label: 'Canceladas', cls: 'purple' },
        ].map((s) => (
          <div key={s.key} className="stat-card" style={{ cursor: 'pointer' }} onClick={() => setFilter(s.key)}>
            <div className={`stat-icon ${s.cls}`}>{s.icon}</div>
            <div className="stat-value">{counts[s.key]}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* FILTERS */}
      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <div className="card-body" style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: '1 1 200px' }}>
            <input
              className="form-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por cliente o servicio..."
              style={{ paddingLeft: '2.25rem' }}
            />
            <span style={{ position: 'absolute', left: '.7rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>🔍</span>
          </div>
          <div style={{ display: 'flex', gap: '.4rem', flexWrap: 'wrap' }}>
            {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((f) => {
              const s = f === 'all' ? { label: 'Todas', icon: '📋' } : STATUS[f];
              return (
                <button key={f} onClick={() => setFilter(f)}
                  style={{
                    padding: '.4rem .8rem', borderRadius: '99px', fontSize: '.78rem', fontWeight: 600,
                    border: `2px solid ${filter === f ? 'var(--primary)' : 'var(--border)'}`,
                    background: filter === f ? 'var(--primary)' : 'var(--white)',
                    color: filter === f ? '#fff' : 'var(--text-muted)', cursor: 'pointer', transition: 'all .2s',
                  }}
                >
                  {s.icon} {s.label} ({counts[f]})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* LIST */}
      {sorted.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📅</div>
          <div className="empty-state-title">No hay citas</div>
          <div className="empty-state-text">
            {filter === 'all' ? 'Cuando los usuarios agenden citas, aparecerán aquí.' : `No hay citas ${STATUS[filter]?.label?.toLowerCase() || ''}.`}
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
          {sorted.map((a) => {
            const st = STATUS[a.status] || { label: a.status, cls: 'badge-gray', icon: '•' };
            const parts = a.date.split('-');
            const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
            const weekday = d.toLocaleString('es-SV', { weekday: 'long' });

            return (
              <div key={a.id} className="card">
                <div className="card-body" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                  {/* DATE */}
                  <div style={{ textAlign: 'center', minWidth: '60px', background: 'var(--bg)', borderRadius: '10px', padding: '.6rem .5rem', flexShrink: 0 }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--secondary)', lineHeight: 1 }}>{d.getDate()}</div>
                    <div style={{ fontSize: '.6rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted)' }}>
                      {d.toLocaleString('es-SV', { month: 'short' }).toUpperCase()}
                    </div>
                  </div>

                  {/* CLIENT INFO */}
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', flexWrap: 'wrap', marginBottom: '.35rem' }}>
                      <div className="avatar" style={{ width: '28px', height: '28px', fontSize: '.75rem' }}>
                        {a.userName?.[0] || '?'}
                      </div>
                      <span style={{ fontWeight: 700 }}>{a.userName}</span>
                      <span className={`badge ${st.cls}`}>{st.icon} {st.label}</span>
                    </div>
                    <div style={{ fontSize: '.83rem', color: 'var(--text-muted)', marginBottom: '.2rem' }}>
                      🛠️ <strong>{a.serviceName}</strong>
                    </div>
                    <div style={{ fontSize: '.82rem', color: 'var(--text-muted)' }}>
                      📅 {weekday} {a.date} · ⏰ {a.time}
                    </div>
                    {a.userPhone && (
                      <div style={{ fontSize: '.8rem', color: 'var(--text-muted)', marginTop: '.2rem' }}>
                        📞 {a.userPhone}
                      </div>
                    )}
                    {a.notes && (
                      <div style={{ marginTop: '.35rem', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '6px', padding: '.4rem .6rem', fontSize: '.8rem', color: 'var(--text-muted)' }}>
                        📝 {a.notes}
                      </div>
                    )}
                    <div style={{ marginTop: '.5rem', fontWeight: 700, color: 'var(--primary)' }}>
                      💵 ${a.price?.toFixed(2) || '—'}
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem', minWidth: '130px' }}>
                    {a.status === 'pending' && (
                      <>
                        <button className="btn btn-success btn-sm" onClick={() => confirm(a.id)}>✅ Confirmar</button>
                        <button className="btn btn-danger btn-sm" onClick={() => cancel(a.id)}>❌ Rechazar</button>
                      </>
                    )}
                    {a.status === 'confirmed' && (
                      <>
                        <button className="btn btn-primary btn-sm" onClick={() => complete(a.id)}>🏁 Completar</button>
                        <button className="btn btn-danger btn-sm" onClick={() => cancel(a.id)}>❌ Cancelar</button>
                      </>
                    )}
                    {(a.status === 'completed' || a.status === 'cancelled') && (
                      <span style={{ fontSize: '.78rem', color: 'var(--text-muted)', textAlign: 'center' }}>Sin acciones</span>
                    )}
                    {a.userPhone && (
                      <a
                        href={`https://wa.me/503${a.userPhone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-success btn-sm"
                        style={{ textDecoration: 'none', textAlign: 'center' }}
                      >
                        💬 WhatsApp
                      </a>
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
