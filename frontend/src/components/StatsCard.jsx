const bgColors = {
  primary: 'bg-primary-light dark:bg-primary/20',
  secondary: 'bg-secondary-light dark:bg-secondary/20',
  warning: 'bg-warning-light dark:bg-warning/20',
  danger: 'bg-danger-light dark:bg-danger/20',
};

const iconColors = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  warning: 'text-warning',
  danger: 'text-danger',
};

export default function StatsCard({ icon: Icon, label, value, color = 'primary' }) {
  return (
    <div className="bg-white dark:bg-dark-card rounded-xl border border-slate-200 dark:border-dark-border shadow-sm p-5">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg ${bgColors[color]}`}>
          <Icon className={`w-6 h-6 ${iconColors[color]}`} />
        </div>
        <div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
        </div>
      </div>
    </div>
  );
}
