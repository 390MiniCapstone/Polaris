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

export const handleLocation = (
  region: Region,
  mapRef: MutableRefObject<MapView | null>,
  toggleAnimation: SharedValue<number>,
  optionsAnimation: SharedValue<number>
) => {
  mapRef.current?.animateToRegion(region, 1000);
  toggleAnimation.value = withSpring(0);
  optionsAnimation.value = withTiming(0, { duration: 300 });
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
