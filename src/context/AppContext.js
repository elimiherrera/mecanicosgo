import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { initialData } from '../data/mockData';

const AppContext = createContext();

const T = {
  LOAD: 'LOAD',
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  REGISTER: 'REGISTER',
  UPDATE_WORKSHOP: 'UPDATE_WORKSHOP',
  ADD_SERVICE: 'ADD_SERVICE',
  UPDATE_SERVICE: 'UPDATE_SERVICE',
  DELETE_SERVICE: 'DELETE_SERVICE',
  ADD_APPOINTMENT: 'ADD_APPOINTMENT',
  UPDATE_APPOINTMENT: 'UPDATE_APPOINTMENT',
  ADD_REVIEW: 'ADD_REVIEW',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  MARK_READ: 'MARK_READ',
};

function calcRating(reviews, workshopId) {
  const wReviews = reviews.filter((r) => r.workshopId === workshopId);
  if (!wReviews.length) return { rating: 0, reviewCount: 0 };
  const avg = wReviews.reduce((s, r) => s + r.rating, 0) / wReviews.length;
  return { rating: Math.round(avg * 10) / 10, reviewCount: wReviews.length };
}

function reducer(state, action) {
  switch (action.type) {
    case T.LOAD:
      return { ...state, ...action.payload };

    case T.LOGIN:
      return { ...state, currentUser: action.payload };

    case T.LOGOUT:
      return { ...state, currentUser: null };

    case T.REGISTER: {
      const { user, workshop } = action.payload;
      return {
        ...state,
        users: [...state.users, user],
        workshops: workshop ? [...state.workshops, workshop] : state.workshops,
        currentUser: user,
      };
    }

    case T.UPDATE_WORKSHOP:
      return {
        ...state,
        workshops: state.workshops.map((w) =>
          w.id === action.payload.id ? { ...w, ...action.payload } : w
        ),
      };

    case T.ADD_SERVICE:
      return {
        ...state,
        workshops: state.workshops.map((w) =>
          w.id === action.payload.workshopId
            ? { ...w, services: [...w.services, action.payload.service] }
            : w
        ),
      };

    case T.UPDATE_SERVICE:
      return {
        ...state,
        workshops: state.workshops.map((w) =>
          w.id === action.payload.workshopId
            ? {
                ...w,
                services: w.services.map((s) =>
                  s.id === action.payload.service.id ? action.payload.service : s
                ),
              }
            : w
        ),
      };

    case T.DELETE_SERVICE:
      return {
        ...state,
        workshops: state.workshops.map((w) =>
          w.id === action.payload.workshopId
            ? { ...w, services: w.services.filter((s) => s.id !== action.payload.serviceId) }
            : w
        ),
      };

    case T.ADD_APPOINTMENT:
      return { ...state, appointments: [...state.appointments, action.payload] };

    case T.UPDATE_APPOINTMENT:
      return {
        ...state,
        appointments: state.appointments.map((a) =>
          a.id === action.payload.id ? { ...a, ...action.payload } : a
        ),
      };

    case T.ADD_REVIEW: {
      const newReviews = [...state.reviews, action.payload];
      const stats = calcRating(newReviews, action.payload.workshopId);
      return {
        ...state,
        reviews: newReviews,
        workshops: state.workshops.map((w) =>
          w.id === action.payload.workshopId ? { ...w, ...stats } : w
        ),
      };
    }

    case T.ADD_NOTIFICATION:
      return { ...state, notifications: [action.payload, ...state.notifications] };

    case T.MARK_READ:
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.payload ? { ...n, read: true } : n
        ),
      };

    default:
      return state;
  }
}

