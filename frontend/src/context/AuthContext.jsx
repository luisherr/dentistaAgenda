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
    const fechaRegistro = localStorage.getItem('fechaRegistro');
    const enTrial = localStorage.getItem('enTrial') === 'true';
    const diasRestantesTrial = parseInt(localStorage.getItem('diasRestantesTrial') || '0');

    if (token && idDentista) {
      setUser({ token, idDentista: parseInt(idDentista), nombre, email, suscripcionActiva, fechaRegistro, enTrial, diasRestantesTrial });
    }
    setLoading(false);
  }, []);

  const guardarUsuario = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('idDentista', data.idDentista);
    localStorage.setItem('nombre', data.nombre);
    localStorage.setItem('email', data.email);
    localStorage.setItem('suscripcionActiva', data.suscripcionActiva);
    localStorage.setItem('fechaRegistro', data.fechaRegistro);
    localStorage.setItem('enTrial', data.enTrial);
    localStorage.setItem('diasRestantesTrial', data.diasRestantesTrial);
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
    localStorage.setItem('enTrial', updated.enTrial);
    localStorage.setItem('diasRestantesTrial', updated.diasRestantesTrial);
    setUser(updated);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('idDentista');
    localStorage.removeItem('nombre');
    localStorage.removeItem('email');
    localStorage.removeItem('suscripcionActiva');
    localStorage.removeItem('fechaRegistro');
    localStorage.removeItem('enTrial');
    localStorage.removeItem('diasRestantesTrial');
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
