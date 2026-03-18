import { useAuth } from '../context/AuthContext';

export function useSubscription() {
  const { user } = useAuth();

  if (!user) return { suscripcionActiva: false };

  const suscripcionActiva = user.suscripcionActiva === true || user.suscripcionActiva === 'true';

  return { suscripcionActiva };
}
