export default function Input({ label, error, className = '', ...props }) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          {label}
        </label>
      )}
      <input
        className={`w-full px-3 py-2 border rounded-lg text-sm transition-colors
          bg-white dark:bg-dark-card text-slate-900 dark:text-white
          focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
          ${error ? 'border-danger' : 'border-slate-300 dark:border-dark-border'}
          placeholder:text-slate-400 dark:placeholder:text-slate-500`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}
