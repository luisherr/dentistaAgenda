import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CalendarDays, LayoutGrid } from 'lucide-react';
import Layout from '../components/Layout';
import Button from '../components/Button';
import CitaCard from '../components/CitaCard';
import EditarCitaModal from '../components/EditarCitaModal';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { useAuth } from '../context/AuthContext';
import { formatFechaInput, formatHora } from '../utils/formatters';
import {
  addDays, addMonths, subMonths, addWeeks, subWeeks,
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, isSameMonth, isSameDay, isToday, format, parseISO,
} from 'date-fns';
import { es } from 'date-fns/locale';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function Agenda() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [vista, setVista] = useState('mes');
  const [mesActual, setMesActual] = useState(new Date());
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
  const [citasMes, setCitasMes] = useState([]);
  const [citasDia, setCitasDia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingDia, setLoadingDia] = useState(false);
  const [citaEditando, setCitaEditando] = useState(null);

  const fetchCitasMes = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/citas', {
        params: { idDentista: user.idDentista },
      });
      setCitasMes(data);
    } catch {
      toast.error('Error al cargar citas');
    } finally {
      setLoading(false);
    }
  };

  const fetchCitasDia = async (fecha) => {
    setLoadingDia(true);
    try {
      const { data } = await api.get('/citas', {
        params: { idDentista: user.idDentista, fecha: formatFechaInput(fecha) },
      });
      setCitasDia(data);
    } catch {
      toast.error('Error al cargar citas del día');
    } finally {
      setLoadingDia(false);
    }
  };

  useEffect(() => { fetchCitasMes(); }, []);
  useEffect(() => { fetchCitasDia(fechaSeleccionada); }, [fechaSeleccionada]);

  const refrescar = () => {
    fetchCitasMes();
    fetchCitasDia(fechaSeleccionada);
  };

  const confirmar = async (id) => {
    try { await api.put(`/citas/${id}/confirmar`); toast.success('Cita confirmada'); refrescar(); }
    catch { toast.error('Error al confirmar'); }
  };
  const cancelar = async (id) => {
    try { await api.put(`/citas/${id}/cancelar`); toast.success('Cita cancelada'); refrescar(); }
    catch { toast.error('Error al cancelar'); }
  };
  const atender = async (id) => {
    try { await api.put(`/citas/${id}/estado`, { nuevoEstado: 3 }); toast.success('Cita marcada como atendida'); refrescar(); }
    catch { toast.error('Error al actualizar'); }
  };
  const revertir = async (id) => {
    try { await api.put(`/citas/${id}/estado`, { nuevoEstado: 0 }); toast.success('Cita revertida a pendiente'); refrescar(); }
    catch { toast.error('Error al revertir'); }
  };

  const getCitasDiaCalendario = (dia) =>
    citasMes.filter((c) => isSameDay(parseISO(c.fechaHora), dia));

  // Mes
  const monthStart = startOfMonth(mesActual);
  const monthEnd = endOfMonth(mesActual);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const diasCalendario = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // Semana
  const weekStart = startOfWeek(fechaSeleccionada, { weekStartsOn: 1 });
  const diasSemana = eachDayOfInterval({ start: weekStart, end: addDays(weekStart, 6) });

  const navegarAnterior = () => {
    if (vista === 'mes') setMesActual(subMonths(mesActual, 1));
    else { const nf = subWeeks(fechaSeleccionada, 1); setFechaSeleccionada(nf); setMesActual(nf); }
  };
  const navegarSiguiente = () => {
    if (vista === 'mes') setMesActual(addMonths(mesActual, 1));
    else { const nf = addWeeks(fechaSeleccionada, 1); setFechaSeleccionada(nf); setMesActual(nf); }
  };
  const irAHoy = () => { setFechaSeleccionada(new Date()); setMesActual(new Date()); };

  const diasHeader = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const diasHeaderCorto = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

  const estadoColor = (estado) => {
    if (estado === 1) return 'bg-secondary';
    if (estado === 2) return 'bg-danger';
    if (estado === 3) return 'bg-primary';
    return 'bg-warning';
  };

  return (
    <Layout title="Agenda">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <button onClick={navegarAnterior} className="p-2 hover:bg-slate-100 dark:hover:bg-neutral-700 rounded-lg transition-colors">
            <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
          <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white capitalize min-w-0 sm:min-w-[220px] text-center">
            {vista === 'mes'
              ? format(mesActual, "MMMM 'de' yyyy", { locale: es })
              : `${format(weekStart, "d MMM", { locale: es })} — ${format(addDays(weekStart, 6), "d MMM yyyy", { locale: es })}`}
          </h3>
          <button onClick={navegarSiguiente} className="p-2 hover:bg-slate-100 dark:hover:bg-neutral-700 rounded-lg transition-colors">
            <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
          <Button variant="outline" size="sm" onClick={irAHoy}>Hoy</Button>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 dark:bg-neutral-800 rounded-lg p-0.5">
            <button
              onClick={() => setVista('mes')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${vista === 'mes' ? 'bg-white dark:bg-dark-card shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
            >
              <LayoutGrid className="w-4 h-4" /> Mes
            </button>
            <button
              onClick={() => setVista('semana')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${vista === 'semana' ? 'bg-white dark:bg-dark-card shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
            >
              <CalendarDays className="w-4 h-4" /> Semana
            </button>
          </div>
          <Button onClick={() => navigate('/citas/nueva')} size="sm" className="sm:hidden">
            +
          </Button>
          <Button onClick={() => navigate('/citas/nueva')} className="hidden sm:inline-flex">
            Agendar cita
          </Button>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="flex flex-col xl:grid xl:grid-cols-3 gap-4 sm:gap-6">
          {/* Calendario */}
          <div className="xl:col-span-2">
            {vista === 'mes' ? (
              <div className="bg-white dark:bg-dark-card rounded-xl border border-slate-200 dark:border-dark-border shadow-sm overflow-hidden">
                {/* Desktop header */}
                <div className="hidden sm:grid grid-cols-7 border-b border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-neutral-800/50">
                  {diasHeader.map((d) => (
                    <div key={d} className="px-2 py-2.5 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">{d}</div>
                  ))}
                </div>
                {/* Mobile header */}
                <div className="sm:hidden grid grid-cols-7 border-b border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-neutral-800/50">
                  {diasHeaderCorto.map((d) => (
                    <div key={d} className="px-1 py-2 text-center text-xs font-semibold text-slate-500 dark:text-slate-400">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7">
                  {diasCalendario.map((dia, i) => {
                    const citasDel = getCitasDiaCalendario(dia);
                    const esHoy = isToday(dia);
                    const esMes = isSameMonth(dia, mesActual);
                    const esSel = isSameDay(dia, fechaSeleccionada);
                    return (
                      <button
                        key={i}
                        onClick={() => { setFechaSeleccionada(dia); }}
                        className={`min-h-[50px] sm:min-h-[85px] p-1 sm:p-1.5 border-b border-r border-slate-100 dark:border-dark-border text-left transition-colors hover:bg-primary-light dark:hover:bg-primary/5
                          ${!esMes ? 'bg-slate-50/50 dark:bg-neutral-900/30' : ''}
                          ${esSel ? 'bg-primary-light dark:bg-primary/10 ring-2 ring-primary ring-inset' : ''}`}
                      >
                        <div className={`text-xs sm:text-sm font-medium mb-0.5 sm:mb-1 w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-full
                          ${esHoy ? 'bg-primary text-white' : !esMes ? 'text-slate-300 dark:text-slate-600' : 'text-slate-700 dark:text-slate-300'}`}>
                          {format(dia, 'd')}
                        </div>
                        {citasDel.length > 0 && (
                          <>
                            {/* Desktop: show details */}
                            <div className="hidden sm:block space-y-0.5">
                              {citasDel.slice(0, 3).map((c) => (
                                <div key={c.idCita} className={`text-[10px] px-1 py-0.5 rounded text-white truncate ${estadoColor(c.estado)}`}>
                                  {formatHora(c.fechaHora)} {c.nombrePaciente?.split(' ')[0]}
                                </div>
                              ))}
                              {citasDel.length > 3 && (
                                <div className="text-[10px] text-slate-400 dark:text-slate-500 px-1">+{citasDel.length - 3} más</div>
                              )}
                            </div>
                            {/* Mobile: show dots */}
                            <div className="sm:hidden flex gap-0.5 justify-center flex-wrap">
                              {citasDel.slice(0, 3).map((c) => (
                                <div key={c.idCita} className={`w-1.5 h-1.5 rounded-full ${estadoColor(c.estado)}`} />
                              ))}
                              {citasDel.length > 3 && (
                                <div className="text-[8px] text-slate-400">+</div>
                              )}
                            </div>
                          </>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* VISTA SEMANAL */
              <div className="bg-white dark:bg-dark-card rounded-xl border border-slate-200 dark:border-dark-border shadow-sm overflow-hidden">
                <div className="grid grid-cols-7 border-b border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-neutral-800/50">
                  {diasSemana.map((dia, i) => (
                    <button
                      key={i}
                      onClick={() => setFechaSeleccionada(dia)}
                      className={`px-1 sm:px-2 py-2 sm:py-3 text-center transition-colors hover:bg-primary-light dark:hover:bg-primary/5 ${isSameDay(dia, fechaSeleccionada) ? 'bg-primary-light dark:bg-primary/10' : ''}`}
                    >
                      <div className="text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                        {format(dia, 'EEE', { locale: es })}
                      </div>
                      <div className={`text-sm sm:text-lg font-bold mt-0.5 w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center rounded-full mx-auto
                        ${isToday(dia) ? 'bg-primary text-white' : isSameDay(dia, fechaSeleccionada) ? 'bg-primary-light dark:bg-primary/20 text-primary' : 'text-slate-700 dark:text-slate-300'}`}>
                        {format(dia, 'd')}
                      </div>
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-7 min-h-[300px] sm:min-h-[400px]">
                  {diasSemana.map((dia, i) => {
                    const citasDel = getCitasDiaCalendario(dia);
                    return (
                      <div key={i} className={`border-r border-slate-100 dark:border-dark-border p-1 sm:p-1.5 ${isSameDay(dia, fechaSeleccionada) ? 'bg-primary-light/50 dark:bg-primary/5' : ''}`}>
                        {citasDel.length === 0 ? (
                          <div className="text-[9px] sm:text-[10px] text-slate-300 dark:text-slate-600 text-center mt-4">Sin citas</div>
                        ) : (
                          <div className="space-y-1">
                            {citasDel.sort((a, b) => new Date(a.fechaHora) - new Date(b.fechaHora)).map((c) => (
                              <button
                                key={c.idCita}
                                onClick={() => setFechaSeleccionada(dia)}
                                className={`w-full text-left p-1 sm:p-1.5 rounded-lg text-[10px] sm:text-[11px] text-white ${estadoColor(c.estado)} hover:opacity-90 transition-opacity`}
                              >
                                <div className="font-bold">{formatHora(c.fechaHora)}</div>
                                <div className="truncate hidden sm:block">{c.nombrePaciente?.split(' ')[0]}</div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Panel lateral: citas del día seleccionado */}
          <div>
            <div className="bg-white dark:bg-dark-card rounded-xl border border-slate-200 dark:border-dark-border shadow-sm p-4">
              <h4 className="font-semibold text-slate-900 dark:text-white mb-3 capitalize">
                {isToday(fechaSeleccionada)
                  ? 'Hoy'
                  : format(fechaSeleccionada, "EEEE d 'de' MMMM", { locale: es })}
              </h4>
              {loadingDia ? (
                <LoadingSpinner />
              ) : citasDia.length === 0 ? (
                <EmptyState message="No hay citas para este día" actionLabel="Agendar cita" onAction={() => navigate('/citas/nueva')} />
              ) : (
                <div className="space-y-3">
                  {citasDia.sort((a, b) => new Date(a.fechaHora) - new Date(b.fechaHora)).map((cita) => (
                    <CitaCard
                      key={cita.idCita}
                      cita={cita}
                      onConfirmar={confirmar}
                      onCancelar={cancelar}
                      onAtender={atender}
                      onRevertir={revertir}
                      onEditar={setCitaEditando}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {citaEditando && (
        <EditarCitaModal
          cita={citaEditando}
          onClose={() => setCitaEditando(null)}
          onGuardado={refrescar}
        />
      )}
    </Layout>
  );
}
