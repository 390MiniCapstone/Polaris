import { renderHook } from '@testing-library/react-hooks';
import { useNavigationData } from '@/hooks/useNavigationData';
import { LatLng } from 'react-native-maps';
import { lineString, point } from '@turf/helpers';
import nearestPointOnLine from '@turf/nearest-point-on-line';
import {
  computeRemainingTime,
  computeRemainingDistance,
  determineNextInstruction,
  clipPolylineFromSnappedPoint,
} from '@/utils/navigationUtils';
import { RouteData, Step } from '@/constants/types';

jest.mock('@turf/helpers', () => ({
  lineString: jest.fn(),
  point: jest.fn(),
}));

jest.mock('@turf/nearest-point-on-line', () => jest.fn());

jest.mock('@/utils/navigationUtils', () => ({
  computeRemainingTime: jest.fn(),
  computeRemainingDistance: jest.fn(),
  determineNextInstruction: jest.fn(),
  clipPolylineFromSnappedPoint: jest.fn(),
}));

describe('useNavigationData', () => {
  const mockLocation: LatLng = { latitude: 37.7749, longitude: -122.4194 };

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

  const mockRouteData: RouteData = {
    steps: [mockStep],
    polyline: [
      { latitude: 37.7749, longitude: -122.4194 },
      { latitude: 37.775, longitude: -122.4195 },
    ],
    totalDistance: 100,
    totalDuration: 60,
  };

  const mockSnappedPoint: LatLng = { latitude: 37.7749, longitude: -122.4194 };
  const mockClippedPolyline: LatLng[] = [
    { latitude: 37.7749, longitude: -122.4194 },
    { latitude: 37.775, longitude: -122.4195 },
  ];

  // Mock function implementations
  const mockSetSnappedPoint = jest.fn();
  const mockSetRemainingTime = jest.fn();
  const mockSetRemainingDistance = jest.fn();
  const mockSetNextInstruction = jest.fn();
  const mockSetClippedPolyline = jest.fn();
  const mockCancelNavigation = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (lineString as jest.Mock).mockReturnValue('mockTurfLine');
    (point as jest.Mock).mockReturnValue('mockUserPoint');
    (nearestPointOnLine as jest.Mock).mockReturnValue({
      geometry: {
        coordinates: [-122.4194, 37.7749],
      },
    });
    (computeRemainingTime as jest.Mock).mockReturnValue(50);
    (computeRemainingDistance as jest.Mock).mockReturnValue(90);
    (determineNextInstruction as jest.Mock).mockReturnValue(
      'Continue straight'
    );
    (clipPolylineFromSnappedPoint as jest.Mock).mockReturnValue(
      mockClippedPolyline
    );
  });

  it('should not update navigation data when location is null', () => {
    renderHook(() =>
      useNavigationData(
        null,
        mockRouteData,
        'navigating',
        'DRIVE',
        mockSetSnappedPoint,
        mockSetRemainingTime,
        null,
        mockSetRemainingDistance,
        mockSetNextInstruction,
        mockSetClippedPolyline,
        mockCancelNavigation
      )
    );

    expect(lineString).not.toHaveBeenCalled();
    expect(mockSetSnappedPoint).not.toHaveBeenCalled();
  });

  it('should not update navigation data when routeData is null', () => {
    renderHook(() =>
      useNavigationData(
        mockLocation,
        null,
        'navigating',
        'DRIVE',
        mockSetSnappedPoint,
        mockSetRemainingTime,
        null,
        mockSetRemainingDistance,
        mockSetNextInstruction,
        mockSetClippedPolyline,
        mockCancelNavigation
      )
    );

    expect(lineString).not.toHaveBeenCalled();
    expect(mockSetSnappedPoint).not.toHaveBeenCalled();
  });

  it('should not update navigation data when travelMode is SHUTTLE', () => {
    renderHook(() =>
      useNavigationData(
        mockLocation,
        mockRouteData,
        'navigating',
        'SHUTTLE',
        mockSetSnappedPoint,
        mockSetRemainingTime,
        null,
        mockSetRemainingDistance,
        mockSetNextInstruction,
        mockSetClippedPolyline,
        mockCancelNavigation
      )
    );

    expect(lineString).not.toHaveBeenCalled();
    expect(mockSetSnappedPoint).not.toHaveBeenCalled();
  });

  it('should update navigation data when all conditions are met', () => {
    renderHook(() =>
      useNavigationData(
        mockLocation,
        mockRouteData,
        'navigating',
        'DRIVE',
        mockSetSnappedPoint,
        mockSetRemainingTime,
        null,
        mockSetRemainingDistance,
        mockSetNextInstruction,
        mockSetClippedPolyline,
        mockCancelNavigation
      )
    );

    expect(lineString).toHaveBeenCalledWith([
      [-122.4194, 37.7749],
      [-122.4195, 37.775],
    ]);
    expect(point).toHaveBeenCalledWith([-122.4194, 37.7749]);
    expect(nearestPointOnLine).toHaveBeenCalledWith(
      'mockTurfLine',
      'mockUserPoint'
    );

    expect(mockSetSnappedPoint).toHaveBeenCalledWith(mockSnappedPoint);
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
    expect(mockSetRemainingTime).toHaveBeenCalledWith(50);
    expect(mockSetRemainingDistance).toHaveBeenCalledWith(90);
    expect(determineNextInstruction).toHaveBeenCalledWith(
      mockRouteData.steps,
      mockSnappedPoint,
      'DRIVE'
    );
    expect(mockSetNextInstruction).toHaveBeenCalledWith('Continue straight');
    expect(clipPolylineFromSnappedPoint).toHaveBeenCalledWith(
      mockRouteData.polyline,
      mockSnappedPoint
    );
    expect(mockSetClippedPolyline).toHaveBeenCalledWith(mockClippedPolyline);
  });

  it('should not call cancelNavigation when remainingDistance is null', () => {
    renderHook(() =>
      useNavigationData(
        mockLocation,
        mockRouteData,
        'navigating',
        'DRIVE',
        mockSetSnappedPoint,
        mockSetRemainingTime,
        null,
        mockSetRemainingDistance,
        mockSetNextInstruction,
        mockSetClippedPolyline,
        mockCancelNavigation
      )
    );

    expect(mockCancelNavigation).not.toHaveBeenCalled();
  });

  it('should not call cancelNavigation when travelMode is SHUTTLE', () => {
    renderHook(() =>
      useNavigationData(
        mockLocation,
        mockRouteData,
        'navigating',
        'SHUTTLE',
        mockSetSnappedPoint,
        mockSetRemainingTime,
        5,
        mockSetRemainingDistance,
        mockSetNextInstruction,
        mockSetClippedPolyline,
        mockCancelNavigation
      )
    );

    expect(mockCancelNavigation).not.toHaveBeenCalled();
  });

  it('should not call cancelNavigation when navigationState is not navigating', () => {
    renderHook(() =>
      useNavigationData(
        mockLocation,
        mockRouteData,
        'planning',
        'DRIVE',
        mockSetSnappedPoint,
        mockSetRemainingTime,
        5,
        mockSetRemainingDistance,
        mockSetNextInstruction,
        mockSetClippedPolyline,
        mockCancelNavigation
      )
    );

    expect(mockCancelNavigation).not.toHaveBeenCalled();
  });

  it('should not call cancelNavigation when remainingDistance is greater than threshold', () => {
    renderHook(() =>
      useNavigationData(
        mockLocation,
        mockRouteData,
        'navigating',
        'DRIVE',
        mockSetSnappedPoint,
        mockSetRemainingTime,
        20,
        mockSetRemainingDistance,
        mockSetNextInstruction,
        mockSetClippedPolyline,
        mockCancelNavigation
      )
    );

    expect(mockCancelNavigation).not.toHaveBeenCalled();
  });

  it('should call cancelNavigation when all arrival conditions are met', () => {
    renderHook(() =>
      useNavigationData(
        mockLocation,
        mockRouteData,
        'navigating',
        'DRIVE',
        mockSetSnappedPoint,
        mockSetRemainingTime,
        5,
        mockSetRemainingDistance,
        mockSetNextInstruction,
        mockSetClippedPolyline,
        mockCancelNavigation
      )
    );

    expect(mockCancelNavigation).toHaveBeenCalled();
  });

  it('should handle case when nearestPointOnLine returns null or invalid data', () => {
    (nearestPointOnLine as jest.Mock).mockReturnValue({});

    renderHook(() =>
      useNavigationData(
        mockLocation,
        mockRouteData,
        'navigating',
        'DRIVE',
        mockSetSnappedPoint,
        mockSetRemainingTime,
        null,
        mockSetRemainingDistance,
        mockSetNextInstruction,
        mockSetClippedPolyline,
        mockCancelNavigation
      )
    );

    expect(mockSetSnappedPoint).not.toHaveBeenCalled();
    expect(mockSetRemainingTime).not.toHaveBeenCalled();
    expect(mockSetRemainingDistance).not.toHaveBeenCalled();
    expect(mockSetNextInstruction).not.toHaveBeenCalled();
    expect(mockSetClippedPolyline).not.toHaveBeenCalled();
  });
});
