import { useState, useEffect } from 'react';
import { useSearchParams, Navigate } from 'react-router-dom';
import { Crown, Check, CalendarDays, Bot, Mail, AlertTriangle } from 'lucide-react';
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
    accion: 'Suscribirme',
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
    accion: 'Suscribirme',
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
          fechaFinSuscripcion: data.fechaFinSuscripcion,
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

  const fechaFin = user.fechaFinSuscripcion ? new Date(user.fechaFinSuscripcion) : null;

  return (
    <Layout title="Suscripcion">
      <div className="max-w-5xl mx-auto">
        {/* Alerta de pago cancelado */}
        {searchParams.get('cancelado') === 'true' && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-red-800 dark:text-red-200">
                El pago no se completo
              </p>
              <p className="text-sm text-red-600 dark:text-red-300 mt-1">
                No se realizo ningun cargo. Puedes intentarlo de nuevo cuando quieras.
              </p>
            </div>
          </div>
        )}

        {/* VISTA: Suscripcion activa */}
        {suscripcionActiva ? (
          <div className="space-y-6">
            {/* Estado de suscripcion */}
            <div className="bg-white dark:bg-dark-card rounded-xl border border-slate-200 dark:border-dark-border shadow-sm p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <Crown className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Suscripcion activa</h2>
                  <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">Tu cuenta tiene acceso completo a todas las funcionalidades</p>
                </div>
              </div>

              {fechaFin && (
                <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-50 dark:bg-neutral-800/50">
                  <CalendarDays className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Proxima fecha de renovacion</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {fechaFin.toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Chatbot con IA */}
            <div className="bg-white dark:bg-dark-card rounded-xl border border-slate-200 dark:border-dark-border shadow-sm p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Chatbot con Inteligencia Artificial</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Asistente virtual para tu consultorio via WhatsApp</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  Tu plan incluye acceso al chatbot con IA que puede atender a tus pacientes por WhatsApp de forma automatica:
                </p>
                <ul className="space-y-2">
                  {[
                    'Responde preguntas frecuentes de tus pacientes 24/7',
                    'Agenda citas automaticamente desde WhatsApp',
                    'Envia recordatorios y confirmaciones de citas',
                    'Personalizado con la informacion de tu consultorio',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-slate-600 dark:text-slate-400">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-lg bg-primary/5 dark:bg-primary/10 border border-primary/20">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      Contactanos para implementar el chatbot en tu consultorio
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      Nuestro equipo configurara el bot personalizado con la informacion de tu consultorio, horarios y servicios.
                    </p>
                    <a
                      href="mailto:soporte@dentassist.com?subject=Implementacion%20de%20Chatbot%20IA"
                      className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      Solicitar implementacion
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* VISTA: Sin suscripcion — mostrar planes */
          <>
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Crown className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Elige el plan ideal para tu consultorio
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mt-2">
                Potencia tu consultorio con herramientas inteligentes. Cancela cuando quieras.
              </p>
            </div>

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

            <p className="text-xs text-center text-slate-400 dark:text-slate-500 mt-6">
              Pago seguro procesado por Stripe. Cancela cuando quieras.
            </p>
          </>
        )}
      </div>
    </Layout>
  );
}
