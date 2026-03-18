import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const idDentista = localStorage.getItem('idDentista');
    const nombre = localStorage.getItem('nombre');
    const email = localStorage.getItem('email');
    const suscripcionActiva = localStorage.getItem('suscripcionActiva') === 'true';
    const fechaFinSuscripcion = localStorage.getItem('fechaFinSuscripcion');

    if (token && idDentista) {
      setUser({ token, idDentista: parseInt(idDentista), nombre, email, suscripcionActiva, fechaFinSuscripcion });
    }
    setLoading(false);
  }, []);

  const guardarUsuario = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('idDentista', data.idDentista);
    localStorage.setItem('nombre', data.nombre);
    localStorage.setItem('email', data.email);
    localStorage.setItem('suscripcionActiva', data.suscripcionActiva);
    localStorage.setItem('fechaFinSuscripcion', data.fechaFinSuscripcion || '');
    setUser(data);
  };

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    guardarUsuario(data);
    return data;
  };

  const registro = async (datos) => {
    const { data } = await api.post('/auth/registro', datos);
    guardarUsuario(data);
    return data;
  };

  const actualizarSuscripcion = (suscripcionData) => {
    const updated = { ...user, ...suscripcionData };
    localStorage.setItem('suscripcionActiva', updated.suscripcionActiva);
    localStorage.setItem('fechaFinSuscripcion', updated.fechaFinSuscripcion || '');
    setUser(updated);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('idDentista');
    localStorage.removeItem('nombre');
    localStorage.removeItem('email');
    localStorage.removeItem('suscripcionActiva');
    localStorage.removeItem('fechaFinSuscripcion');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, registro, logout, loading, actualizarSuscripcion }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
}
