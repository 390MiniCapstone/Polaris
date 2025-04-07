import { LatLng } from 'react-native-maps';

export type LocationPermissionStatus =
  | 'granted'
  | 'denied'
  | 'requesting'
  | 'error';

export type NavigationState = 'default' | 'planning' | 'navigating';

export type TravelMode = 'DRIVE' | 'WALK' | 'TRANSIT' | 'BICYCLE';

export type Step = {
  startLocation: LatLng;
  endLocation: LatLng;
  distance: number;
  duration: number;
  instruction: string;
  polyline: LatLng[];
  cumulativeDistance: number;
};

export type RouteData = {
  polyline: LatLng[];
  totalDistance: number;
  totalDuration: number;
  steps: Step[];
};

export type stepType = {
  distanceMeters: number;
  polyline: { encodedPolyline: string };
  staticDuration: string;
  navigationInstruction?: { instructions: string };
  startLocation: { latLng: { latitude: number; longitude: number } };
  endLocation: { latLng: { latitude: number; longitude: number } };
};
