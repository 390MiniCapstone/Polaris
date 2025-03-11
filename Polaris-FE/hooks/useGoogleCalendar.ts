import { useQuery } from '@tanstack/react-query';
import { fetchCalendars } from '@/services/googleCalendarService';
import { GoogleCalendar } from '@/constants/GoogleCalendar';
import { useGoogleAuth } from '@/contexts/AuthContext/AuthContext';

export function useGoogleCalendars() {
  const { accessToken } = useGoogleAuth();
  return useQuery<GoogleCalendar[], Error>({
    queryKey: ['googleCalendars', accessToken],
    queryFn: () => fetchCalendars(accessToken!),
    enabled: !!accessToken,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
}
