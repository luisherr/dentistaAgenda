import { useState, useEffect } from 'react';
import { useSearchParams, Navigate } from 'react-router-dom';
import { Crown, Check } from 'lucide-react';
import Layout from '../components/Layout';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../hooks/useSubscription';
import api from '../api/axios';
import toast from 'react-hot-toast';

const planes = [
  {
    nombre: 'Basico',
    descripcion: 'Para dentistas independientes',
    precio: '499',
    beneficios: [
      '1 dentista',
      'Hasta 100 pacientes',
      'Chatbot WhatsApp',
      'Recordatorios automaticos',
    ],
    popular: false,
    accion: 'Empezar gratis',
  },
  {
    nombre: 'Profesional',
    descripcion: 'Para clinicas en crecimiento',
    precio: '899',
    beneficios: [
      'Hasta 3 dentistas',
      'Pacientes ilimitados',
      'Todo del plan Basico',
      'Reportes y estadisticas',
      'Soporte prioritario',
    ],
    popular: true,
    accion: 'Empezar gratis',
  },
  {
    nombre: 'Clinica',
    descripcion: 'Para clinicas grandes',
    precio: '1,499',
    beneficios: [
      'Dentistas ilimitados',
      'Todo del plan Profesional',
      'Multiples sucursales',
      'API personalizada',
      'Onboarding dedicado',
    ],
    popular: false,
    accion: 'Contactar ventas',
  },
];

export default function Suscripcion() {
  const { user, actualizarSuscripcion } = useAuth();
  const { suscripcionActiva } = useSubscription();
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get('suscripcion') === 'exitosa') {
      toast.success('Suscripcion activada exitosamente');
      api.get('/suscripciones/estado').then(({ data }) => {
        actualizarSuscripcion({
          suscripcionActiva: data.suscripcionActiva,
          enTrial: data.enTrial,
          diasRestantesTrial: data.diasRestantesTrial,
        });
      }).catch(() => {});
    }
  }, []);

  if (!user) return <Navigate to="/login" replace />;

  const handleSuscribirse = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/suscripciones/crear-checkout');
      window.location.href = data.url;
    } catch {
      toast.error('Error al iniciar el proceso de pago');
      setLoading(false);
    }
  };

  return (
    <Layout title="Suscripcion">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Crown className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {suscripcionActiva ? 'Tu suscripcion esta activa' : 'Elige el plan ideal para tu consultorio'}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            {suscripcionActiva
              ? 'Tienes acceso completo a todas las funcionalidades.'
              : '14 dias de prueba gratis en todos los planes. Cancela cuando quieras.'}
          </p>
        </div>

        {!suscripcionActiva && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {planes.map((plan) => (
              <div
                key={plan.nombre}
                className={`relative bg-white dark:bg-dark-card rounded-xl border shadow-sm overflow-hidden flex flex-col ${
                  plan.popular
                    ? 'border-primary ring-2 ring-primary/20'
                    : 'border-slate-200 dark:border-dark-border'
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-primary text-white text-xs font-bold text-center py-1 uppercase tracking-wider">
                    Mas popular
                  </div>
                )}

                <div className={`p-6 text-center ${plan.popular ? 'pt-10' : ''}`}>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{plan.nombre}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{plan.descripcion}</p>
                  <div className="flex items-baseline justify-center gap-1 mt-4">
                    <span className="text-sm text-slate-500 dark:text-slate-400">$</span>
                    <span className="text-4xl font-bold text-slate-900 dark:text-white">{plan.precio}</span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">MXN / mes</p>
                </div>

                <div className="px-6 pb-6 flex-1 flex flex-col">
                  <ul className="space-y-3 mb-6 flex-1">
                    {plan.beneficios.map((b) => (
                      <li key={b} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-700 dark:text-slate-300">{b}</span>
                      </li>
                    ))}
                  </ul>

                  {plan.nombre === 'Clinica' ? (
                    <Button variant="outline" className="w-full" onClick={() => toast('Contacta a ventas@dentassist.com')}>
                      {plan.accion}
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      variant={plan.popular ? 'primary' : 'outline'}
                      loading={loading}
                      onClick={handleSuscribirse}
                    >
                      {plan.accion}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {!suscripcionActiva && (
          <p className="text-xs text-center text-slate-400 dark:text-slate-500 mt-6">
            Pago seguro procesado por Stripe. Cancela cuando quieras.
          </p>
        )}

        {searchParams.get('cancelado') === 'true' && (
          <div className="mt-6 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-center">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              El pago fue cancelado. Puedes intentarlo de nuevo cuando quieras.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
