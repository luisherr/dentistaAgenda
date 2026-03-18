import { useAuth } from '../context/AuthContext';

export default function Header({ title }) {
  const { user } = useAuth();

  return (
    <header className="bg-white dark:bg-dark-card border-b border-slate-200 dark:border-dark-border pl-14 pr-4 lg:px-8 py-4 flex items-center justify-between">
      <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{title}</h2>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-primary-light dark:bg-neutral-800 flex items-center justify-center">
          <span className="text-sm font-semibold text-primary">
            {user?.nombre?.charAt(0)?.toUpperCase() || 'D'}
          </span>
        </div>
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 hidden sm:inline">{user?.nombre}</span>
      </div>
    </header>
  );
}
