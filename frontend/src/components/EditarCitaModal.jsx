import { useState } from 'react';
import { X } from 'lucide-react';
import Button from './Button';
import api from '../api/axios';
import toast from 'react-hot-toast';

const tratamientos = [
  'Limpieza dental',
  'Extraccion simple',
  'Resina (obturacion)',
  'Endodoncia',
  'Corona dental',
  'Blanqueamiento',
  'Consulta general',
  'Ortodoncia',
  'Implante dental',
  'Otro',
];

export default function EditarCitaModal({ cita, onClose, onGuardado }) {
  const fechaHora = new Date(cita.fechaHora);
  const [form, setForm] = useState({
    fecha: fechaHora.toISOString().split('T')[0],
    hora: fechaHora.toTimeString().slice(0, 5),
    tratamiento: cita.tratamiento,
  });
  const [loading, setLoading] = useState(false);

  const handleGuardar = async (e) => {
    e.preventDefault();
    if (!form.fecha || !form.hora || !form.tratamiento) {
      return toast.error('Completa todos los campos');
    }
    setLoading(true);
    try {
      await api.put(`/citas/${cita.idCita}`, {
        fechaHora: `${form.fecha}T${form.hora}:00`,
        tratamiento: form.tratamiento,
      });
      toast.success('Cita actualizada');
      onGuardado();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al editar cita');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white dark:bg-dark-card rounded-xl border border-slate-200 dark:border-dark-border shadow-xl w-full max-w-md p-6 z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Editar cita</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 dark:hover:bg-neutral-700 rounded-lg">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          Paciente: <span className="font-medium text-slate-700 dark:text-slate-200">{cita.nombrePaciente}</span>
        </p>

        <form onSubmit={handleGuardar} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Fecha</label>
            <input
              type="date"
              value={form.fecha}
              onChange={(e) => setForm({ ...form, fecha: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-dark-border bg-white dark:bg-dark-card text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Hora</label>
            <input
              type="time"
              value={form.hora}
              onChange={(e) => setForm({ ...form, hora: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-dark-border bg-white dark:bg-dark-card text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tratamiento</label>
            <select
              value={form.tratamiento}
              onChange={(e) => setForm({ ...form, tratamiento: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-dark-border bg-white dark:bg-dark-card text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
            >
              {tratamientos.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" loading={loading} className="flex-1">
              Guardar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
