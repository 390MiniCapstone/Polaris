import { LatLng } from 'react-native-maps';

export type LocationPermissionStatus =
  | 'granted'
  | 'denied'
  | 'requesting'
  | 'error';

export type NavigationState = 'default' | 'planning' | 'navigating';

export type TravelMode = 'DRIVE' | 'WALK' | 'TRANSIT' | 'BICYCLE' | 'SHUTTLE';

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

export type BusLeg = {
  busData: RouteData;
  busPoints: LatLng[];
} | null;

export type ShuttleLeg = 'legOne' | 'legTwo' | 'legThree' | null;

export type ShuttleData = {
  legOne: RouteData;
  legTwo: BusLeg;
  legThree: RouteData;
} | null;

export type ShuttleBusResponse = {
  d: {
    Points: {
      ID: string;
      Latitude: number;
      Longitude: number;
    }[];
  };
};

export type ShuttleBusStop = {
  name: string;
  shortName: string;
  location: LatLng;
  schedule: {
    MonThu: string[];
    Fri: string[];
  };
};
