import { renderHook } from '@testing-library/react-hooks';
import { useShuttleData } from '../useShuttleData';
import nearestPointOnLine from '@turf/nearest-point-on-line';

jest.mock('@turf/nearest-point-on-line', () => jest.fn());

const mockSetSnappedPoint = jest.fn();
const mockSetRemainingTime = jest.fn();
const mockSetRemainingDistance = jest.fn();
const mockSetNextInstruction = jest.fn();
const mockSetClippedPolyline = jest.fn();
const mockSetCurrentLeg = jest.fn();
const mockCancelNavigation = jest.fn();

const baseShuttleData = {
  legOne: {
    polyline: [
      { latitude: 0, longitude: 0 },
      { latitude: 0, longitude: 1 },
    ],
    steps: [],
    totalDuration: 100,
    totalDistance: 1000,
  },
  legTwo: {
    busData: {
      polyline: [
        { latitude: 0, longitude: 0 },
        { latitude: 1, longitude: 1 },
      ],
      steps: [],
      totalDuration: 900,
      totalDistance: 1000,
    },
    busPoints: [
      { latitude: 0, longitude: 0 },
      { latitude: 1, longitude: 1 },
    ],
  },
  legThree: {
    polyline: [
      { latitude: 1, longitude: 1 },
      { latitude: 1, longitude: 2 },
    ],
    steps: [],
    totalDuration: 100,
    totalDistance: 1000,
  },
};

const mockSnappedPoint = {
  geometry: {
    coordinates: [0.5, 0],
  },
};

const mockOtherBusStop = {
  name: 'Other Campus',
  shortName: 'OTHER',
  location: { latitude: 1, longitude: 1.01 },
  schedule: {
    MonThu: [],
    Fri: [],
  },
};

describe('useShuttleData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (nearestPointOnLine as jest.Mock).mockReturnValue(mockSnappedPoint);
  });

  it('does nothing if location or shuttleData is missing', () => {
    renderHook(() =>
      useShuttleData(
        null,
        null,
        'navigating',
        'WALK',
        null,
        'legOne',
        mockSetCurrentLeg,
        mockSetSnappedPoint,
        mockSetRemainingTime,
        mockSetRemainingDistance,
        mockSetNextInstruction,
        mockSetClippedPolyline,
        mockCancelNavigation
      )
    );
    expect(mockSetSnappedPoint).not.toHaveBeenCalled();
    expect(mockSetCurrentLeg).not.toHaveBeenCalled();
  });

  it('handles legOne navigation and sets snapped point', () => {
    renderHook(() =>
      useShuttleData(
        { latitude: 0, longitude: 0.5 },
        baseShuttleData,
        'navigating',
        'WALK',
        null,
        'legOne',
        mockSetCurrentLeg,
        mockSetSnappedPoint,
        mockSetRemainingTime,
        mockSetRemainingDistance,
        mockSetNextInstruction,
        mockSetClippedPolyline,
        mockCancelNavigation
      )
    );
    expect(mockSetSnappedPoint).toHaveBeenCalled();
    expect(mockSetRemainingTime).toHaveBeenCalled();
    expect(mockSetRemainingDistance).toHaveBeenCalled();
    expect(mockSetNextInstruction).toHaveBeenCalled();
    expect(mockSetClippedPolyline).toHaveBeenCalled();
  });

  it('switches to legTwo if remaining distance small in legOne', () => {
    (nearestPointOnLine as jest.Mock).mockReturnValueOnce({
      geometry: { coordinates: [0.5, 0] },
    });

    const customBaseShuttleData = {
      ...baseShuttleData,
      legOne: {
        ...baseShuttleData.legOne,
        steps: [],
        totalDistance: 10,
        totalDuration: 10,
      },
    };

    renderHook(() =>
      useShuttleData(
        { latitude: 0, longitude: 0.5 },
        customBaseShuttleData,
        'navigating',
        'WALK',
        null,
        'legOne',
        mockSetCurrentLeg,
        mockSetSnappedPoint,
        mockSetRemainingTime,
        mockSetRemainingDistance,
        mockSetNextInstruction,
        mockSetClippedPolyline,
        mockCancelNavigation
      )
    );
    expect(mockSetCurrentLeg).toHaveBeenCalledWith('legTwo');
  });

  it('handles legTwo navigation and sets shuttle instruction', () => {
    renderHook(() =>
      useShuttleData(
        { latitude: 1, longitude: 1 },
        baseShuttleData,
        'navigating',
        'WALK',
        mockOtherBusStop,
        'legTwo',
        mockSetCurrentLeg,
        mockSetSnappedPoint,
        mockSetRemainingTime,
        mockSetRemainingDistance,
        mockSetNextInstruction,
        mockSetClippedPolyline,
        mockCancelNavigation
      )
    );
    expect(mockSetNextInstruction).toHaveBeenCalledWith(
      expect.stringContaining('Take the Concordia shuttle bus')
    );
  });

  it('switches to legThree if close to destination in legTwo', () => {
    renderHook(() =>
      useShuttleData(
        { latitude: 1, longitude: 1.01 },
        baseShuttleData,
        'navigating',
        'WALK',
        mockOtherBusStop,
        'legTwo',
        mockSetCurrentLeg,
        mockSetSnappedPoint,
        mockSetRemainingTime,
        mockSetRemainingDistance,
        mockSetNextInstruction,
        mockSetClippedPolyline,
        mockCancelNavigation
      )
    );
    expect(mockSetCurrentLeg).toHaveBeenCalledWith('legThree');
  });

  it('handles legThree navigation and cancels navigation at end', () => {
    (nearestPointOnLine as jest.Mock).mockReturnValue({
      geometry: { coordinates: [1.5, 1] },
    });

    const customBaseShuttleData = {
      ...baseShuttleData,
      legThree: {
        ...baseShuttleData.legThree,
        steps: [],
        totalDistance: 10,
        totalDuration: 10,
      },
    };

    renderHook(() =>
      useShuttleData(
        { latitude: 1, longitude: 1.5 },
        customBaseShuttleData,
        'navigating',
        'WALK',
        null,
        'legThree',
        mockSetCurrentLeg,
        mockSetSnappedPoint,
        mockSetRemainingTime,
        mockSetRemainingDistance,
        mockSetNextInstruction,
        mockSetClippedPolyline,
        mockCancelNavigation
      )
    );
    expect(mockCancelNavigation).toHaveBeenCalled();
  });
});
