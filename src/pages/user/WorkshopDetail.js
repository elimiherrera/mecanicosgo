import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import StarRating from '../../components/StarRating';
import Modal from '../../components/Modal';

const DAYS = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
const DAY_LABELS = { lunes: 'Lunes', martes: 'Martes', miercoles: 'Miércoles', jueves: 'Jueves', viernes: 'Viernes', sabado: 'Sábado', domingo: 'Domingo' };
const TIMES = ['08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30'];

const STATUS_LABELS = {
  pending: { label: 'Pendiente', cls: 'badge-yellow' },
  confirmed: { label: 'Confirmada', cls: 'badge-green' },
  completed: { label: 'Completada', cls: 'badge-blue' },
  cancelled: { label: 'Cancelada', cls: 'badge-red' },
};

function formatDate(str) {
  const d = new Date(str);
  return d.toLocaleDateString('es-SV', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function WorkshopDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, workshops, getWorkshopReviews, bookAppointment, addReview, hasUserReviewed } = useApp();
  const [tab, setTab] = useState('services');
  const [showBookModal, setShowBookModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [bookSuccess, setBookSuccess] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const [bookForm, setBookForm] = useState({ date: '', time: '', notes: '' });
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [bookError, setBookError] = useState('');
  const [reviewError, setReviewError] = useState('');

  const workshop = workshops.find((w) => w.id === id);
  const reviews = workshop ? getWorkshopReviews(workshop.id) : [];
  const alreadyReviewed = currentUser && workshop ? hasUserReviewed(currentUser.id, workshop.id) : false;

  if (!workshop) {
    return (
      <div className="page">
        <div className="empty-state">
          <div className="empty-state-icon">🏪</div>
          <div className="empty-state-title">Taller no encontrado</div>
          <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => navigate('/talleres')}>
            Ver todos los talleres
          </button>
        </div>
      </div>
    );
  }

  function openBook(service) {
    if (!currentUser) { navigate('/login'); return; }
    setSelectedService(service);
    setBookForm({ date: '', time: '', notes: '' });
    setBookError('');
    setBookSuccess(false);
    setShowBookModal(true);
  }

  function submitBook(e) {
    e.preventDefault();
    if (!bookForm.date) { setBookError('Selecciona una fecha.'); return; }
    if (!bookForm.time) { setBookError('Selecciona una hora.'); return; }
    const today = new Date(); today.setHours(0, 0, 0, 0);
    if (new Date(bookForm.date) < today) { setBookError('La fecha debe ser hoy o futura.'); return; }
    bookAppointment({
      userId: currentUser.id,
      userName: currentUser.name,
      userPhone: currentUser.phone || '',
      workshopId: workshop.id,
      workshopName: workshop.name,
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      price: selectedService.price,
      date: bookForm.date,
      time: bookForm.time,
      notes: bookForm.notes,
    });
    setBookSuccess(true);
  }

  function submitReview(e) {
    e.preventDefault();
    if (reviewForm.rating < 1) { setReviewError('Selecciona una calificación.'); return; }
    if (reviewForm.comment.trim().length < 10) { setReviewError('La reseña debe tener al menos 10 caracteres.'); return; }
    addReview({ userId: currentUser.id, userName: currentUser.name, workshopId: workshop.id, rating: reviewForm.rating, comment: reviewForm.comment });
    setReviewSuccess(true);
  }

  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${workshop.coordinates.lng - 0.012}%2C${workshop.coordinates.lat - 0.008}%2C${workshop.coordinates.lng + 0.012}%2C${workshop.coordinates.lat + 0.008}&layer=mapnik&marker=${workshop.coordinates.lat}%2C${workshop.coordinates.lng}`;

  return (
    <div className="page" style={{ maxWidth: '900px' }}>
      {/* BACK */}
      <button className="btn btn-ghost btn-sm" onClick={() => navigate('/talleres')} style={{ marginBottom: '1rem' }}>
        ← Volver a talleres
      </button>

      {/* HEADER */}
      <div style={{
        background: 'linear-gradient(135deg, var(--secondary) 0%, #1e3a5f 100%)',
        borderRadius: 'var(--radius-lg)', padding: '2rem', color: '#fff', marginBottom: '1.5rem',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap', marginBottom: '.75rem' }}>
              {workshop.isVerified && <span className="badge badge-blue" style={{ background: 'rgba(37,99,235,.3)', color: '#93c5fd' }}>✓ Verificado</span>}
              <span className="badge" style={{ background: workshop.isAvailable ? 'rgba(16,185,129,.3)' : 'rgba(239,68,68,.3)', color: workshop.isAvailable ? '#6ee7b7' : '#fca5a5' }}>
                <span className={`avail-dot ${workshop.isAvailable ? 'open' : 'closed'}`} />
                {workshop.isAvailable ? 'Disponible' : 'No disponible'}
              </span>
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '.35rem' }}>{workshop.name}</h1>
            <div style={{ opacity: .75, fontSize: '.9rem' }}>Mecánico: {workshop.mechanicName} · {workshop.mechanicExperience} años de experiencia</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', marginTop: '.75rem' }}>
              <StarRating value={workshop.rating} readonly size="star-sm" />
              <span style={{ fontWeight: 700 }}>{workshop.rating > 0 ? workshop.rating.toFixed(1) : 'Sin calificación'}</span>
              {workshop.reviewCount > 0 && <span style={{ opacity: .65, fontSize: '.85rem' }}>({workshop.reviewCount} reseñas)</span>}
            </div>
          </div>
          {workshop.isAvailable && currentUser?.role === 'user' && (
            <button className="btn btn-primary btn-lg" onClick={() => openBook(workshop.services[0] || { id: 'general', name: 'Servicio General', price: 0 })}>
              📅 Agendar Cita
            </button>
          )}
        </div>
      </div>

      {/* INFO STRIP */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { icon: '📍', label: 'Dirección', value: workshop.address },
          { icon: '📞', label: 'Teléfono', value: workshop.phone || 'No disponible' },
          { icon: '💬', label: 'WhatsApp', value: workshop.whatsapp ? `+503 ${workshop.whatsapp}` : 'No disponible' },
          { icon: '📧', label: 'Correo', value: workshop.email || 'No disponible' },
        ].map((item) => (
          <div key={item.label} style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '.9rem' }}>
            <div style={{ fontSize: '.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '.25rem' }}>
              {item.icon} {item.label}
            </div>
            <div style={{ fontSize: '.875rem', fontWeight: 500 }}>{item.value}</div>
          </div>
        ))}
      </div>

      {/* DESCRIPTION */}
      {workshop.description && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div className="card-body">
            <h3 style={{ fontWeight: 700, marginBottom: '.6rem' }}>Acerca del Taller</h3>
            <p style={{ fontSize: '.9rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>{workshop.description}</p>
            {workshop.specialties.length > 0 && (
              <div style={{ marginTop: '.75rem' }}>
                <div style={{ fontSize: '.8rem', fontWeight: 600, marginBottom: '.4rem' }}>Especialidades:</div>
                <div className="workshop-tags">
                  {workshop.specialties.map((s) => <span key={s} className="workshop-tag" style={{ background: '#ffedd5', color: '#9a3412' }}>{s}</span>)}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TABS */}
      <div className="tabs">
        <button className={`tab ${tab === 'services' ? 'active' : ''}`} onClick={() => setTab('services')}>
          🛠️ Servicios ({workshop.services.length})
        </button>
        <button className={`tab ${tab === 'reviews' ? 'active' : ''}`} onClick={() => setTab('reviews')}>
          ⭐ Reseñas ({reviews.length})
        </button>
        <button className={`tab ${tab === 'schedule' ? 'active' : ''}`} onClick={() => setTab('schedule')}>
          🕐 Horarios
        </button>
        <button className={`tab ${tab === 'map' ? 'active' : ''}`} onClick={() => setTab('map')}>
          📍 Mapa
        </button>
      </div>

      {/* SERVICES */}
      {tab === 'services' && (
        <div>
          {workshop.services.length === 0 ? (
            <div className="empty-state"><div className="empty-state-icon">🛠️</div><div className="empty-state-title">Sin servicios registrados</div></div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
              {workshop.services.map((s) => (
                <div key={s.id} className="service-card">
                  <div style={{ flex: 1 }}>
                    <div className="service-name">{s.name}</div>
                    {s.description && <div className="service-desc">{s.description}</div>}
                    <div className="service-meta">
                      <span className="service-price">${s.price.toFixed(2)}</span>
                      <span className="service-duration">⏱ {s.duration} min</span>
                      <span className="service-category">{s.category}</span>
                    </div>
                  </div>
                  {workshop.isAvailable && currentUser?.role === 'user' && (
                    <button className="btn btn-primary btn-sm" onClick={() => openBook(s)}>
                      Agendar
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* REVIEWS */}
      {tab === 'reviews' && (
        <div>
          {/* RATING SUMMARY */}
          {reviews.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.25rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--secondary)', lineHeight: 1 }}>{workshop.rating.toFixed(1)}</div>
                <StarRating value={workshop.rating} readonly size="star-sm" />
                <div style={{ fontSize: '.75rem', color: 'var(--text-muted)', marginTop: '.25rem' }}>{workshop.reviewCount} reseñas</div>
              </div>
              <div style={{ flex: 1 }}>
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = reviews.filter((r) => r.rating === star).length;
                  const pct = reviews.length ? (count / reviews.length) * 100 : 0;
                  return (
                    <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '.5rem', marginBottom: '.3rem' }}>
                      <span style={{ fontSize: '.78rem', width: '14px', textAlign: 'right', fontWeight: 600 }}>{star}</span>
                      <span style={{ color: '#F59E0B', fontSize: '.8rem' }}>★</span>
                      <div style={{ flex: 1, height: '8px', background: 'var(--border)', borderRadius: '99px', overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: '#F59E0B', borderRadius: '99px', transition: 'width .5s' }} />
                      </div>
                      <span style={{ fontSize: '.75rem', color: 'var(--text-muted)', width: '24px' }}>{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ADD REVIEW */}
          {currentUser?.role === 'user' && (
            <div style={{ marginBottom: '1.25rem' }}>
              {alreadyReviewed ? (
                <div className="alert alert-info">✅ Ya dejaste una reseña para este taller. ¡Gracias!</div>
              ) : (
                <button className="btn btn-outline" onClick={() => { setReviewForm({ rating: 5, comment: '' }); setReviewError(''); setReviewSuccess(false); setShowReviewModal(true); }}>
                  ✍️ Escribir Reseña
                </button>
              )}
            </div>
          )}

          {reviews.length === 0 ? (
            <div className="empty-state"><div className="empty-state-icon">⭐</div><div className="empty-state-title">Sin reseñas aún</div><div className="empty-state-text">¡Sé el primero en calificar este taller!</div></div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
              {reviews.map((r) => (
                <div key={r.id} className="review-card">
                  <div className="review-header">
                    <div className="review-user">
                      <div className="avatar" style={{ width: '36px', height: '36px', fontSize: '.8rem' }}>{r.userName[0]}</div>
                      <div>
                        <div className="review-user-name">{r.userName}</div>
                        <StarRating value={r.rating} readonly size="star-xs" />
                      </div>
                    </div>
                    <div className="review-date">{formatDate(r.createdAt)}</div>
                  </div>
                  <p className="review-text">"{r.comment}"</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SCHEDULE */}
      {tab === 'schedule' && (
        <div className="card">
          <div className="card-body">
            <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Horarios de Atención</h3>
            <div className="schedule-grid">
              {DAYS.map((day) => {
                const d = workshop.schedule?.[day] || { isOpen: false };
                return (
                  <div key={day} className="schedule-row">
                    <span className="schedule-day">{DAY_LABELS[day]}</span>
                    <span className={`badge ${d.isOpen ? 'badge-green' : 'badge-red'}`}>
                      {d.isOpen ? 'Abierto' : 'Cerrado'}
                    </span>
                    {d.isOpen ? (
                      <span style={{ fontSize: '.85rem', color: 'var(--text-muted)' }}>{d.open} – {d.close}</span>
                    ) : (
                      <span />
                    )}
                    <span />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* MAP */}
      {tab === 'map' && (
        <div>
          <div style={{ marginBottom: '.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '.875rem' }}>📍 {workshop.address}</p>
            <a href={`https://www.openstreetmap.org/?mlat=${workshop.coordinates.lat}&mlon=${workshop.coordinates.lng}&zoom=16`} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">
              Abrir en mapa →
            </a>
          </div>
          <div className="map-container">
            <iframe
              title={`Mapa de ${workshop.name}`}
              width="100%"
              height="400"
              frameBorder="0"
              scrolling="no"
              src={mapSrc}
              style={{ display: 'block' }}
            />
          </div>
          <div style={{ marginTop: '.75rem', fontSize: '.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
            Coordenadas: {workshop.coordinates.lat.toFixed(4)}, {workshop.coordinates.lng.toFixed(4)}
          </div>
        </div>
      )}

      {/* BOOK MODAL */}
      <Modal open={showBookModal} onClose={() => { setShowBookModal(false); setBookSuccess(false); }} title="Agendar Cita">
        {bookSuccess ? (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
            <h3 style={{ fontWeight: 800, marginBottom: '.5rem' }}>¡Cita Agendada!</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Tu solicitud fue enviada al taller. Recibirás confirmación pronto.</p>
            <div style={{ background: 'var(--bg)', borderRadius: 'var(--radius-sm)', padding: '1rem', textAlign: 'left', marginBottom: '1.5rem', fontSize: '.875rem' }}>
              <div><strong>Servicio:</strong> {selectedService?.name}</div>
              <div><strong>Fecha:</strong> {bookForm.date}</div>
              <div><strong>Hora:</strong> {bookForm.time}</div>
              <div><strong>Taller:</strong> {workshop.name}</div>
            </div>
            <button className="btn btn-primary" onClick={() => { setShowBookModal(false); setBookSuccess(false); }}>Cerrar</button>
          </div>
        ) : (
          <form onSubmit={submitBook} className="form-stack">
            <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 'var(--radius-sm)', padding: '.9rem', fontSize: '.875rem' }}>
              <strong>Servicio seleccionado:</strong> {selectedService?.name}<br />
              <strong>Precio:</strong> ${selectedService?.price?.toFixed(2)} · <strong>Duración estimada:</strong> {selectedService?.duration} min
            </div>
            {bookError && <div className="alert alert-error">⚠️ {bookError}</div>}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Fecha *</label>
                <input type="date" className="form-input" value={bookForm.date} onChange={(e) => setBookForm((f) => ({ ...f, date: e.target.value }))} min={new Date().toISOString().split('T')[0]} required />
              </div>
              <div className="form-group">
                <label className="form-label">Hora *</label>
                <select className="form-select" value={bookForm.time} onChange={(e) => setBookForm((f) => ({ ...f, time: e.target.value }))} required>
                  <option value="">Seleccionar hora</option>
                  {TIMES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Notas adicionales</label>
              <textarea className="form-textarea" value={bookForm.notes} onChange={(e) => setBookForm((f) => ({ ...f, notes: e.target.value }))} placeholder="Ej: Toyota Corolla 2018, problema con los frenos..." rows={3} />
            </div>
            <div style={{ display: 'flex', gap: '.75rem', justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-ghost" onClick={() => setShowBookModal(false)}>Cancelar</button>
              <button type="submit" className="btn btn-primary">📅 Confirmar Cita</button>
            </div>
          </form>
        )}
      </Modal>

      {/* REVIEW MODAL */}
      <Modal open={showReviewModal} onClose={() => { setShowReviewModal(false); setReviewSuccess(false); }} title="Escribir Reseña">
        {reviewSuccess ? (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⭐</div>
            <h3 style={{ fontWeight: 800, marginBottom: '.5rem' }}>¡Gracias por tu reseña!</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Tu opinión ayuda a otros usuarios a encontrar el mejor servicio.</p>
            <button className="btn btn-primary" onClick={() => { setShowReviewModal(false); setReviewSuccess(false); }}>Cerrar</button>
          </div>
        ) : (
          <form onSubmit={submitReview} className="form-stack">
            {reviewError && <div className="alert alert-error">⚠️ {reviewError}</div>}
            <div className="form-group">
              <label className="form-label">Tu calificación</label>
              <StarRating value={reviewForm.rating} onChange={(v) => setReviewForm((f) => ({ ...f, rating: v }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Tu reseña *</label>
              <textarea className="form-textarea" value={reviewForm.comment} onChange={(e) => setReviewForm((f) => ({ ...f, comment: e.target.value }))} placeholder="Comparte tu experiencia con este taller..." rows={4} required />
              <span className="form-hint">{reviewForm.comment.length}/500 caracteres</span>
            </div>
            <div style={{ display: 'flex', gap: '.75rem', justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-ghost" onClick={() => setShowReviewModal(false)}>Cancelar</button>
              <button type="submit" className="btn btn-primary">⭐ Publicar Reseña</button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
