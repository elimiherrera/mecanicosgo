import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import WorkshopCard from '../../components/WorkshopCard';

const ALL_SPECIALTIES = [
  'Mecánica General', 'Motores', 'Frenos', 'Suspensión', 'Eléctrico',
  'Aire Acondicionado', 'Carrocería', 'Pintura', 'Mantenimiento Preventivo', 'Diagnóstico',
];

export default function BrowseWorkshops() {
  const { workshops } = useApp();
  const [search, setSearch] = useState('');
  const [filterAvailable, setFilterAvailable] = useState(false);
  const [filterVerified, setFilterVerified] = useState(false);
  const [filterSpecialty, setFilterSpecialty] = useState('');
  const [sortBy, setSortBy] = useState('rating');

  const filtered = useMemo(() => {
    let result = workshops.filter((w) => {
      const term = search.toLowerCase();
      const matches =
        !term ||
        w.name.toLowerCase().includes(term) ||
        w.address.toLowerCase().includes(term) ||
        w.mechanicName.toLowerCase().includes(term) ||
        w.specialties.some((s) => s.toLowerCase().includes(term)) ||
        w.services.some((s) => s.name.toLowerCase().includes(term));
      if (!matches) return false;
      if (filterAvailable && !w.isAvailable) return false;
      if (filterVerified && !w.isVerified) return false;
      if (filterSpecialty && !w.specialties.includes(filterSpecialty)) return false;
      return true;
    });

    if (sortBy === 'rating') result = result.sort((a, b) => b.rating - a.rating);
    else if (sortBy === 'reviews') result = result.sort((a, b) => b.reviewCount - a.reviewCount);
    else if (sortBy === 'name') result = result.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === 'services') result = result.sort((a, b) => b.services.length - a.services.length);

    return result;
  }, [workshops, search, filterAvailable, filterVerified, filterSpecialty, sortBy]);

  return (
    <div className="page">
      <div className="section-header">
        <div>
          <h1 className="section-title">Talleres en Izalco</h1>
          <p className="section-subtitle">{filtered.length} taller{filtered.length !== 1 ? 'es' : ''} encontrado{filtered.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* SEARCH + FILTERS */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-body">
          <div style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div className="form-group" style={{ flex: '1 1 250px', marginBottom: 0 }}>
              <label className="form-label">Buscar</label>
              <div style={{ position: 'relative' }}>
                <input
                  className="form-input"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Taller, mecánico, servicio..."
                  style={{ paddingLeft: '2.25rem' }}
                />
                <span style={{ position: 'absolute', left: '.7rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>🔍</span>
              </div>
            </div>

            <div className="form-group" style={{ flex: '1 1 180px', marginBottom: 0 }}>
              <label className="form-label">Especialidad</label>
              <select className="form-select" value={filterSpecialty} onChange={(e) => setFilterSpecialty(e.target.value)}>
                <option value="">Todas</option>
                {ALL_SPECIALTIES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="form-group" style={{ flex: '1 1 150px', marginBottom: 0 }}>
              <label className="form-label">Ordenar por</label>
              <select className="form-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="rating">Mejor calificación</option>
                <option value="reviews">Más reseñas</option>
                <option value="name">Nombre A-Z</option>
                <option value="services">Más servicios</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '.75rem', alignItems: 'center', paddingBottom: '.1rem' }}>
              <label className="toggle">
                <input type="checkbox" checked={filterAvailable} onChange={(e) => setFilterAvailable(e.target.checked)} />
                <span className="toggle-slider" />
                <span className="toggle-label">Solo disponibles</span>
              </label>
              <label className="toggle">
                <input type="checkbox" checked={filterVerified} onChange={(e) => setFilterVerified(e.target.checked)} />
                <span className="toggle-slider" />
                <span className="toggle-label">Solo verificados</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* SPECIALTY CHIPS */}
      <div className="chip-list" style={{ marginBottom: '1.5rem' }}>
        <button className={`chip ${!filterSpecialty ? 'selected' : ''}`} onClick={() => setFilterSpecialty('')}>
          Todos
        </button>
        {ALL_SPECIALTIES.map((s) => (
          <button key={s} className={`chip ${filterSpecialty === s ? 'selected' : ''}`} onClick={() => setFilterSpecialty(filterSpecialty === s ? '' : s)}>
            {s}
          </button>
        ))}
      </div>

      {/* RESULTS */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <div className="empty-state-title">No se encontraron talleres</div>
          <div className="empty-state-text">Intenta con otros términos de búsqueda o ajusta los filtros</div>
          <button className="btn btn-outline btn-sm" style={{ marginTop: '1rem' }} onClick={() => { setSearch(''); setFilterAvailable(false); setFilterVerified(false); setFilterSpecialty(''); }}>
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div className="grid-3">
          {filtered.map((w) => (
            <WorkshopCard key={w.id} workshop={w} />
          ))}
        </div>
      )}
    </div>
  );
}
