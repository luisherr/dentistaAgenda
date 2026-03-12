import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Input from '../components/Input';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function NuevaCita() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pacientes, setPacientes] = useState([]);
  const [form, setForm] = useState({ idPaciente: '', fecha: '', hora: '', tratamiento: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchPaciente, setSearchPaciente] = useState('');

  useEffect(() => {
    api.get('/pacientes', { params: { idDentista: user.idDentista } })
      .then(({ data }) => setPacientes(data))
      .catch(() => toast.error('Error al cargar pacientes'));
  }, []);

  const filteredPacientes = pacientes.filter((p) =>
    p.nombre.toLowerCase().includes(searchPaciente.toLowerCase())
  );

  const validate = () => {
    const errs = {};
    if (!form.idPaciente) errs.idPaciente = 'Selecciona un paciente';
    if (!form.fecha) errs.fecha = 'La fecha es requerida';
    if (!form.hora) errs.hora = 'La hora es requerida';
    if (!form.tratamiento.trim()) errs.tratamiento = 'El tratamiento es requerido';

    if (form.fecha && form.hora) {
      const fechaHora = new Date(`${form.fecha}T${form.hora}`);
      if (fechaHora <= new Date()) errs.fecha = 'La fecha debe ser futura';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const fechaHora = `${form.fecha}T${form.hora}:00`;
      await api.post('/citas', {
        idPaciente: parseInt(form.idPaciente),
        idDentista: user.idDentista,
        fechaHora,
        tratamiento: form.tratamiento,
      });
      toast.success('Cita agendada exitosamente');
      navigate('/agenda');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al agendar cita');
    } finally {
      setLoading(false);
    }
  };

  const selectedPaciente = pacientes.find((p) => p.idPaciente === parseInt(form.idPaciente));

  return (
    <Layout title="Nueva Cita">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-dark-card rounded-xl border border-slate-200 dark:border-dark-border shadow-sm p-5 sm:p-8">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Agendar nueva cita</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Paciente selector */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Paciente</label>
              {selectedPaciente ? (
                <div className="flex items-center justify-between px-3 py-2 border border-slate-300 dark:border-dark-border rounded-lg bg-slate-50 dark:bg-neutral-800">
                  <span className="text-sm font-medium text-slate-900 dark:text-white">{selectedPaciente.nombre}</span>
                  <button
                    type="button"
                    onClick={() => { setForm({ ...form, idPaciente: '' }); setSearchPaciente(''); }}
                    className="text-xs text-primary hover:underline"
                  >
                    Cambiar
                  </button>
                </div>
              ) : (
                <div>
                  <input
                    type="text"
                    placeholder="Buscar paciente..."
                    value={searchPaciente}
                    onChange={(e) => setSearchPaciente(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg text-sm bg-white dark:bg-dark-card text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary placeholder:text-slate-400 dark:placeholder:text-slate-500 ${errors.idPaciente ? 'border-danger' : 'border-slate-300 dark:border-dark-border'}`}
                  />
                  {searchPaciente && filteredPacientes.length > 0 && (
                    <div className="mt-1 border border-slate-200 dark:border-dark-border rounded-lg max-h-40 overflow-y-auto bg-white dark:bg-dark-card shadow-md">
                      {filteredPacientes.map((p) => (
                        <button
                          key={p.idPaciente}
                          type="button"
                          onClick={() => { setForm({ ...form, idPaciente: p.idPaciente.toString() }); setSearchPaciente(''); }}
                          className="w-full text-left px-3 py-2 text-sm text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-neutral-700 transition-colors"
                        >
                          {p.nombre} <span className="text-slate-400 dark:text-slate-500">— {p.telefono}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  {errors.idPaciente && <p className="mt-1 text-xs text-danger">{errors.idPaciente}</p>}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Fecha"
                type="date"
                value={form.fecha}
                onChange={(e) => setForm({ ...form, fecha: e.target.value })}
                error={errors.fecha}
              />
              <Input
                label="Hora"
                type="time"
                value={form.hora}
                onChange={(e) => setForm({ ...form, hora: e.target.value })}
                error={errors.hora}
              />
            </div>

            <Input
              label="Tratamiento"
              placeholder="Ej: Limpieza dental profunda"
              value={form.tratamiento}
              onChange={(e) => setForm({ ...form, tratamiento: e.target.value })}
              error={errors.tratamiento}
            />

            <div className="flex gap-3 pt-2">
              <Button variant="outline" type="button" onClick={() => navigate(-1)}>
                Cancelar
              </Button>
              <Button type="submit" loading={loading}>
                Agendar cita
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
