import { renderHook } from '@testing-library/react-hooks';
import { useShuttleBus } from '@/hooks/useShuttleBus';
import { LatLng } from 'react-native-maps';
import { getGoogleMapsRoute } from '@/services/googleMapsRoutes';
import { getShuttleBus } from '@/services/shuttleBus';
import {
  getNearestBusStop,
  getOtherBusStop,
  getNextDeparture,
} from '@/utils/navigationUtils';
import { mapRef } from '@/utils/refs';
import { toast } from 'sonner-native';
import { ShuttleBusStop, RouteData } from '@/constants/types';

jest.mock('@/services/googleMapsRoutes', () => ({
  getGoogleMapsRoute: jest.fn(),
}));

jest.mock('@/services/shuttleBus', () => ({
  getShuttleBus: jest.fn(),
}));

jest.mock('@/utils/navigationUtils', () => ({
  getNearestBusStop: jest.fn(),
  getOtherBusStop: jest.fn(),
  getNextDeparture: jest.fn(),
  ShuttleBusStops: {
    SGW: {
      name: 'SGW Campus',
      shortName: 'SGW',
      location: { latitude: 45.4972, longitude: -73.5784 },
      schedule: {
        MonThu: ['08:00', '09:00', '10:00'],
        Fri: ['08:00', '09:00'],
      },
    },
    LOY: {
      name: 'Loyola Campus',
      shortName: 'LOY',
      location: { latitude: 45.4584, longitude: -73.6383 },
      schedule: {
        MonThu: ['08:30', '09:30', '10:30'],
        Fri: ['08:30', '09:30'],
      },
    },
  },
}));

jest.mock('@/utils/refs', () => ({
  mapRef: {
    current: {
      fitToCoordinates: jest.fn(),
    },
  },
}));

jest.mock('sonner-native', () => ({
  toast: {
    error: jest.fn(),
  },
}));

jest.spyOn(console, 'log').mockImplementation(() => {});

