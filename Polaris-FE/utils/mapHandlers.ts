import { Region } from 'react-native-maps';
import { SharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { MutableRefObject } from 'react';
import MapView from 'react-native-maps';

export const handleCurrentLocation = (
  mapRef: MutableRefObject<MapView | null>,
  location: { latitude: number; longitude: number } | null
) => {
  if (!location) return;
  mapRef.current?.animateToRegion(
    {
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    },
    1000
  );
};

export const handleCampusSelect = (
  region: Region,
  mapRef: MutableRefObject<MapView | null>,
  setShowCampusOptions: (show: boolean) => void,
  toggleAnimation: SharedValue<number>,
  optionsAnimation: SharedValue<number>
) => {
  mapRef.current?.animateToRegion(region, 1000);
  setShowCampusOptions(false);
  toggleAnimation.value = withSpring(0);
  optionsAnimation.value = withTiming(0, { duration: 300 });
};

export const handleCampusToggle = (
  showCampusOptions: boolean,
  setShowCampusOptions: (show: boolean) => void,
  toggleAnimation: SharedValue<number>,
  optionsAnimation: SharedValue<number>
) => {
  setShowCampusOptions(!showCampusOptions);
  toggleAnimation.value = withSpring(showCampusOptions ? 0 : 1);
  optionsAnimation.value = withTiming(showCampusOptions ? 0 : 1, {
    duration: 300,
  });
};

export const getDistanceFromLatLonInMeters = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

export const calculateBearing = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const λ1 = (lon1 * Math.PI) / 180;
  const λ2 = (lon2 * Math.PI) / 180;

  const y = Math.sin(λ2 - λ1) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) -
    Math.sin(φ1) * Math.cos(φ2) * Math.cos(λ2 - λ1);
  const θ = Math.atan2(y, x);

  return ((θ * 180) / Math.PI + 360) % 360;
};
export const handleSearchSelect = (
  location: { latitude: number; longitude: number } | null,
  setRegion: (region: Region) => void
) => {
  if (!location) return;
  setRegion({
    latitude: location.latitude,
    longitude: location.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
};
