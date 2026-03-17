import { useState, useEffect } from 'react';
import { User, Lock, Save } from 'lucide-react';
import Layout from '../components/Layout';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function Perfil() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    nombre: user?.nombre || '',
    telefono: '',
  });

  useEffect(() => {
    if (user?.idDentista) {
      api.get(`/dentistas/${user.idDentista}`).then(({ data }) => {
        setForm({ nombre: data.nombre, telefono: data.telefono || '' });
      }).catch(() => {});
    }
  }, [user?.idDentista]);
  const [passwords, setPasswords] = useState({
    passwordActual: '',
    passwordNuevo: '',
    confirmarPassword: '',
  });
  const [loadingPerfil, setLoadingPerfil] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  const handleGuardarPerfil = async (e) => {
    e.preventDefault();
    if (!form.nombre.trim()) return toast.error('El nombre es obligatorio');
    setLoadingPerfil(true);
    try {
      await api.put(`/dentistas/${user.idDentista}/perfil`, {
        nombre: form.nombre,
        telefono: form.telefono,
      });
      localStorage.setItem('nombre', form.nombre);
      toast.success('Perfil actualizado');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al actualizar perfil');
    } finally {
      setLoadingPerfil(false);
    }
  };

  const handleCambiarPassword = async (e) => {
    e.preventDefault();
    if (!passwords.passwordActual || !passwords.passwordNuevo) {
      return toast.error('Completa todos los campos');
    }
    if (passwords.passwordNuevo.length < 6) {
      return toast.error('La nueva contraseña debe tener al menos 6 caracteres');
    }
    if (passwords.passwordNuevo !== passwords.confirmarPassword) {
      return toast.error('Las contraseñas no coinciden');
    }
    setLoadingPassword(true);
    try {
      await api.put(`/dentistas/${user.idDentista}/perfil`, {
        nombre: form.nombre,
        telefono: form.telefono,
        passwordActual: passwords.passwordActual,
        passwordNuevo: passwords.passwordNuevo,
      });
      setPasswords({ passwordActual: '', passwordNuevo: '', confirmarPassword: '' });
      toast.success('Contraseña actualizada');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al cambiar contraseña');
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <Layout title="Mi Perfil">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Info del perfil */}
        <div className="bg-white dark:bg-dark-card rounded-xl border border-slate-200 dark:border-dark-border shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Informacion personal</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{user?.email}</p>
            </div>
          </div>

          <form onSubmit={handleGuardarPerfil} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nombre</label>
              <input
                type="text"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-dark-border bg-white dark:bg-dark-card text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Telefono</label>
              <input
                type="tel"
                value={form.telefono}
                onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-dark-border bg-white dark:bg-dark-card text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
              />
            </div>
            <Button type="submit" loading={loadingPerfil}>
              <Save className="w-4 h-4" />
              Guardar cambios
            </Button>
          </form>
        </div>

        {/* Cambiar contraseña */}
        <div className="bg-white dark:bg-dark-card rounded-xl border border-slate-200 dark:border-dark-border shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Lock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Cambiar contraseña</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Actualiza tu contraseña de acceso</p>
            </div>
          </div>

          <form onSubmit={handleCambiarPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Contraseña actual</label>
              <input
                type="password"
                value={passwords.passwordActual}
                onChange={(e) => setPasswords({ ...passwords, passwordActual: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-dark-border bg-white dark:bg-dark-card text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nueva contraseña</label>
              <input
                type="password"
                value={passwords.passwordNuevo}
                onChange={(e) => setPasswords({ ...passwords, passwordNuevo: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-dark-border bg-white dark:bg-dark-card text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Confirmar nueva contraseña</label>
              <input
                type="password"
                value={passwords.confirmarPassword}
                onChange={(e) => setPasswords({ ...passwords, confirmarPassword: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-dark-border bg-white dark:bg-dark-card text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
              />
            </div>
            <Button type="submit" variant="outline" loading={loadingPassword}>
              <Lock className="w-4 h-4" />
              Cambiar contraseña
            </Button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