describe('useShuttleBus', () => {
  const mockOrigin: LatLng = { latitude: 45.48, longitude: -73.58 };
  const mockDestination: LatLng = { latitude: 45.5, longitude: -73.6 };

  const mockNearestBusStop: ShuttleBusStop = {
    name: 'SGW Campus',
    shortName: 'SGW',
    location: { latitude: 45.4972, longitude: -73.5784 },
    schedule: {
      MonThu: ['08:00', '09:00', '10:00'],
      Fri: ['08:00', '09:00'],
    },
  };

  const mockOtherBusStop: ShuttleBusStop = {
    name: 'Loyola Campus',
    shortName: 'LOY',
    location: { latitude: 45.4584, longitude: -73.6383 },
    schedule: {
      MonThu: ['08:30', '09:30', '10:30'],
      Fri: ['08:30', '09:30'],
    },
  };

  const mockRouteData: RouteData = {
    steps: [
      {
        instruction: 'Go straight',
        distance: 100,
        duration: 60,
        startLocation: { latitude: 45.48, longitude: -73.58 },
        endLocation: { latitude: 45.497, longitude: -73.5784 },
        polyline: [
          { latitude: 45.48, longitude: -73.58 },
          { latitude: 45.497, longitude: -73.5784 },
        ],
        cumulativeDistance: 0,
      },
    ],
    polyline: [
      { latitude: 45.48, longitude: -73.58 },
      { latitude: 45.497, longitude: -73.5784 },
    ],
    totalDistance: 100,
    totalDuration: 60,
  };

  const mockBusPoints = [
    { ID: 'BUS1', Latitude: 45.4584, Longitude: -73.6383 },
    { ID: 'BUS2', Latitude: 45.4972, Longitude: -73.5784 },
    { ID: 'OTHER', Latitude: 45.5, Longitude: -73.6 },
  ];

  const mockSetNearestBusStop = jest.fn();
  const mockSetOtherBusStop = jest.fn();
  const mockSetError = jest.fn();
  const mockSetLoading = jest.fn();
  const mockSetNextDeparture = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    (getNearestBusStop as jest.Mock).mockReturnValue(mockNearestBusStop);
    (getOtherBusStop as jest.Mock).mockReturnValue(mockOtherBusStop);
    (getNextDeparture as jest.Mock).mockReturnValue('10:30');
    (getGoogleMapsRoute as jest.Mock).mockResolvedValue(mockRouteData);
    (getShuttleBus as jest.Mock).mockResolvedValue({
      d: {
        Points: mockBusPoints,
      },
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should initialize with null shuttleData', () => {
    const { result } = renderHook(() =>
      useShuttleBus(
        null,
        null,
        mockSetNearestBusStop,
        null,
        mockSetOtherBusStop,
        null,
        'DRIVE',
        'default',
        mockSetError,
        mockSetLoading,
        mockSetNextDeparture
      )
    );

    expect(result.current.shuttleData).toBeNull();
  });

  it('should set nearest and other bus stops when origin is provided and travelMode is SHUTTLE', () => {
    renderHook(() =>
      useShuttleBus(
        mockOrigin,
        null,
        mockSetNearestBusStop,
        null,
        mockSetOtherBusStop,
        mockDestination,
        'SHUTTLE',
        'planning',
        mockSetError,
        mockSetLoading,
        mockSetNextDeparture
      )
    );

    expect(getNearestBusStop).toHaveBeenCalledWith(mockOrigin);
    expect(getOtherBusStop).toHaveBeenCalledWith(mockOrigin);
    expect(mockSetNearestBusStop).toHaveBeenCalledWith(mockNearestBusStop);
    expect(mockSetOtherBusStop).toHaveBeenCalledWith(mockOtherBusStop);
  });

  it('should not set bus stops when travelMode is not SHUTTLE', () => {
    renderHook(() =>
      useShuttleBus(
        mockOrigin,
        null,
        mockSetNearestBusStop,
        null,
        mockSetOtherBusStop,
        mockDestination,
        'DRIVE',
        'planning',
        mockSetError,
        mockSetLoading,
        mockSetNextDeparture
      )
    );

    expect(getNearestBusStop).not.toHaveBeenCalled();
    expect(getOtherBusStop).not.toHaveBeenCalled();
    expect(mockSetNearestBusStop).not.toHaveBeenCalled();
    expect(mockSetOtherBusStop).not.toHaveBeenCalled();
  });

  it('should fetch shuttle data when all required parameters are provided', async () => {
    (getGoogleMapsRoute as jest.Mock).mockImplementation(() =>
      Promise.resolve(mockRouteData)
    );
    (getShuttleBus as jest.Mock).mockImplementation(() =>
      Promise.resolve({
        d: { Points: mockBusPoints },
      })
    );

    const { result, waitForNextUpdate } = renderHook(() =>
      useShuttleBus(
        mockOrigin,
        mockNearestBusStop,
        mockSetNearestBusStop,
        mockOtherBusStop,
        mockSetOtherBusStop,
        mockDestination,
        'SHUTTLE',
        'planning',
        mockSetError,
        mockSetLoading,
        mockSetNextDeparture
      )
    );

    await waitForNextUpdate();

    expect(getGoogleMapsRoute).toHaveBeenCalledTimes(3);
    expect(getGoogleMapsRoute).toHaveBeenCalledWith(
      mockOrigin,
      mockNearestBusStop.location,
      'SHUTTLE'
    );
    expect(getGoogleMapsRoute).toHaveBeenCalledWith(
      mockOtherBusStop.location,
      mockDestination,
      'SHUTTLE'
    );
    expect(getGoogleMapsRoute).toHaveBeenCalledWith(
      mockNearestBusStop.location,
      mockOtherBusStop.location,
      'DRIVE'
    );

    expect(getShuttleBus).toHaveBeenCalled();

    expect(result.current.shuttleData).toEqual({
      legOne: mockRouteData,
      legTwo: {
        busData: mockRouteData,
        busPoints: [
          { latitude: 45.4584, longitude: -73.6383 },
          { latitude: 45.4972, longitude: -73.5784 },
        ],
      },
      legThree: mockRouteData,
    });

    expect(mapRef.current?.fitToCoordinates).toHaveBeenCalledWith(
      [
        mockOrigin,
        mockNearestBusStop.location,
        mockOtherBusStop.location,
        mockDestination,
      ],
      {
        edgePadding: {
          top: 120,
          right: 60,
          bottom: 120,
          left: 60,
        },
        animated: true,
      }
    );

    expect(mockSetError).toHaveBeenCalledWith(null);
  });

  it('should not fetch shuttle data when navigationState is default', () => {
    renderHook(() =>
      useShuttleBus(
        mockOrigin,
        mockNearestBusStop,
        mockSetNearestBusStop,
        mockOtherBusStop,
        mockSetOtherBusStop,
        mockDestination,
        'SHUTTLE',
        'default',
        mockSetError,
        mockSetLoading,
        mockSetNextDeparture
      )
    );

    expect(getGoogleMapsRoute).not.toHaveBeenCalled();
    expect(getShuttleBus).not.toHaveBeenCalled();
    expect(mockSetLoading).toHaveBeenCalledWith(false);
  });

  it('should not fetch shuttle data when travelMode is not SHUTTLE', () => {
    renderHook(() =>
      useShuttleBus(
        mockOrigin,
        mockNearestBusStop,
        mockSetNearestBusStop,
        mockOtherBusStop,
        mockSetOtherBusStop,
        mockDestination,
        'DRIVE',
        'planning',
        mockSetError,
        mockSetLoading,
        mockSetNextDeparture
      )
    );

    expect(getGoogleMapsRoute).not.toHaveBeenCalled();
    expect(getShuttleBus).not.toHaveBeenCalled();
    expect(mockSetLoading).toHaveBeenCalledWith(false);
  });

  it.skip('should handle errors when fetching shuttle data', async () => {});

  it('should handle errors when fetching bus points', async () => {
    const testError = new Error('API error');
    (getShuttleBus as jest.Mock).mockRejectedValueOnce(testError);

    (getGoogleMapsRoute as jest.Mock).mockImplementation(() =>
      Promise.resolve(mockRouteData)
    );

    const { waitForNextUpdate } = renderHook(() =>
      useShuttleBus(
        mockOrigin,
        mockNearestBusStop,
        mockSetNearestBusStop,
        mockOtherBusStop,
        mockSetOtherBusStop,
        mockDestination,
        'SHUTTLE',
        'planning',
        mockSetError,
        mockSetLoading,
        mockSetNextDeparture
      )
    );

    await waitForNextUpdate();

    expect(toast.error).toHaveBeenCalledWith('Failed to fetch bus points', {
      description: 'API error',
      duration: 2000,
    });
  });

  it.skip('should set next departure time when nearestBusStop and shuttleData are available', async () => {});

  it.skip('should set error when no shuttle is available', async () => {});

  it('should start polling for bus points when navigating with shuttle', async () => {
    (getGoogleMapsRoute as jest.Mock).mockImplementation(() =>
      Promise.resolve(mockRouteData)
    );
    (getShuttleBus as jest.Mock).mockImplementation(() =>
      Promise.resolve({
        d: { Points: mockBusPoints },
      })
    );

    const { result, waitForNextUpdate } = renderHook(() =>
      useShuttleBus(
        mockOrigin,
        mockNearestBusStop,
        mockSetNearestBusStop,
        mockOtherBusStop,
        mockSetOtherBusStop,
        mockDestination,
        'SHUTTLE',
        'navigating',
        mockSetError,
        mockSetLoading,
        mockSetNextDeparture
      )
    );

    await waitForNextUpdate();

    expect(result.current.shuttleData).toEqual({
      legOne: mockRouteData,
      legTwo: {
        busData: mockRouteData,
        busPoints: [
          { latitude: 45.4584, longitude: -73.6383 },
          { latitude: 45.4972, longitude: -73.5784 },
        ],
      },
      legThree: mockRouteData,
    });

    (getShuttleBus as jest.Mock).mockClear();
    (getShuttleBus as jest.Mock).mockImplementation(() =>
      Promise.resolve({
        d: { Points: mockBusPoints },
      })
    );

    jest.advanceTimersByTime(15000);

    expect(getShuttleBus).toHaveBeenCalled();
  });

  it('should stop polling when component unmounts', async () => {
    (getGoogleMapsRoute as jest.Mock).mockImplementation(() =>
      Promise.resolve(mockRouteData)
    );
    (getShuttleBus as jest.Mock).mockImplementation(() =>
      Promise.resolve({
        d: { Points: mockBusPoints },
      })
    );

    const { waitForNextUpdate, unmount } = renderHook(() =>
      useShuttleBus(
        mockOrigin,
        mockNearestBusStop,
        mockSetNearestBusStop,
        mockOtherBusStop,
        mockSetOtherBusStop,
        mockDestination,
        'SHUTTLE',
        'navigating',
        mockSetError,
        mockSetLoading,
        mockSetNextDeparture
      )
    );

    await waitForNextUpdate();

    unmount();

    (getShuttleBus as jest.Mock).mockClear();

    jest.advanceTimersByTime(15000);

    expect(getShuttleBus).not.toHaveBeenCalled();
  });

  it.skip('should not start polling when navigationState is not navigating', async () => {});

  it('should allow setting shuttleData manually', () => {
    const { result } = renderHook(() =>
      useShuttleBus(
        null,
        null,
        mockSetNearestBusStop,
        null,
        mockSetOtherBusStop,
        null,
        'DRIVE',
        'default',
        mockSetError,
        mockSetLoading,
        mockSetNextDeparture
      )
    );

    const newShuttleData = {
      legOne: mockRouteData,
      legTwo: {
        busData: mockRouteData,
        busPoints: [],
      },
      legThree: mockRouteData,
    };

    result.current.setShuttleData(newShuttleData);

    expect(result.current.shuttleData).toEqual(newShuttleData);
  });
});
