import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Input from '../components/Input';
import Button from '../components/Button';
import toast from 'react-hot-toast';

export default function Registro() {
  const { registro, user } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nombre: '', telefono: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  const validate = () => {
    const errs = {};
    if (!form.nombre.trim()) errs.nombre = 'El nombre es requerido';
    if (!form.telefono.trim()) errs.telefono = 'El teléfono es requerido';
    if (!form.email.trim()) errs.email = 'El email es requerido';
    if (!form.password.trim()) errs.password = 'La contraseña es requerida';
    else if (form.password.length < 6) errs.password = 'Mínimo 6 caracteres';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await registro(form);
      toast.success('¡Cuenta creada exitosamente!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al crear cuenta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-white dark:from-dark-bg dark:to-neutral-900 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🦷</div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">AgendaDentista</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Crea tu cuenta de dentista</p>
        </div>

        <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-slate-200 dark:border-dark-border p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Crear cuenta</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nombre completo"
              placeholder="Dr. Juan García"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              error={errors.nombre}
            />
            <Input
              label="Teléfono"
              placeholder="5512345678"
              value={form.telefono}
              onChange={(e) => setForm({ ...form, telefono: e.target.value })}
              error={errors.telefono}
            />
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
              Crear cuenta
            </Button>
          </form>
          <p className="text-sm text-center text-slate-500 dark:text-slate-400 mt-6">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Inicia sesión
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
