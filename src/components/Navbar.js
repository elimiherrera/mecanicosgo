import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60) return 'Ahora';
  if (diff < 3600) return `Hace ${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `Hace ${Math.floor(diff / 3600)}h`;
  return `Hace ${Math.floor(diff / 86400)}d`;
}

export default function Navbar() {
  const { currentUser, logout, getMyNotifications, markRead } = useApp();
  const navigate = useNavigate();
  const [showNotifs, setShowNotifs] = useState(false);
  const notifRef = useRef(null);

  const notifications = currentUser ? getMyNotifications(currentUser.id) : [];
  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handler(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifs(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function handleLogout() {
    logout();
    navigate('/');
  }

  const isMechanic = currentUser?.role === 'mechanic';

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <NavLink to={currentUser ? (isMechanic ? '/panel' : '/inicio') : '/'} className="navbar-brand">
          <div className="logo-icon">🔧</div>
          <span>MecánicosGo</span>
        </NavLink>

        {currentUser && (
          <div className="navbar-links">
            {isMechanic ? (
              <>
                <NavLink to="/panel" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
                  📊 Panel
                </NavLink>
                <NavLink to="/panel/taller" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
                  🏪 Mi Taller
                </NavLink>
                <NavLink to="/panel/citas" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
                  📅 Citas
                </NavLink>
              </>
            ) : (
              <>
                <NavLink to="/inicio" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
                  🏠 Inicio
                </NavLink>
                <NavLink to="/talleres" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
                  🔍 Talleres
                </NavLink>
                <NavLink to="/mis-citas" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
                  📅 Mis Citas
                </NavLink>
              </>
            )}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
          {currentUser ? (
            <>
              <div ref={notifRef} style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowNotifs((v) => !v)}
                  style={{
                    background: 'rgba(255,255,255,.1)', border: 'none', color: '#fff',
                    width: '36px', height: '36px', borderRadius: '50%', fontSize: '1.1rem',
                    cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                  title="Notificaciones"
                >
                  🔔
                  {unreadCount > 0 && (
                    <span style={{
                      position: 'absolute', top: '2px', right: '2px',
                      background: '#EF4444', color: '#fff', borderRadius: '50%',
                      width: '16px', height: '16px', fontSize: '.6rem', fontWeight: 700,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotifs && (
                  <div className="notif-panel">
                    <div style={{ padding: '.75rem 1rem', fontWeight: 700, fontSize: '.85rem', borderBottom: '1px solid var(--border)' }}>
                      Notificaciones
                    </div>
                    {notifications.length === 0 ? (
                      <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '.83rem' }}>
                        Sin notificaciones
                      </div>
                    ) : (
                      notifications.slice(0, 10).map((n) => (
                        <div
                          key={n.id}
                          className={`notif-item ${!n.read ? 'unread' : ''}`}
                          onClick={() => markRead(n.id)}
                        >
                          {n.message}
                          <div className="notif-time">{timeAgo(n.createdAt)}</div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              <div className="navbar-user">
                <div className="avatar">{currentUser.name[0].toUpperCase()}</div>
                <span style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {currentUser.name.split(' ')[0]}
                </span>
              </div>

              <button onClick={handleLogout} className="btn btn-outline btn-sm" style={{ color: 'rgba(255,255,255,.8)', borderColor: 'rgba(255,255,255,.25)' }}>
                Salir
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="btn btn-ghost btn-sm" style={{ color: 'rgba(255,255,255,.8)' }}>
                Iniciar Sesión
              </NavLink>
              <NavLink to="/registro" className="btn btn-primary btn-sm">
                Registrarse
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
