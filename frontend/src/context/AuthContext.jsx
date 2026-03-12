import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

    if (token && idDentista) {
      setUser({ token, idDentista: parseInt(idDentista), nombre, email });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('idDentista', data.idDentista);
    localStorage.setItem('nombre', data.nombre);
    localStorage.setItem('email', data.email);
    setUser(data);
    return data;
  };

  const registro = async (datos) => {
    const { data } = await api.post('/auth/registro', datos);
    localStorage.setItem('token', data.token);
    localStorage.setItem('idDentista', data.idDentista);
    localStorage.setItem('nombre', data.nombre);
    localStorage.setItem('email', data.email);
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('idDentista');
    localStorage.removeItem('nombre');
    localStorage.removeItem('email');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, registro, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
}
