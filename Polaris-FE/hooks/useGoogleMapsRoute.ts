import { useState, useEffect } from 'react';
import { LatLng } from 'react-native-maps';
import { TravelMode, RouteData } from '@/constants/types';
import { getGoogleMapsRoute } from '@/services/googleMapsRoutes';
import { mapRef } from '@/utils/refs';

export const useGoogleMapsRoute = (
  origin: LatLng | null,
  destination: LatLng,
  travelMode: TravelMode,
  navigationState: string
) => {
  const [routeData, setRouteData] = useState<RouteData | null>(null);

  useEffect(() => {
    (async () => {
      if (!origin) return;
      if (navigationState === 'default') return;
      try {
        const data = await getGoogleMapsRoute(origin, destination, travelMode);
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
        console.error('Failed to fetch route data:', error);
      }
    })();
  }, [destination, travelMode]);

  return { routeData, setRouteData };
};
