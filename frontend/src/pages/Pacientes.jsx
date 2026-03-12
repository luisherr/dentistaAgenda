import { useState, useEffect } from 'react';
import { UserPlus, Search, Trash2, AlertTriangle } from 'lucide-react';
import Layout from '../components/Layout';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { useAuth } from '../context/AuthContext';
import { formatTelefono } from '../utils/formatters';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { format, parseISO } from 'date-fns';

export default function Pacientes() {
  const { user } = useAuth();
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ nombre: '', telefono: '', email: '' });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false, paciente: null });
  const [deleting, setDeleting] = useState(false);

  const fetchPacientes = async () => {
    try {
      const { data } = await api.get('/pacientes', { params: { idDentista: user.idDentista } });
      setPacientes(data);
    } catch {
      toast.error('Error al cargar pacientes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPacientes(); }, []);

  const filtrados = pacientes.filter((p) =>
    p.nombre.toLowerCase().includes(search.toLowerCase())
  );

  const validate = () => {
    const errs = {};
    if (!form.nombre.trim()) errs.nombre = 'El nombre es requerido';
    if (!form.telefono.trim()) errs.telefono = 'El teléfono es requerido';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      await api.post('/pacientes', { ...form, idDentista: user.idDentista });
      toast.success('Paciente creado');
      setModalOpen(false);
      setForm({ nombre: '', telefono: '', email: '' });
      setErrors({});
      fetchPacientes();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al crear paciente');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.paciente) return;
    setDeleting(true);
    try {
      await api.delete(`/pacientes/${deleteModal.paciente.idPaciente}`);
      toast.success('Paciente eliminado');
      setDeleteModal({ open: false, paciente: null });
      fetchPacientes();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al eliminar paciente');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Layout title="Pacientes">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar paciente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-dark-border rounded-lg text-sm bg-white dark:bg-dark-card text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <UserPlus className="w-4 h-4" />
          Nuevo paciente
        </Button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : filtrados.length === 0 ? (
        <EmptyState
          message={search ? 'No se encontraron pacientes' : 'Aún no tienes pacientes'}
          actionLabel={!search ? 'Agregar paciente' : undefined}
          onAction={!search ? () => setModalOpen(true) : undefined}
        />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-white dark:bg-dark-card rounded-xl border border-slate-200 dark:border-dark-border shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-neutral-800/50">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Nombre</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Teléfono</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Email</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Registro</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase w-16"></th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map((p) => (
                  <tr key={p.idPaciente} className="border-b border-slate-100 dark:border-dark-border hover:bg-slate-50 dark:hover:bg-neutral-800/30 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">{p.nombre}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{formatTelefono(p.telefono)}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{p.email || '—'}</td>
                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                      {format(parseISO(p.fechaRegistro), 'dd/MM/yyyy')}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setDeleteModal({ open: true, paciente: p })}
                        className="p-1.5 text-slate-400 hover:text-danger hover:bg-danger-light dark:hover:bg-danger/20 rounded-lg transition-colors"
                        title="Eliminar paciente"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {filtrados.map((p) => (
              <div key={p.idPaciente} className="bg-white dark:bg-dark-card rounded-xl border border-slate-200 dark:border-dark-border shadow-sm p-4">
                <div className="flex items-start justify-between">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 dark:text-white">{p.nombre}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{formatTelefono(p.telefono)}</p>
                    {p.email && <p className="text-sm text-slate-500 dark:text-slate-400">{p.email}</p>}
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                      Registro: {format(parseISO(p.fechaRegistro), 'dd/MM/yyyy')}
                    </p>
                  </div>
                  <button
                    onClick={() => setDeleteModal({ open: true, paciente: p })}
                    className="p-1.5 text-slate-400 hover:text-danger hover:bg-danger-light dark:hover:bg-danger/20 rounded-lg transition-colors flex-shrink-0"
                    title="Eliminar paciente"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Modal crear paciente */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Nuevo paciente">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Nombre completo"
            placeholder="Juan Pérez"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            error={errors.nombre}
          />
          <Input
            label="Teléfono"
            placeholder="5511223344"
            value={form.telefono}
            onChange={(e) => setForm({ ...form, telefono: e.target.value })}
            error={errors.telefono}
          />
          <Input
            label="Email (opcional)"
            type="email"
            placeholder="paciente@email.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="outline" type="button" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" loading={saving}>
              Guardar
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal confirmar eliminación */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, paciente: null })}
        title="Eliminar paciente"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-danger-light dark:bg-danger/10 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-danger">Esta acción no se puede deshacer</p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Se eliminará permanentemente al paciente <strong className="text-slate-900 dark:text-white">{deleteModal.paciente?.nombre}</strong> y toda su información asociada. No será posible recuperar estos datos.
              </p>
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => setDeleteModal({ open: false, paciente: null })}
            >
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleDelete} loading={deleting}>
              <Trash2 className="w-4 h-4" />
              Eliminar
            </Button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
}
