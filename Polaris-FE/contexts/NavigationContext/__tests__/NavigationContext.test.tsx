import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import {
  NavigationProvider,
  useNavigation,
} from '@/contexts/NavigationContext/NavigationContext';
import { useMapLocation } from '@/hooks/useMapLocation';
import { useGoogleMapsRoute } from '@/hooks/useGoogleMapsRoute';
import { bottomSheetRef, mapRef } from '@/utils/refs';
import { handleCurrentLocation } from '@/utils/mapHandlers';
import {
  clipPolylineFromSnappedPoint,
  computeRemainingDistance,
  computeRemainingTime,
  determineCurrentStep,
  determineNextInstruction,
  startNavigation,
} from '@/utils/navigationUtils';
import { LatLng } from 'react-native-maps';
import { RouteData, Step } from '@/constants/types';
import nearestPointOnLine from '@turf/nearest-point-on-line';

jest.mock('@/hooks/useMapLocation');
jest.mock('@/hooks/useGoogleMapsRoute');
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
  clipPolylineFromSnappedPoint: jest.fn(),
  computeRemainingDistance: jest.fn(),
  computeRemainingTime: jest.fn(),
  determineCurrentStep: jest.fn(),
  determineNextInstruction: jest.fn(),
  startNavigation: jest.fn(),
}));
jest.mock('@turf/helpers', () => ({
  lineString: jest.fn(() => ({})),
  point: jest.fn(() => ({})),
}));
jest.mock('@turf/nearest-point-on-line', () => jest.fn());

