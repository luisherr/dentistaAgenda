import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, CheckCircle, Clock, XCircle } from 'lucide-react';
import Layout from '../components/Layout';
import StatsCard from '../components/StatsCard';
import CitaCard from '../components/CitaCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { useAuth } from '../context/AuthContext';
import { getGreeting, formatFechaCompleta, formatFechaInput } from '../utils/formatters';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [citasHoy, setCitasHoy] = useState([]);
  const [todasCitas, setTodasCitas] = useState([]);
  const [loading, setLoading] = useState(true);

  const hoy = formatFechaInput(new Date());

  const fetchData = async () => {
    try {
      const [resHoy, resTodas] = await Promise.all([
        api.get('/citas', { params: { idDentista: user.idDentista, fecha: hoy } }),
        api.get('/citas', { params: { idDentista: user.idDentista } }),
      ]);
      setCitasHoy(Array.isArray(resHoy.data) ? resHoy.data : []);
      setTodasCitas(Array.isArray(resTodas.data) ? resTodas.data : []);
    } catch {
      toast.error('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const confirmar = async (id) => {
    try { await api.put(`/citas/${id}/confirmar`); toast.success('Cita confirmada'); fetchData(); }
    catch { toast.error('Error al confirmar'); }
  };
  const cancelar = async (id) => {
    try { await api.put(`/citas/${id}/cancelar`); toast.success('Cita cancelada'); fetchData(); }
    catch { toast.error('Error al cancelar'); }
  };
  const atender = async (id) => {
    try { await api.put(`/citas/${id}/estado`, { nuevoEstado: 3 }); toast.success('Cita marcada como atendida'); fetchData(); }
    catch { toast.error('Error al actualizar'); }
  };
  const revertir = async (id) => {
    try { await api.put(`/citas/${id}/estado`, { nuevoEstado: 0 }); toast.success('Cita revertida a pendiente'); fetchData(); }
    catch { toast.error('Error al revertir'); }
  };

  const confirmadas = citasHoy.filter((c) => c.estado === 1).length;
  const pendientes = citasHoy.filter((c) => c.estado === 0).length;
  const canceladas = citasHoy.filter((c) => c.estado === 2).length;

  const proximasCitas = todasCitas
    .filter((c) => new Date(c.fechaHora) > new Date() && c.estado !== 2)
    .sort((a, b) => new Date(a.fechaHora) - new Date(b.fechaHora))
    .slice(0, 5);

  return (
    <Layout title="Dashboard">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          {getGreeting()}, {user?.nombre}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 capitalize">{formatFechaCompleta(new Date().toISOString())}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
        <StatsCard icon={CalendarDays} label="Citas hoy" value={citasHoy.length} color="primary" />
        <StatsCard icon={CheckCircle} label="Confirmadas" value={confirmadas} color="secondary" />
        <StatsCard icon={Clock} label="Pendientes" value={pendientes} color="warning" />
        <StatsCard icon={XCircle} label="Canceladas" value={canceladas} color="danger" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Agenda del día</h3>
          {loading ? (
            <LoadingSpinner />
          ) : citasHoy.length === 0 ? (
            <EmptyState
              message="No hay citas para hoy"
              actionLabel="Agendar cita"
              onAction={() => navigate('/citas/nueva')}
            />
          ) : (
            <div className="space-y-3">
              {citasHoy
                .sort((a, b) => new Date(a.fechaHora) - new Date(b.fechaHora))
                .map((cita) => (
                  <CitaCard
                    key={cita.idCita}
                    cita={cita}
                    onConfirmar={confirmar}
                    onCancelar={cancelar}
                    onAtender={atender}
                    onRevertir={revertir}
                  />
                ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Próximas citas</h3>
          {proximasCitas.length === 0 ? (
            <EmptyState message="No hay citas próximas" />
          ) : (
            <div className="space-y-3">
              {proximasCitas.map((cita) => (
                <CitaCard
                  key={cita.idCita}
                  cita={cita}
                  onConfirmar={confirmar}
                  onCancelar={cancelar}
                  onAtender={atender}
                  onRevertir={revertir}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
