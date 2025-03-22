import { useState, useEffect } from 'react';
import { LatLng } from 'react-native-maps';
import { TravelMode, RouteData } from '@/constants/types';
import { getGoogleMapsRoute } from '@/services/googleMapsRoutes';
import { mapRef } from '@/utils/refs';

export const useGoogleMapsRoute = (
  origin: LatLng | null,
  destination: LatLng | null,
  travelMode: TravelMode,
  navigationState: string
) => {
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!origin || !destination || navigationState === 'default') {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data = await getGoogleMapsRoute(origin, destination, travelMode);
        setError(null);
        setRouteData(data);

        if (navigationState === 'planning') {
          mapRef.current?.fitToCoordinates(data.polyline, {
            edgePadding: {
              top: 120,
              right: 60,
              bottom: 120,
              left: 60,
            },
            animated: true,
          });
        }
      } catch (error) {
        if (error instanceof Error) {
          setError(error);
        } else {
          setError(new Error('An unknown error occurred.'));
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [destination, travelMode]);

  return { routeData, setRouteData, error, loading };
};
