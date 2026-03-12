import { CalendarX } from 'lucide-react';
import Button from './Button';

export default function EmptyState({ message = 'No hay datos', actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <CalendarX className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-4" />
      <p className="text-slate-500 dark:text-slate-400 mb-4">{message}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  );
}
