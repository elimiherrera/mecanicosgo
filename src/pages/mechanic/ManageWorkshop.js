import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import Modal from '../../components/Modal';

const SPECIALTIES = [
  'Mecánica General', 'Motores', 'Frenos', 'Suspensión', 'Eléctrico',
  'Aire Acondicionado', 'Carrocería', 'Pintura', 'Lámina', 'Transmisiones',
  'Mantenimiento Preventivo', 'Diagnóstico', 'Ruedas', 'Escape', 'Diesel',
];
const DAYS = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
const DAY_LABELS = { lunes: 'Lunes', martes: 'Martes', miercoles: 'Miércoles', jueves: 'Jueves', viernes: 'Viernes', sabado: 'Sábado', domingo: 'Domingo' };
const CATEGORIES = ['Mantenimiento', 'Motor', 'Seguridad', 'Eléctrico', 'Diagnóstico', 'Ruedas', 'Climatización', 'Carrocería', 'Estética', 'Vidrios', 'Transmisión', 'Otro'];

const emptyService = { name: '', description: '', price: '', duration: '', category: 'Mantenimiento' };

export default function ManageWorkshop() {
  const { currentUser, getMyWorkshop, updateWorkshop, addService, updateService, deleteService } = useApp();
  const workshop = getMyWorkshop(currentUser.id);

  const [tab, setTab] = useState('info');
  const [saved, setSaved] = useState(false);
  const [info, setInfo] = useState({});
  const [schedule, setSchedule] = useState({});
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceForm, setServiceForm] = useState(emptyService);
  const [serviceError, setServiceError] = useState('');

  useEffect(() => {
    if (workshop) {
      setInfo({
        name: workshop.name,
        description: workshop.description || '',
        address: workshop.address,
        phone: workshop.phone || '',
        whatsapp: workshop.whatsapp || '',
        email: workshop.email || '',
        isAvailable: workshop.isAvailable,
        specialties: workshop.specialties || [],
        lat: String(workshop.coordinates?.lat || ''),
        lng: String(workshop.coordinates?.lng || ''),
      });
      setSchedule(workshop.schedule || {});
    }
  }, [workshop]);

  if (!workshop) return null;

  function saveInfo(e) {
    e.preventDefault();
    updateWorkshop({
      id: workshop.id,
      name: info.name,
      description: info.description,
      address: info.address,
      phone: info.phone,
      whatsapp: info.whatsapp,
      email: info.email,
      isAvailable: info.isAvailable,
      specialties: info.specialties,
      coordinates: { lat: parseFloat(info.lat) || workshop.coordinates.lat, lng: parseFloat(info.lng) || workshop.coordinates.lng },
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function saveSchedule(e) {
    e.preventDefault();
    updateWorkshop({ id: workshop.id, schedule });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function toggleSpecialty(s) {
    setInfo((f) => ({
      ...f,
      specialties: f.specialties.includes(s) ? f.specialties.filter((x) => x !== s) : [...f.specialties, s],
    }));
  }

  function toggleDay(day) {
    setSchedule((s) => ({ ...s, [day]: { ...s[day], isOpen: !s[day]?.isOpen } }));
  }

  function setDayTime(day, field, val) {
    setSchedule((s) => ({ ...s, [day]: { ...s[day], [field]: val } }));
  }

  function openAddService() {
    setEditingService(null);
    setServiceForm(emptyService);
    setServiceError('');
    setShowServiceModal(true);
  }

  function openEditService(s) {
    setEditingService(s);
    setServiceForm({ name: s.name, description: s.description || '', price: String(s.price), duration: String(s.duration), category: s.category });
    setServiceError('');
    setShowServiceModal(true);
  }

  function submitService(e) {
    e.preventDefault();
    if (!serviceForm.name) { setServiceError('El nombre es requerido.'); return; }
    if (!serviceForm.price || isNaN(serviceForm.price) || Number(serviceForm.price) < 0) { setServiceError('Ingresa un precio válido.'); return; }
    if (!serviceForm.duration || isNaN(serviceForm.duration)) { setServiceError('Ingresa una duración válida en minutos.'); return; }
    const data = { ...serviceForm, price: parseFloat(serviceForm.price), duration: parseInt(serviceForm.duration) };
    if (editingService) updateService(workshop.id, { ...editingService, ...data });
    else addService(workshop.id, data);
    setShowServiceModal(false);
  }

  function handleDeleteService(svcId) {
    if (window.confirm('¿Eliminar este servicio?')) deleteService(workshop.id, svcId);
  }

  return (
    <div className="page" style={{ maxWidth: '820px' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 className="section-title">Mi Taller</h1>
        <p className="section-subtitle">{workshop.name}</p>
      </div>

      {saved && <div className="alert alert-success" style={{ marginBottom: '1rem' }}>✅ Cambios guardados correctamente.</div>}

      {/* AVAILABILITY TOGGLE */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontWeight: 700 }}>Estado de Disponibilidad</div>
            <div style={{ fontSize: '.83rem', color: 'var(--text-muted)' }}>
              Controla si los usuarios pueden agendar citas en tu taller
            </div>
          </div>
          <label className="toggle">
            <input
              type="checkbox"
              checked={info.isAvailable || false}
              onChange={(e) => {
                setInfo((f) => ({ ...f, isAvailable: e.target.checked }));
                updateWorkshop({ id: workshop.id, isAvailable: e.target.checked });
              }}
            />
            <span className="toggle-slider" />
            <span className="toggle-label" style={{ fontWeight: 700, color: info.isAvailable ? 'var(--success)' : 'var(--danger)' }}>
              {info.isAvailable ? '🟢 Disponible' : '🔴 No Disponible'}
            </span>
          </label>
        </div>
      </div>

      {/* TABS */}
      <div className="tabs">
        <button className={`tab ${tab === 'info' ? 'active' : ''}`} onClick={() => setTab('info')}>📋 Información</button>
        <button className={`tab ${tab === 'services' ? 'active' : ''}`} onClick={() => setTab('services')}>🛠️ Servicios</button>
        <button className={`tab ${tab === 'schedule' ? 'active' : ''}`} onClick={() => setTab('schedule')}>🕐 Horarios</button>
      </div>

      {/* INFO TAB */}
      {tab === 'info' && (
        <form onSubmit={saveInfo} className="form-stack">
          <div className="card">
            <div className="card-header"><span style={{ fontWeight: 700 }}>Información General</span></div>
            <div className="card-body form-stack">
              <div className="form-group">
                <label className="form-label">Nombre del Taller *</label>
                <input className="form-input" value={info.name || ''} onChange={(e) => setInfo((f) => ({ ...f, name: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label">Descripción</label>
                <textarea className="form-textarea" value={info.description || ''} onChange={(e) => setInfo((f) => ({ ...f, description: e.target.value }))} rows={4} placeholder="Describe tu taller, servicios y experiencia..." />
              </div>
              <div className="form-group">
                <label className="form-label">Dirección *</label>
                <input className="form-input" value={info.address || ''} onChange={(e) => setInfo((f) => ({ ...f, address: e.target.value }))} required placeholder="Ej: 5a Calle Poniente #10, Izalco" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Teléfono</label>
                  <input className="form-input" value={info.phone || ''} onChange={(e) => setInfo((f) => ({ ...f, phone: e.target.value }))} placeholder="2453-0000" />
                </div>
                <div className="form-group">
                  <label className="form-label">WhatsApp</label>
                  <input className="form-input" value={info.whatsapp || ''} onChange={(e) => setInfo((f) => ({ ...f, whatsapp: e.target.value }))} placeholder="70000000" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Correo electrónico</label>
                <input type="email" className="form-input" value={info.email || ''} onChange={(e) => setInfo((f) => ({ ...f, email: e.target.value }))} placeholder="taller@ejemplo.com" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Latitud GPS</label>
                  <input className="form-input" value={info.lat || ''} onChange={(e) => setInfo((f) => ({ ...f, lat: e.target.value }))} placeholder="13.7394" />
                </div>
                <div className="form-group">
                  <label className="form-label">Longitud GPS</label>
                  <input className="form-input" value={info.lng || ''} onChange={(e) => setInfo((f) => ({ ...f, lng: e.target.value }))} placeholder="-89.6699" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Especialidades</label>
                <div className="chip-list">
                  {SPECIALTIES.map((s) => (
                    <button key={s} type="button" className={`chip ${(info.specialties || []).includes(s) ? 'selected' : ''}`} onClick={() => toggleSpecialty(s)}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="card-footer" style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn btn-primary">💾 Guardar Información</button>
            </div>
          </div>
        </form>
      )}

      {/* SERVICES TAB */}
      {tab === 'services' && (
        <div>
          <div className="section-header" style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '.875rem', color: 'var(--text-muted)' }}>
              {workshop.services.length} servicio(s) registrado(s)
            </div>
            <button className="btn btn-primary" onClick={openAddService}>+ Agregar Servicio</button>
          </div>

          {workshop.services.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🛠️</div>
              <div className="empty-state-title">Sin servicios aún</div>
              <div className="empty-state-text">Agrega los servicios que ofrece tu taller para que los usuarios puedan verlos y agendar citas.</div>
              <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={openAddService}>+ Agregar Primer Servicio</button>
            </div>
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
                  <div style={{ display: 'flex', gap: '.4rem' }}>
                    <button className="btn btn-outline btn-sm" onClick={() => openEditService(s)}>✏️ Editar</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDeleteService(s.id)}>🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SCHEDULE TAB */}
      {tab === 'schedule' && (
        <form onSubmit={saveSchedule}>
          <div className="card">
            <div className="card-header"><span style={{ fontWeight: 700 }}>Horarios de Atención</span></div>
            <div className="card-body">
              <div className="schedule-grid">
                {DAYS.map((day) => {
                  const d = schedule[day] || { isOpen: false, open: '08:00', close: '17:00' };
                  return (
                    <div key={day} className="schedule-row">
                      <span className="schedule-day">{DAY_LABELS[day]}</span>
                      <label className="toggle">
                        <input type="checkbox" checked={d.isOpen || false} onChange={() => toggleDay(day)} />
                        <span className="toggle-slider" />
                      </label>
                      {d.isOpen ? (
                        <>
                          <input type="time" className="form-input" style={{ maxWidth: '120px' }} value={d.open || '08:00'} onChange={(e) => setDayTime(day, 'open', e.target.value)} />
                          <input type="time" className="form-input" style={{ maxWidth: '120px' }} value={d.close || '17:00'} onChange={(e) => setDayTime(day, 'close', e.target.value)} />
                        </>
                      ) : (
                        <>
                          <span style={{ fontSize: '.82rem', color: 'var(--text-muted)' }}>Cerrado</span>
                          <span />
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="card-footer" style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn btn-primary">💾 Guardar Horarios</button>
            </div>
          </div>
        </form>
      )}

      {/* SERVICE MODAL */}
      <Modal open={showServiceModal} onClose={() => setShowServiceModal(false)} title={editingService ? 'Editar Servicio' : 'Nuevo Servicio'}>
        <form onSubmit={submitService} className="form-stack">
          {serviceError && <div className="alert alert-error">⚠️ {serviceError}</div>}
          <div className="form-group">
            <label className="form-label">Nombre del Servicio *</label>
            <input className="form-input" value={serviceForm.name} onChange={(e) => setServiceForm((f) => ({ ...f, name: e.target.value }))} placeholder="Ej: Cambio de Aceite" required autoFocus />
          </div>
          <div className="form-group">
            <label className="form-label">Descripción</label>
            <textarea className="form-textarea" value={serviceForm.description} onChange={(e) => setServiceForm((f) => ({ ...f, description: e.target.value }))} placeholder="Describe brevemente el servicio..." rows={2} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Precio (USD) *</label>
              <div className="input-prefix">
                <span className="input-prefix-text">$</span>
                <input type="number" className="form-input" value={serviceForm.price} onChange={(e) => setServiceForm((f) => ({ ...f, price: e.target.value }))} placeholder="0.00" min="0" step="0.01" required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Duración (minutos) *</label>
              <input type="number" className="form-input" value={serviceForm.duration} onChange={(e) => setServiceForm((f) => ({ ...f, duration: e.target.value }))} placeholder="30" min="5" required />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Categoría</label>
            <select className="form-select" value={serviceForm.category} onChange={(e) => setServiceForm((f) => ({ ...f, category: e.target.value }))}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', gap: '.75rem', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-ghost" onClick={() => setShowServiceModal(false)}>Cancelar</button>
            <button type="submit" className="btn btn-primary">{editingService ? '💾 Guardar Cambios' : '+ Agregar Servicio'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