const baseState = {
  currentUser: null,
  users: initialData.users,
  workshops: initialData.workshops,
  appointments: initialData.appointments,
  reviews: initialData.reviews,
  notifications: [],
};

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, baseState);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('mecanicosgo_v1');
      if (saved) dispatch({ type: T.LOAD, payload: JSON.parse(saved) });
    } catch (_) {}
  }, []);

  useEffect(() => {
    localStorage.setItem('mecanicosgo_v1', JSON.stringify(state));
  }, [state]);

  function login(email, password) {
    const user = state.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!user) return { success: false, error: 'Correo o contraseña incorrectos.' };
    dispatch({ type: T.LOGIN, payload: user });
    return { success: true, user };
  }

  function logout() {
    dispatch({ type: T.LOGOUT });
  }

  function registerUser(data) {
    if (state.users.find((u) => u.email.toLowerCase() === data.email.toLowerCase()))
      return { success: false, error: 'Este correo ya está registrado.' };
    const user = { ...data, id: 'u' + Date.now(), role: 'user', createdAt: new Date().toISOString() };
    dispatch({ type: T.REGISTER, payload: { user } });
    return { success: true, user };
  }

  function registerMechanic(mechData, workshopData) {
    if (state.users.find((u) => u.email.toLowerCase() === mechData.email.toLowerCase()))
      return { success: false, error: 'Este correo ya está registrado.' };
    const user = {
      ...mechData,
      id: 'm' + Date.now(),
      role: 'mechanic',
      createdAt: new Date().toISOString(),
    };
    const workshop = {
      ...workshopData,
      id: 'w' + Date.now(),
      mechanicId: user.id,
      mechanicName: mechData.name,
      mechanicExperience: Number(mechData.experience) || 0,
      rating: 0,
      reviewCount: 0,
      isVerified: false,
      isAvailable: true,
      services: [],
      schedule: {
        lunes: { open: '08:00', close: '17:00', isOpen: true },
        martes: { open: '08:00', close: '17:00', isOpen: true },
        miercoles: { open: '08:00', close: '17:00', isOpen: true },
        jueves: { open: '08:00', close: '17:00', isOpen: true },
        viernes: { open: '08:00', close: '17:00', isOpen: true },
        sabado: { open: '08:00', close: '12:00', isOpen: true },
        domingo: { open: '', close: '', isOpen: false },
      },
      specialties: workshopData.specialties || [],
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: T.REGISTER, payload: { user, workshop } });
    return { success: true, user };
  }

  function updateWorkshop(data) {
    dispatch({ type: T.UPDATE_WORKSHOP, payload: data });
  }

  function addService(workshopId, service) {
    const newService = { ...service, id: 'srv' + Date.now() };
    dispatch({ type: T.ADD_SERVICE, payload: { workshopId, service: newService } });
    return newService;
  }

  function updateService(workshopId, service) {
    dispatch({ type: T.UPDATE_SERVICE, payload: { workshopId, service } });
  }

  function deleteService(workshopId, serviceId) {
    dispatch({ type: T.DELETE_SERVICE, payload: { workshopId, serviceId } });
  }

  function bookAppointment(data) {
    const appt = { ...data, id: 'a' + Date.now(), status: 'pending', createdAt: new Date().toISOString() };
    dispatch({ type: T.ADD_APPOINTMENT, payload: appt });
    const workshop = state.workshops.find((w) => w.id === data.workshopId);
    if (workshop) {
      dispatch({
        type: T.ADD_NOTIFICATION,
        payload: {
          id: 'n' + Date.now(),
          userId: workshop.mechanicId,
          type: 'appointment',
          message: `Nueva cita de ${data.userName} para el ${data.date} a las ${data.time}`,
          read: false,
          createdAt: new Date().toISOString(),
        },
      });
    }
    return appt;
  }

  function updateAppointment(id, changes) {
    dispatch({ type: T.UPDATE_APPOINTMENT, payload: { id, ...changes } });
  }

  function addReview(data) {
    const review = { ...data, id: 'r' + Date.now(), createdAt: new Date().toISOString() };
    dispatch({ type: T.ADD_REVIEW, payload: review });
    return review;
  }

  function notify(userId, message, type = 'info') {
    dispatch({
      type: T.ADD_NOTIFICATION,
      payload: { id: 'n' + Date.now(), userId, type, message, read: false, createdAt: new Date().toISOString() },
    });
  }

  function markRead(notifId) {
    dispatch({ type: T.MARK_READ, payload: notifId });
  }

  function getMyWorkshop(mechanicId) {
    return state.workshops.find((w) => w.mechanicId === mechanicId);
  }

  function getWorkshopReviews(workshopId) {
    return state.reviews.filter((r) => r.workshopId === workshopId);
  }

  function getWorkshopAppointments(workshopId) {
    return state.appointments.filter((a) => a.workshopId === workshopId);
  }

  function getUserAppointments(userId) {
    return state.appointments.filter((a) => a.userId === userId);
  }

  function getMyNotifications(userId) {
    return state.notifications.filter((n) => n.userId === userId);
  }

  function hasUserReviewed(userId, workshopId) {
    return state.reviews.some((r) => r.userId === userId && r.workshopId === workshopId);
  }

  return (
    <AppContext.Provider
      value={{
        ...state,
        login,
        logout,
        registerUser,
        registerMechanic,
        updateWorkshop,
        addService,
        updateService,
        deleteService,
        bookAppointment,
        updateAppointment,
        addReview,
        notify,
        markRead,
        getMyWorkshop,
        getWorkshopReviews,
        getWorkshopAppointments,
        getUserAppointments,
        getMyNotifications,
        hasUserReviewed,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
