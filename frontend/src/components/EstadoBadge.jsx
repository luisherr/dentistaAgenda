import { ESTADOS } from '../utils/formatters';

const colorClasses = {
  warning: 'bg-warning-light text-amber-800',
  secondary: 'bg-secondary-light text-emerald-800',
  danger: 'bg-danger-light text-red-800',
  primary: 'bg-primary-light text-sky-800',
};

export default function EstadoBadge({ estado }) {
  const info = ESTADOS[estado] || ESTADOS[0];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses[info.color]}`}>
      {info.label}
    </span>
  );
}
