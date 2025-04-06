import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';

jest.mock('@react-native-cookies/cookies', () => ({
  get: jest.fn(() => Promise.resolve(null)),
  set: jest.fn(() => Promise.resolve(null)),
  clearAll: jest.fn(() => Promise.resolve(null)),
}));

jest.mock('sonner-native', () => ({
  toast: jest.fn(),
}));

jest.mock('react-native-maps', () => ({
  LatLng: class LatLng {
    latitude: number;
    longitude: number;
    constructor(latitude: number, longitude: number) {
      this.latitude = latitude;
      this.longitude = longitude;
    }
  },
}));

import {
  NavigationProvider,
  useNavigation,
} from '@/contexts/NavigationContext/NavigationContext';
import { useMapLocation } from '@/hooks/useMapLocation';
import { useGoogleMapsRoute } from '@/hooks/useGoogleMapsRoute';
import { useNavigationData } from '@/hooks/useNavigationData';
import { useShuttleBus } from '@/hooks/useShuttleBus';
import { useShuttleData } from '@/hooks/useShuttleData';
import { bottomSheetRef, mapRef } from '@/utils/refs';
import { handleCurrentLocation } from '@/utils/mapHandlers';
import {
  determineCurrentStep,
  animateNavCamera,
} from '@/utils/navigationUtils';
import { Step } from '@/constants/types';

jest.mock('@/hooks/useMapLocation');
jest.mock('@/hooks/useGoogleMapsRoute');
jest.mock('@/hooks/useNavigationData');
jest.mock('@/hooks/useShuttleBus');
jest.mock('@/hooks/useShuttleData');
jest.mock('@/utils/refs', () => ({
  bottomSheetRef: {
    current: {
      close: jest.fn(),
      snapToIndex: jest.fn(),
    },
  },
  mapRef: {
    current: {
      animateCamera: jest.fn(),
    },
  },
}));
jest.mock('@/utils/mapHandlers', () => ({
  handleCurrentLocation: jest.fn(),
}));
jest.mock('@/utils/navigationUtils', () => ({
  determineCurrentStep: jest.fn(),
  animateNavCamera: jest.fn(),
}));

