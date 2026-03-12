import { format, parseISO, isToday, isTomorrow } from 'date-fns';
import { es } from 'date-fns/locale';

export const ESTADOS = {
  0: { label: 'Pendiente', color: 'warning' },
  1: { label: 'Confirmada', color: 'secondary' },
  2: { label: 'Cancelada', color: 'danger' },
  3: { label: 'Atendida', color: 'primary' },
};

export function formatFecha(fechaStr) {
  const fecha = parseISO(fechaStr);
  if (isToday(fecha)) return 'Hoy';
  if (isTomorrow(fecha)) return 'Mañana';
  return format(fecha, "d 'de' MMMM, yyyy", { locale: es });
}

export function formatHora(fechaStr) {
  return format(parseISO(fechaStr), 'HH:mm');
}

export function formatFechaCompleta(fechaStr) {
  return format(parseISO(fechaStr), "EEEE d 'de' MMMM, yyyy", { locale: es });
}

export function formatTelefono(telefono) {
  if (!telefono) return '—';
  return telefono;
}

export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Buenos días';
  if (hour < 18) return 'Buenas tardes';
  return 'Buenas noches';
}

export function formatFechaInput(date) {
  return format(date, 'yyyy-MM-dd');
}
