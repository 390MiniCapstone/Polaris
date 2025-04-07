import Constants from 'expo-constants';
import polyline from '@mapbox/polyline';
import { LatLng } from 'react-native-maps';
import { toast } from 'sonner-native';
import { TravelMode, RouteData, Step, stepType } from '@/constants/types';

const GOOGLE_MAPS_API_KEY = Constants.expoConfig?.extra
  ?.googleMapsApiKey as string;

export const getGoogleMapsRoute = async (
  origin: { latitude: number; longitude: number },
  destination: { latitude: number; longitude: number },
  travelMode: TravelMode
): Promise<RouteData> => {
  try {
    const url = 'https://routes.googleapis.com/directions/v2:computeRoutes';

    const body = {
      origin: {
        location: {
          latLng: {
            latitude: origin.latitude,
            longitude: origin.longitude,
          },
        },
      },
      destination: {
        location: {
          latLng: {
            latitude: destination.latitude,
            longitude: destination.longitude,
          },
        },
      },
      travelMode: travelMode,
      ...(travelMode === 'DRIVE' && { routingPreference: 'TRAFFIC_AWARE' }),
      computeAlternativeRoutes: false,
      languageCode: 'en-CA',
      units: 'METRIC',
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_MAPS_API_KEY,
        'X-Goog-FieldMask': '*',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!data.routes || data.routes.length === 0) {
      throw new Error('No routes found in the response.');
    }

    const route = data.routes[0];
    const leg = route.legs[0];

    const encodedPolyline =
      route.polyline?.encodedPolyline ?? leg.polyline?.encodedPolyline;
    if (!encodedPolyline) {
      throw new Error('No polyline provided in route or leg.');
    }
    const fullPolyline: LatLng[] = polyline
      .decode(encodedPolyline)
      .map(([lat, lng]) => ({ latitude: lat, longitude: lng }));

    const totalDistance = route.distanceMeters;
    const totalDuration = route.duration.replace('s', '');

    let cumulativeDistance = 0;
    const steps: Step[] = leg.steps.map((step: stepType) => {
      cumulativeDistance += step.distanceMeters;
      const decodedStepPolyline: LatLng[] = polyline
        .decode(step.polyline.encodedPolyline)
        .map(([lat, lng]) => ({ latitude: lat, longitude: lng }));
      const stepDuration = step.staticDuration.replace('s', '');

      const instruction = step.navigationInstruction?.instructions ?? '';

      return {
        startLocation: {
          latitude: step.startLocation.latLng.latitude,
          longitude: step.startLocation.latLng.longitude,
        },
        endLocation: {
          latitude: step.endLocation.latLng.latitude,
          longitude: step.endLocation.latLng.longitude,
        },
        distance: step.distanceMeters,
        duration: stepDuration,
        instruction,
        polyline: decodedStepPolyline,
        cumulativeDistance,
      };
    });

    return {
      polyline: fullPolyline,
      totalDistance,
      totalDuration,
      steps,
    };
  } catch (error) {
    toast.error('Directions Not Available', {
      description: `${error instanceof Error ? error.message : 'Unknown error'}`,
      duration: 2000,
    });
    throw error;
  }
};