describe('NavigationContext', () => {
  const mockLocation: LatLng = { latitude: 37.7749, longitude: -122.4194 };
  const mockDestination: LatLng = { latitude: 34.0522, longitude: -118.2437 };
  const mockSnappedPoint: LatLng = { latitude: 37.7748, longitude: -122.4193 };
  const mockClippedPolyline: LatLng[] = [
    mockSnappedPoint,
    { latitude: 36.0, longitude: -120.0 },
    mockDestination,
  ];

  const mockSteps: Step[] = [
    {
      startLocation: mockLocation,
      endLocation: { latitude: 36.0, longitude: -120.0 },
      distance: 250000,
      duration: 9000,
      instruction: 'Head south on I-5',
      polyline: [mockLocation, { latitude: 36.0, longitude: -120.0 }],
      cumulativeDistance: 250000,
    },
    {
      startLocation: { latitude: 36.0, longitude: -120.0 },
      endLocation: mockDestination,
      distance: 250000,
      duration: 9000,
      instruction: 'Continue on I-5',
      polyline: [{ latitude: 36.0, longitude: -120.0 }, mockDestination],
      cumulativeDistance: 500000,
    },
  ];

  const mockRouteData: RouteData = {
    polyline: [
      mockLocation,
      { latitude: 36.0, longitude: -120.0 },
      mockDestination,
    ],
    totalDistance: 500000,
    totalDuration: 18000,
    steps: mockSteps,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (useMapLocation as jest.Mock).mockReturnValue({
      location: mockLocation,
    });

    (useGoogleMapsRoute as jest.Mock).mockReturnValue({
      routeData: mockRouteData,
    });

    (nearestPointOnLine as jest.Mock).mockReturnValue({
      geometry: {
        coordinates: [mockSnappedPoint.longitude, mockSnappedPoint.latitude],
      },
    });

    (clipPolylineFromSnappedPoint as jest.Mock).mockReturnValue(
      mockClippedPolyline
    );
    (computeRemainingDistance as jest.Mock).mockReturnValue(500000);
    (computeRemainingTime as jest.Mock).mockReturnValue(18000);
    (determineNextInstruction as jest.Mock).mockReturnValue(
      'Head south on I-5'
    );
    (determineCurrentStep as jest.Mock).mockReturnValue(mockSteps[0]);
  });

  const renderNavigationHook = () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <NavigationProvider>{children}</NavigationProvider>
    );
    return renderHook(() => useNavigation(), { wrapper });
  };

  test('should initialize with default values', () => {
    const { result } = renderNavigationHook();

    expect(result.current.navigationState).toBe('default');
    expect(result.current.destination).toEqual({ latitude: 0, longitude: 0 });
    expect(result.current.travelMode).toBe('DRIVE');
    expect(result.current.is3d).toBe(true);
    expect(result.current.routeData).toEqual(mockRouteData);
  });

  test('should update navigation state', () => {
    const { result } = renderNavigationHook();

    act(() => {
      result.current.setNavigationState('planning');
    });

    expect(result.current.navigationState).toBe('planning');
  });

  test('should update destination', () => {
    const { result } = renderNavigationHook();

    act(() => {
      result.current.setDestination(mockDestination);
    });

    expect(result.current.destination).toEqual(mockDestination);
  });

  test('should update travel mode', () => {
    const { result } = renderNavigationHook();

    act(() => {
      result.current.setTravelMode('WALK');
    });

    expect(result.current.travelMode).toBe('WALK');
  });

  test('should update 3D mode', () => {
    const { result } = renderNavigationHook();

    act(() => {
      result.current.setIs3d(false);
    });

    expect(result.current.is3d).toBe(false);
  });

  test('should calculate navigation data when location and route data are available', () => {
    renderNavigationHook();

    expect(nearestPointOnLine).toHaveBeenCalled();
    expect(computeRemainingTime).toHaveBeenCalledWith(
      mockRouteData.steps,
      mockSnappedPoint,
      mockRouteData.totalDuration
    );
    expect(computeRemainingDistance).toHaveBeenCalledWith(
      mockRouteData.steps,
      mockSnappedPoint,
      mockRouteData.totalDistance
    );
    expect(determineNextInstruction).toHaveBeenCalledWith(
      mockRouteData.steps,
      mockSnappedPoint,
      'DRIVE'
    );
    expect(clipPolylineFromSnappedPoint).toHaveBeenCalledWith(
      mockRouteData.polyline,
      mockSnappedPoint
    );
  });

  test('should start navigation when handleStartNavigation is called', () => {
    const { result } = renderNavigationHook();

    act(() => {
      result.current.handleStartNavigation();
    });

    expect(result.current.navigationState).toBe('navigating');
    expect(startNavigation).toHaveBeenCalledWith(
      mockLocation,
      mockClippedPolyline,
      mockSteps[0],
      mapRef
    );
  });

  test('should not start navigation when required data is missing', () => {
    (useGoogleMapsRoute as jest.Mock).mockReturnValue({
      routeData: null,
    });

    const { result } = renderNavigationHook();

    act(() => {
      result.current.handleStartNavigation();
    });

    expect(result.current.navigationState).toBe('default');
    expect(startNavigation).not.toHaveBeenCalled();
  });

  test('should start navigation to a destination', () => {
    const { result } = renderNavigationHook();

    act(() => {
      result.current.startNavigationToDestination(mockDestination);
    });

    expect(result.current.destination).toEqual(mockDestination);
    expect(result.current.navigationState).toBe('planning');
    expect(bottomSheetRef.current?.close).toHaveBeenCalled();
  });

  test('should cancel navigation', () => {
    const { result } = renderNavigationHook();

    act(() => {
      result.current.setNavigationState('navigating');
    });

    act(() => {
      result.current.cancelNavigation();
    });

    expect(result.current.navigationState).toBe('default');
    expect(bottomSheetRef.current?.snapToIndex).toHaveBeenCalledWith(1);
    expect(handleCurrentLocation).toHaveBeenCalledWith(mapRef, mockLocation);
  });

  test('should automatically cancel navigation when close to destination', async () => {
    (computeRemainingDistance as jest.Mock).mockReturnValue(5);

    const { result } = renderNavigationHook();

    act(() => {
      result.current.setNavigationState('navigating');
    });

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.navigationState).toBe('default');
  });

  test('should start 3D navigation when in navigating state', async () => {
    const { result } = renderNavigationHook();

    act(() => {
      result.current.setNavigationState('navigating');
    });

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(startNavigation).toHaveBeenCalledWith(
      mockLocation,
      mockClippedPolyline,
      mockSteps[0],
      mapRef
    );
  });

  test('should not start 3D navigation when 3D is disabled', async () => {
    const { result } = renderNavigationHook();

    act(() => {
      result.current.setIs3d(false);
    });

    act(() => {
      result.current.setNavigationState('navigating');
    });

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(startNavigation).not.toHaveBeenCalled();
  });

  test('should throw error when useNavigation is used outside provider', () => {
    const { result } = renderHook(() => useNavigation());

    expect(result.error).toEqual(
      Error('useNavigation must be used within a NavigationProvider')
    );
  });
});
