import { useAuth } from '../context/AuthContext';

export function useSubscription() {
  const { user } = useAuth();

  if (!user) return { enTrial: false, diasRestantes: 0, suscripcionActiva: false, accesoPermitido: false };

  const diasDesdeRegistro = user.fechaRegistro
    ? Math.floor((Date.now() - new Date(user.fechaRegistro).getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  const enTrial = diasDesdeRegistro <= 14;
  const diasRestantes = enTrial ? Math.max(0, 14 - diasDesdeRegistro) : 0;
  const suscripcionActiva = user.suscripcionActiva === true || user.suscripcionActiva === 'true';
  const accesoPermitido = enTrial || suscripcionActiva;

  return { enTrial, diasRestantes, suscripcionActiva, accesoPermitido };
}