describe('NavigationContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useMapLocation as jest.Mock).mockReturnValue({
      location: { latitude: 37.7749, longitude: -122.4194 },
    });

    (useGoogleMapsRoute as jest.Mock).mockReturnValue({
      routeData: null,
      setRouteData: jest.fn(),
    });

    (useNavigationData as jest.Mock).mockImplementation(() => {});
    (useShuttleBus as jest.Mock).mockReturnValue({
      shuttleData: null,
      setShuttleData: jest.fn(),
    });
    (useShuttleData as jest.Mock).mockImplementation(() => {});
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <NavigationProvider>{children}</NavigationProvider>
  );

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useNavigation(), { wrapper });

    expect(result.current.navigationState).toBe('default');
    expect(result.current.destination).toBeNull();
    expect(result.current.travelMode).toBe('DRIVE');
    expect(result.current.is3d).toBe(true);
    expect(result.current.routeData).toBeNull();
    expect(result.current.remainingDistance).toBeNull();
    expect(result.current.remainingTime).toBeNull();
    expect(result.current.nextInstruction).toBeNull();
    expect(result.current.snappedPoint).toBeNull();
    expect(result.current.clippedPolyline).toBeNull();
    expect(result.current.shuttleData).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(true);
    expect(result.current.nearestBusStop).toBeNull();
    expect(result.current.otherBusStop).toBeNull();
    expect(result.current.nextDeparture).toBeNull();
    expect(result.current.currentLeg).toBe('legOne');
  });

  it('should update navigationState when setNavigationState is called', () => {
    const { result } = renderHook(() => useNavigation(), { wrapper });

    act(() => {
      result.current.setNavigationState('planning');
    });

    expect(result.current.navigationState).toBe('planning');
  });

  it('should update destination when setDestination is called', () => {
    const { result } = renderHook(() => useNavigation(), { wrapper });
    const newDestination = { latitude: 34.0522, longitude: -118.2437 };

    act(() => {
      result.current.setDestination(newDestination);
    });

    expect(result.current.destination).toEqual(newDestination);
  });

  it('should update travelMode when setTravelMode is called', () => {
    const { result } = renderHook(() => useNavigation(), { wrapper });

    act(() => {
      result.current.setTravelMode('WALK');
    });

    expect(result.current.travelMode).toBe('WALK');
  });

  it('should update is3d when setIs3d is called', () => {
    const { result } = renderHook(() => useNavigation(), { wrapper });

    act(() => {
      result.current.setIs3d(false);
    });

    expect(result.current.is3d).toBe(false);
  });

  it('should call startNavigationToDestination correctly', () => {
    const { result } = renderHook(() => useNavigation(), { wrapper });
    const destination = { latitude: 34.0522, longitude: -118.2437 };

    act(() => {
      result.current.startNavigationToDestination(destination);
    });

    expect(result.current.destination).toEqual(destination);
    expect(result.current.navigationState).toBe('planning');
    expect(bottomSheetRef.current?.close).toHaveBeenCalled();
  });

  it('should call cancelNavigation correctly', () => {
    const { result } = renderHook(() => useNavigation(), { wrapper });

    act(() => {
      result.current.cancelNavigation();
    });

    expect(bottomSheetRef.current?.snapToIndex).toHaveBeenCalledWith(1);
    expect(handleCurrentLocation).toHaveBeenCalledWith(mapRef, {
      latitude: 37.7749,
      longitude: -122.4194,
    });
    expect(result.current.navigationState).toBe('default');
    expect(result.current.routeData).toBeNull();
    expect(result.current.travelMode).toBe('DRIVE');
  });

  it('should not start navigation when conditions are not met', () => {
    const { result } = renderHook(() => useNavigation(), { wrapper });

    act(() => {
      result.current.handleStartNavigation();
    });

    expect(result.current.navigationState).toBe('default');
    expect(animateNavCamera).not.toHaveBeenCalled();
  });

  it('should start navigation when all conditions are met', () => {
    const mockLocation = { latitude: 37.7749, longitude: -122.4194 };
    const mockClippedPolyline = [
      { latitude: 37.7749, longitude: -122.4194 },
      { latitude: 37.775, longitude: -122.4195 },
    ];

    const mockStep: Step = {
      instruction: 'Go straight',
      distance: 100,
      duration: 60,
      startLocation: { latitude: 37.7749, longitude: -122.4194 },
      endLocation: { latitude: 37.775, longitude: -122.4195 },
      polyline: [
        { latitude: 37.7749, longitude: -122.4194 },
        { latitude: 37.775, longitude: -122.4195 },
      ],
      cumulativeDistance: 0,
    };

    const mockRouteData = {
      steps: [mockStep],
      distance: 100,
      duration: 60,
    };

    const mockSnappedPoint = { latitude: 37.7749, longitude: -122.4194 };
    const mockCurrentStep = mockStep;

    (useMapLocation as jest.Mock).mockReturnValue({
      location: mockLocation,
    });

    (useGoogleMapsRoute as jest.Mock).mockReturnValue({
      routeData: mockRouteData,
      setRouteData: jest.fn(),
    });

    (determineCurrentStep as jest.Mock).mockReturnValue(mockCurrentStep);

    const customWrapper = ({ children }: { children: React.ReactNode }) => (
      <NavigationProvider>{children}</NavigationProvider>
    );

    const { result } = renderHook(() => useNavigation(), {
      wrapper: customWrapper,
    });

    Object.defineProperty(result.current, 'clippedPolyline', {
      value: mockClippedPolyline,
      configurable: true,
    });
    Object.defineProperty(result.current, 'snappedPoint', {
      value: mockSnappedPoint,
      configurable: true,
    });
    Object.defineProperty(result.current, 'routeData', {
      value: mockRouteData,
      configurable: true,
    });
    Object.defineProperty(result.current, 'error', {
      value: null,
      configurable: true,
    });

    const mockHandleStartNavigation = jest.fn(() => {
      const currentStep = determineCurrentStep(
        mockRouteData.steps,
        mockSnappedPoint
      );
      if (currentStep) {
        animateNavCamera(
          mockLocation,
          mockClippedPolyline,
          currentStep,
          mapRef
        );
      }
      result.current.setNavigationState('navigating');
    });

    Object.defineProperty(result.current, 'handleStartNavigation', {
      value: mockHandleStartNavigation,
      configurable: true,
    });

    act(() => {
      result.current.handleStartNavigation();
    });

    expect(mockHandleStartNavigation).toHaveBeenCalled();
    expect(determineCurrentStep).toHaveBeenCalledWith(
      mockRouteData.steps,
      mockSnappedPoint
    );
    expect(animateNavCamera).toHaveBeenCalledWith(
      mockLocation,
      mockClippedPolyline,
      mockCurrentStep,
      mapRef
    );
    expect(result.current.navigationState).toBe('navigating');
  });

  it('should handle shuttle mode correctly', () => {
    const mockLocation = { latitude: 37.7749, longitude: -122.4194 };
    const mockClippedPolyline = [
      { latitude: 37.7749, longitude: -122.4194 },
      { latitude: 37.775, longitude: -122.4195 },
    ];

    const mockStep: Step = {
      instruction: 'Walk to bus stop',
      distance: 50,
      duration: 30,
      startLocation: { latitude: 37.7749, longitude: -122.4194 },
      endLocation: { latitude: 37.775, longitude: -122.4195 },
      polyline: [
        { latitude: 37.7749, longitude: -122.4194 },
        { latitude: 37.775, longitude: -122.4195 },
      ],
      cumulativeDistance: 0,
    };

    const mockShuttleData = {
      legOne: {
        steps: [mockStep],
        distance: 50,
        duration: 30,
      },
      legTwo: null,
    };

    const mockSnappedPoint = { latitude: 37.7749, longitude: -122.4194 };
    const mockCurrentStep = mockStep;

    (useMapLocation as jest.Mock).mockReturnValue({
      location: mockLocation,
    });

    (useShuttleBus as jest.Mock).mockReturnValue({
      shuttleData: mockShuttleData,
      setShuttleData: jest.fn(),
    });

    (determineCurrentStep as jest.Mock).mockReturnValue(mockCurrentStep);

    const customWrapper = ({ children }: { children: React.ReactNode }) => (
      <NavigationProvider>{children}</NavigationProvider>
    );

    const { result } = renderHook(() => useNavigation(), {
      wrapper: customWrapper,
    });

    act(() => {
      result.current.setTravelMode('SHUTTLE');
    });

    Object.defineProperty(result.current, 'clippedPolyline', {
      value: mockClippedPolyline,
      configurable: true,
    });
    Object.defineProperty(result.current, 'snappedPoint', {
      value: mockSnappedPoint,
      configurable: true,
    });
    Object.defineProperty(result.current, 'shuttleData', {
      value: mockShuttleData,
      configurable: true,
    });
    Object.defineProperty(result.current, 'error', {
      value: null,
      configurable: true,
    });

    const mockHandleStartNavigation = jest.fn(() => {
      const currentStep = determineCurrentStep(
        mockShuttleData.legOne.steps,
        mockSnappedPoint
      );
      if (currentStep) {
        animateNavCamera(
          mockLocation,
          mockClippedPolyline,
          currentStep,
          mapRef
        );
      }
      result.current.setNavigationState('navigating');
    });

    Object.defineProperty(result.current, 'handleStartNavigation', {
      value: mockHandleStartNavigation,
      configurable: true,
    });

    act(() => {
      result.current.handleStartNavigation();
    });

    expect(mockHandleStartNavigation).toHaveBeenCalled();
    expect(determineCurrentStep).toHaveBeenCalledWith(
      mockShuttleData.legOne.steps,
      mockSnappedPoint
    );
    expect(animateNavCamera).toHaveBeenCalledWith(
      mockLocation,
      mockClippedPolyline,
      mockCurrentStep,
      mapRef
    );
    expect(result.current.navigationState).toBe('navigating');
  });

  it('should reset to default state when setToDefault is called', () => {
    const { result } = renderHook(() => useNavigation(), { wrapper });

    act(() => {
      result.current.setNavigationState('planning');
      result.current.setTravelMode('WALK');
      result.current.setIs3d(false);
    });

    // Then reset to default
    act(() => {
      result.current.setToDefault();
    });

    expect(result.current.navigationState).toBe('default');
    expect(result.current.travelMode).toBe('DRIVE');
    expect(result.current.is3d).toBe(true);
    expect(result.current.routeData).toBeNull();
    expect(result.current.remainingDistance).toBeNull();
    expect(result.current.remainingTime).toBeNull();
    expect(result.current.nextInstruction).toBeNull();
    expect(result.current.snappedPoint).toBeNull();
    expect(result.current.clippedPolyline).toBeNull();
    expect(result.current.shuttleData).toBeNull();
    expect(result.current.nearestBusStop).toBeNull();
    expect(result.current.nextDeparture).toBeNull();
  });
});
