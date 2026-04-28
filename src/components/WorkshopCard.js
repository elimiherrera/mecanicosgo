import React from 'react';
import { useNavigate } from 'react-router-dom';
import StarRating from './StarRating';

export default function WorkshopCard({ workshop }) {
  const navigate = useNavigate();

  return (
    <div className="workshop-card" onClick={() => navigate(`/talleres/${workshop.id}`)}>
      <div className="workshop-card-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div className="workshop-card-name">{workshop.name}</div>
            <div className="workshop-card-mechanic">Mecánico: {workshop.mechanicName}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
            {workshop.isVerified && (
              <span className="badge badge-blue" style={{ background: 'rgba(37,99,235,.25)', color: '#93c5fd' }}>
                ✓ Verificado
              </span>
            )}
            <span
              className="badge"
              style={{
                background: workshop.isAvailable ? 'rgba(16,185,129,.25)' : 'rgba(239,68,68,.25)',
                color: workshop.isAvailable ? '#6ee7b7' : '#fca5a5',
              }}
            >
              <span className={`avail-dot ${workshop.isAvailable ? 'open' : 'closed'}`} />
              {workshop.isAvailable ? 'Disponible' : 'No disponible'}
            </span>
          </div>
        </div>
      </div>

      <div className="workshop-card-body">
        <p style={{ fontSize: '.83rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '.75rem' }}>
          {workshop.description.length > 110
            ? workshop.description.slice(0, 110) + '...'
            : workshop.description}
        </p>

        <div className="info-row">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {workshop.address}
        </div>

        {workshop.phone && (
          <div className="info-row">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.22 1.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.07 6.07l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
            </svg>
            {workshop.phone}
          </div>
        )}

        <div className="workshop-tags">
          {workshop.specialties.slice(0, 3).map((s) => (
            <span key={s} className="workshop-tag">{s}</span>
          ))}
          {workshop.specialties.length > 3 && (
            <span className="workshop-tag">+{workshop.specialties.length - 3}</span>
          )}
        </div>
      </div>

      <div className="workshop-card-footer">
        <div className="rating-display">
          <span className="rating-stars">★</span>
          <span>{workshop.rating > 0 ? workshop.rating.toFixed(1) : 'Sin calificación'}</span>
          {workshop.reviewCount > 0 && (
            <span style={{ fontSize: '.78rem', color: 'var(--text-muted)', fontWeight: 400 }}>
              ({workshop.reviewCount} reseñas)
            </span>
          )}
        </div>
        <span style={{ fontSize: '.8rem', color: 'var(--text-muted)' }}>
          {workshop.services.length} servicios
        </span>
      </div>
    </div>
  );
}
