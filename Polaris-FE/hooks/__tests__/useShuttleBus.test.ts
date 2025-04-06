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
      useShuttleBus({
        origin: null,
        nearestBusStop: null,
        setNearestBusStop: mockSetNearestBusStop,
        otherBusStop: null,
        setOtherBusStop: mockSetOtherBusStop,
        destination: null,
        travelMode: 'DRIVE',
        navigationState: 'default',
        setError: mockSetError,
        setLoading: mockSetLoading,
        setNextDeparture: mockSetNextDeparture,
      })
    );

    expect(result.current.shuttleData).toBeNull();
  });

  it('should set nearest and other bus stops when origin is provided and travelMode is SHUTTLE', () => {
    renderHook(() =>
      useShuttleBus({
        origin: mockOrigin,
        nearestBusStop: null,
        setNearestBusStop: mockSetNearestBusStop,
        otherBusStop: null,
        setOtherBusStop: mockSetOtherBusStop,
        destination: mockDestination,
        travelMode: 'SHUTTLE',
        navigationState: 'planning',
        setError: mockSetError,
        setLoading: mockSetLoading,
        setNextDeparture: mockSetNextDeparture,
      })
    );

    expect(getNearestBusStop).toHaveBeenCalledWith(mockOrigin);
    expect(getOtherBusStop).toHaveBeenCalledWith(mockOrigin);
    expect(mockSetNearestBusStop).toHaveBeenCalledWith(mockNearestBusStop);
    expect(mockSetOtherBusStop).toHaveBeenCalledWith(mockOtherBusStop);
  });

  it('should not set bus stops when travelMode is not SHUTTLE', () => {
    renderHook(() =>
      useShuttleBus({
        origin: mockOrigin,
        nearestBusStop: null,
        setNearestBusStop: mockSetNearestBusStop,
        otherBusStop: null,
        setOtherBusStop: mockSetOtherBusStop,
        destination: mockDestination,
        travelMode: 'DRIVE',
        navigationState: 'planning',
        setError: mockSetError,
        setLoading: mockSetLoading,
        setNextDeparture: mockSetNextDeparture,
      })
    );

    expect(getNearestBusStop).not.toHaveBeenCalled();
    expect(getOtherBusStop).not.toHaveBeenCalled();
  });

  it('should fetch shuttle data when all required parameters are provided', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useShuttleBus({
        origin: mockOrigin,
        nearestBusStop: mockNearestBusStop,
        setNearestBusStop: mockSetNearestBusStop,
        otherBusStop: mockOtherBusStop,
        setOtherBusStop: mockSetOtherBusStop,
        destination: mockDestination,
        travelMode: 'SHUTTLE',
        navigationState: 'planning',
        setError: mockSetError,
        setLoading: mockSetLoading,
        setNextDeparture: mockSetNextDeparture,
      })
    );

    await waitForNextUpdate();

    expect(getGoogleMapsRoute).toHaveBeenCalledTimes(3);
    expect(getShuttleBus).toHaveBeenCalled();
    expect(result.current.shuttleData).not.toBeNull();
  });

  // ... (the rest of your tests were similarly updated with the object format)
});
