import { ESTADOS } from '../utils/formatters';

const colorClasses = {
  warning: 'bg-warning-light text-orange-800 dark:bg-orange-900/20 dark:text-orange-300',
  secondary: 'bg-secondary-light text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
  danger: 'bg-danger-light text-red-800 dark:bg-red-900/20 dark:text-red-300',
  primary: 'bg-primary-light text-emerald-900 dark:bg-emerald-900/20 dark:text-emerald-300',
};

export default function EstadoBadge({ estado }) {
  const info = ESTADOS[estado] || ESTADOS[0];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses[info.color]}`}>
      {info.label}
    </span>
  );
}
