import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Input from '../components/Input';
import Button from '../components/Button';
import toast from 'react-hot-toast';

export default function Login() {
  const { login, user } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) errs.email = 'El email es requerido';
    if (!form.password.trim()) errs.password = 'La contraseña es requerida';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('¡Bienvenido!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-light to-background dark:from-dark-bg dark:to-neutral-900 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-14 h-14">
              <rect width="40" height="40" rx="12" fill="#3D7B6F"/>
              <path d="M12 14C12 14 14 10 20 10C26 10 28 14 28 14" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
              <path d="M13 16L15 26C15.5 28.5 17 30 20 30C23 30 24.5 28.5 25 26L27 16" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="20" cy="19" r="2" fill="white" opacity="0.6"/>
              <path d="M17 22.5C17 22.5 18.5 24 20 24C21.5 24 23 22.5 23 22.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <h1 className="text-2xl text-slate-900 dark:text-white" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>DentAssist</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Gestiona tu consultorio fácilmente</p>
        </div>

        <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-slate-200 dark:border-dark-border p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Iniciar sesión</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="doctor@email.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              error={errors.email}
            />
            <Input
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              error={errors.password}
            />
            <Button type="submit" loading={loading} className="w-full">
              Iniciar sesión
            </Button>
          </form>
          <p className="text-sm text-center text-slate-500 dark:text-slate-400 mt-6">
            ¿No tienes cuenta?{' '}
            <Link to="/registro" className="text-primary font-medium hover:underline">
              Regístrate
            </Link>
          </p>
        </div>

        <button
          onClick={toggleTheme}
          className="mt-4 mx-auto block text-xs text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
        >
          {dark ? '☀️ Modo claro' : '🌙 Modo oscuro'}
        </button>
      </div>
    </div>
  );
}
