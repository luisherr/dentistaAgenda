import { Check, X, UserCheck, Clock, Undo2, Pencil } from 'lucide-react';
import EstadoBadge from './EstadoBadge';
import Button from './Button';
import { formatHora } from '../utils/formatters';

export default function CitaCard({ cita, onConfirmar, onCancelar, onAtender, onRevertir, onEditar }) {
  const puedeEditar = cita.estado === 0 || cita.estado === 1;

  return (
    <div className="bg-white dark:bg-dark-card rounded-xl border border-slate-200 dark:border-dark-border shadow-sm p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="flex items-center gap-4 min-w-0">
        <div className="flex-shrink-0 text-center">
          <div className="text-lg font-bold text-primary">{formatHora(cita.fechaHora)}</div>
          <Clock className="w-4 h-4 text-slate-400 dark:text-slate-500 mx-auto" />
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-slate-900 dark:text-white truncate">{cita.nombrePaciente}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{cita.tratamiento}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
        <EstadoBadge estado={cita.estado} />
        {puedeEditar && onEditar && (
          <Button variant="outline" size="sm" onClick={() => onEditar(cita)} title="Editar cita">
            <Pencil className="w-4 h-4" />
          </Button>
        )}
        {cita.estado === 0 && (
          <>
            <Button variant="secondary" size="sm" onClick={() => onConfirmar(cita.idCita)} title="Confirmar">
              <Check className="w-4 h-4" />
            </Button>
            <Button variant="danger" size="sm" onClick={() => onCancelar(cita.idCita)} title="Cancelar">
              <X className="w-4 h-4" />
            </Button>
          </>
        )}
        {cita.estado === 1 && (
          <>
            <Button variant="primary" size="sm" onClick={() => onAtender(cita.idCita)} title="Marcar atendida">
              <UserCheck className="w-4 h-4" />
            </Button>
            <Button variant="danger" size="sm" onClick={() => onCancelar(cita.idCita)} title="Cancelar">
              <X className="w-4 h-4" />
            </Button>
          </>
        )}
        {(cita.estado === 2 || cita.estado === 3) && onRevertir && (
          <Button variant="outline" size="sm" onClick={() => onRevertir(cita.idCita)} title="Revertir a pendiente">
            <Undo2 className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
