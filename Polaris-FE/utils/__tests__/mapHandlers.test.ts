import { MutableRefObject } from 'react';
import MapView from 'react-native-maps';
import { SharedValue } from 'react-native-reanimated';
import {
  handleCurrentLocation,
  handleCampusSelect,
  handleCampusToggle,
  getDistanceFromLatLonInMeters,
  calculateBearing,
} from '@/utils/mapHandlers';

const createMockSharedValue = (initial: number): SharedValue<number> => ({
  value: initial,
  get: () => initial,
  set: jest.fn(),
  addListener: jest.fn(),
  removeListener: jest.fn(),
  modify: jest.fn(),
});

jest.mock('react-native-reanimated', () => ({
  withSpring: (value: number) => value,
  withTiming: (value: number) => value,
}));

describe('mapHandlers', () => {
  describe('handleCurrentLocation', () => {
    it('does not call animateToRegion if location is null', () => {
      const mapRef = {
        current: { animateToRegion: jest.fn() },
      } as unknown as MutableRefObject<MapView | null>;
      handleCurrentLocation(mapRef, null);
      expect(mapRef.current?.animateToRegion).not.toHaveBeenCalled();
    });

    it('calls animateToRegion with correct region when location is provided', () => {
      const mapRef = {
        current: { animateToRegion: jest.fn() },
      } as unknown as MutableRefObject<MapView | null>;
      const location = { latitude: 37.7749, longitude: -122.4194 };
      handleCurrentLocation(mapRef, location);
      expect(mapRef.current?.animateToRegion).toHaveBeenCalledWith(
        {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000
      );
    });
  });

  describe('handleCampusSelect', () => {
    it('animates to the given region, hides campus options, and updates animation values', () => {
      const region = {
        latitude: 40.7128,
        longitude: -74.006,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
      const mapRef = {
        current: { animateToRegion: jest.fn() },
      } as unknown as MutableRefObject<MapView | null>;
      const setShowCampusOptions = jest.fn();
      const toggleAnimation = createMockSharedValue(-1);
      const optionsAnimation = createMockSharedValue(-1);

      handleCampusSelect(
        region,
        mapRef,
        setShowCampusOptions,
        toggleAnimation,
        optionsAnimation
      );

      expect(mapRef.current?.animateToRegion).toHaveBeenCalledWith(
        region,
        1000
      );
      expect(setShowCampusOptions).toHaveBeenCalledWith(false);
      expect(toggleAnimation.value).toBe(0);
      expect(optionsAnimation.value).toBe(0);
    });
  });

  describe('handleCampusToggle', () => {
    it('toggles from false to true', () => {
      const setShowCampusOptions = jest.fn();
      const toggleAnimation = createMockSharedValue(-1);
      const optionsAnimation = createMockSharedValue(-1);

      handleCampusToggle(
        false,
        setShowCampusOptions,
        toggleAnimation,
        optionsAnimation
      );

      expect(setShowCampusOptions).toHaveBeenCalledWith(true);
      expect(toggleAnimation.value).toBe(1);
      expect(optionsAnimation.value).toBe(1);
    });

    it('toggles from true to false', () => {
      const setShowCampusOptions = jest.fn();
      const toggleAnimation = createMockSharedValue(-1);
      const optionsAnimation = createMockSharedValue(-1);

      handleCampusToggle(
        true,
        setShowCampusOptions,
        toggleAnimation,
        optionsAnimation
      );

      expect(setShowCampusOptions).toHaveBeenCalledWith(false);
      expect(toggleAnimation.value).toBe(0);
      expect(optionsAnimation.value).toBe(0);
    });
  });

  describe('getDistanceFromLatLonInMeters', () => {
    it('calculates the correct distance for known coordinates', () => {
      const distance = getDistanceFromLatLonInMeters(0, 0, 0, 1);
      expect(distance).toBeCloseTo(111195, -2);
    });

    it('returns 0 when both coordinates are the same', () => {
      const distance = getDistanceFromLatLonInMeters(1, 1, 1, 1);
      expect(distance).toBe(0);
    });
  });

  describe('calculateBearing', () => {
    it('returns 90° when moving east', () => {
      const bearing = calculateBearing(0, 0, 0, 1);
      expect(bearing).toBeCloseTo(90, 0);
    });

    it('returns 0° when moving north', () => {
      const bearing = calculateBearing(0, 0, 1, 0);
      expect(bearing).toBeCloseTo(0, 0);
    });
  });
});
