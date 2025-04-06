// import { renderHook, act } from '@testing-library/react-hooks';
// import { useGoogleMapsRoute } from '@/hooks/useGoogleMapsRoute';
// import { getGoogleMapsRoute } from '@/services/googleMapsRoutes';
// import { mapRef } from '@/utils/refs';
// import {
//   TravelMode,
//   RouteData,
//   NavigationState,
//   Step,
// } from '@/constants/types';
// import { LatLng } from 'react-native-maps';
//
// jest.mock('@/services/googleMapsRoutes');
// jest.mock('@/utils/refs', () => ({
//   mapRef: {
//     current: {
//       fitToCoordinates: jest.fn(),
//     },
//   },
// }));
//
// describe('useGoogleMapsRoute', () => {
//   const mockOrigin: LatLng = { latitude: 37.7749, longitude: -122.4194 };
//   const mockDestination: LatLng = { latitude: 34.0522, longitude: -118.2437 };
//   const mockTravelMode: TravelMode = 'DRIVE';
//   const mockNavigationState: NavigationState = 'planning';
//
//   const mockSteps: Step[] = [
//     {
//       startLocation: { latitude: 37.7749, longitude: -122.4194 },
//       endLocation: { latitude: 36.0, longitude: -120.0 },
//       distance: 250000,
//       duration: 9000,
//       instruction: 'Head south on I-5',
//       polyline: [
//         { latitude: 37.7749, longitude: -122.4194 },
//         { latitude: 36.0, longitude: -120.0 },
//       ],
//       cumulativeDistance: 250000,
//     },
//     {
//       startLocation: { latitude: 36.0, longitude: -120.0 },
//       endLocation: { latitude: 34.0522, longitude: -118.2437 },
//       distance: 250000,
//       duration: 9000,
//       instruction: 'Continue on I-5',
//       polyline: [
//         { latitude: 36.0, longitude: -120.0 },
//         { latitude: 34.0522, longitude: -118.2437 },
//       ],
//       cumulativeDistance: 500000,
//     },
//   ];
//
//   const mockRouteData: RouteData = {
//     polyline: [
//       { latitude: 37.7749, longitude: -122.4194 },
//       { latitude: 36.0, longitude: -120.0 },
//       { latitude: 34.0522, longitude: -118.2437 },
//     ],
//     totalDistance: 500000,
//     totalDuration: 18000,
//     steps: mockSteps,
//   };
//
//   beforeEach(() => {
//     jest.clearAllMocks();
//     (getGoogleMapsRoute as jest.Mock).mockResolvedValue(mockRouteData);
//   });
//
//   test('should not fetch route data when origin is null', async () => {
//     const { result } = renderHook(() =>
//       useGoogleMapsRoute(
//         null,
//         mockDestination,
//         mockTravelMode,
//         mockNavigationState
//       )
//     );
//
//     await new Promise(resolve => setTimeout(resolve, 0));
//
//     expect(getGoogleMapsRoute).not.toHaveBeenCalled();
//     expect(result.current.routeData).toBeNull();
//     expect(result.current.loading).toBe(false);
//     expect(result.current.error).toBeNull();
//   });
//
//   test('should not fetch route data when navigationState is default', async () => {
//     const { result } = renderHook(() =>
//       useGoogleMapsRoute(mockOrigin, mockDestination, mockTravelMode, 'default')
//     );
//
//     await new Promise(resolve => setTimeout(resolve, 0));
//
//     expect(getGoogleMapsRoute).not.toHaveBeenCalled();
//     expect(result.current.routeData).toBeNull();
//     expect(result.current.loading).toBe(false);
//     expect(result.current.error).toBeNull();
//   });
//
//   test('should fetch route data and set it when origin and destination are provided', async () => {
//     (getGoogleMapsRoute as jest.Mock).mockImplementation(() =>
//       Promise.resolve(mockRouteData)
//     );
//
//     const { result } = renderHook(() =>
//       useGoogleMapsRoute(
//         mockOrigin,
//         mockDestination,
//         mockTravelMode,
//         mockNavigationState
//       )
//     );
//
//     await act(async () => {
//       await new Promise(resolve => setTimeout(resolve, 0));
//     });
//
//     expect(getGoogleMapsRoute).toHaveBeenCalledWith(
//       mockOrigin,
//       mockDestination,
//       mockTravelMode
//     );
//     expect(result.current.routeData).toEqual(mockRouteData);
//     expect(result.current.loading).toBe(false);
//     expect(result.current.error).toBeNull();
//   });
//
//   test('should fit map to coordinates when navigationState is planning', async () => {
//     renderHook(() =>
//       useGoogleMapsRoute(
//         mockOrigin,
//         mockDestination,
//         mockTravelMode,
//         'planning'
//       )
//     );
//
//     await act(async () => {
//       await new Promise(resolve => setTimeout(resolve, 0));
//     });
//
//     expect(mapRef.current?.fitToCoordinates).toHaveBeenCalledWith(
//       mockRouteData.polyline,
//       {
//         edgePadding: {
//           top: 120,
//           right: 60,
//           bottom: 120,
//           left: 60,
//         },
//         animated: true,
//       }
//     );
//   });
//
//   test('should not fit map to coordinates when navigationState is navigating', async () => {
//     renderHook(() =>
//       useGoogleMapsRoute(
//         mockOrigin,
//         mockDestination,
//         mockTravelMode,
//         'navigating'
//       )
//     );
//
//     await act(async () => {
//       await new Promise(resolve => setTimeout(resolve, 0));
//     });
//
//     expect(mapRef.current?.fitToCoordinates).not.toHaveBeenCalled();
//   });
//
//   test('should handle errors when fetching route data fails', async () => {
//     const error = new Error('Network error');
//     (getGoogleMapsRoute as jest.Mock).mockRejectedValue(error);
//
//     const { result } = renderHook(() =>
//       useGoogleMapsRoute(
//         mockOrigin,
//         mockDestination,
//         mockTravelMode,
//         mockNavigationState
//       )
//     );
//
//     await act(async () => {
//       await new Promise(resolve => setTimeout(resolve, 0));
//     });
//
//     expect(result.current.error).toEqual(error);
//     expect(result.current.loading).toBe(false);
//     expect(result.current.routeData).toBeNull();
//   });
//
//   test('should update route data when setRouteData is called', async () => {
//     const { result } = renderHook(() =>
//       useGoogleMapsRoute(
//         mockOrigin,
//         mockDestination,
//         mockTravelMode,
//         mockNavigationState
//       )
//     );
//
//     await act(async () => {
//       await new Promise(resolve => setTimeout(resolve, 0));
//     });
//
//     const newSteps: Step[] = [
//       {
//         startLocation: { latitude: 40.7128, longitude: -74.006 },
//         endLocation: { latitude: 41.0, longitude: -75.0 },
//         distance: 150000,
//         duration: 5400,
//         instruction: 'Head north on I-95',
//         polyline: [
//           { latitude: 40.7128, longitude: -74.006 },
//           { latitude: 41.0, longitude: -75.0 },
//         ],
//         cumulativeDistance: 150000,
//       },
//       {
//         startLocation: { latitude: 41.0, longitude: -75.0 },
//         endLocation: { latitude: 42.3601, longitude: -71.0589 },
//         distance: 150000,
//         duration: 5400,
//         instruction: 'Continue on I-95',
//         polyline: [
//           { latitude: 41.0, longitude: -75.0 },
//           { latitude: 42.3601, longitude: -71.0589 },
//         ],
//         cumulativeDistance: 300000,
//       },
//     ];
//
//     const newRouteData: RouteData = {
//       polyline: [
//         { latitude: 40.7128, longitude: -74.006 },
//         { latitude: 41.0, longitude: -75.0 },
//         { latitude: 42.3601, longitude: -71.0589 },
//       ],
//       totalDistance: 300000,
//       totalDuration: 10800,
//       steps: newSteps,
//     };
//
//     act(() => {
//       result.current.setRouteData(newRouteData);
//     });
//
//     expect(result.current.routeData).toEqual(newRouteData);
//     expect(result.current.loading).toBe(false);
//     expect(result.current.error).toBeNull();
//   });
//
//   test('should refetch route data when travelMode changes', async () => {
//     const { result, rerender } = renderHook(
//       ({ travelMode, destination }) =>
//         useGoogleMapsRoute(
//           mockOrigin,
//           destination,
//           travelMode,
//           mockNavigationState
//         ),
//       {
//         initialProps: {
//           travelMode: 'DRIVE' as TravelMode,
//           destination: mockDestination,
//         },
//       }
//     );
//
//     await act(async () => {
//       await new Promise(resolve => setTimeout(resolve, 0));
//     });
//
//     expect(getGoogleMapsRoute).toHaveBeenCalledTimes(1);
//     expect(getGoogleMapsRoute).toHaveBeenCalledWith(
//       mockOrigin,
//       mockDestination,
//       'DRIVE'
//     );
//     expect(result.current.loading).toBe(false);
//     expect(result.current.error).toBeNull();
//
//     jest.clearAllMocks();
//
//     rerender({
//       travelMode: 'WALK' as TravelMode,
//       destination: { ...mockDestination },
//     });
//
//     await act(async () => {
//       await new Promise(resolve => setTimeout(resolve, 0));
//     });
//
//     expect(getGoogleMapsRoute).toHaveBeenCalledTimes(1);
//     expect(getGoogleMapsRoute).toHaveBeenCalledWith(
//       mockOrigin,
//       expect.objectContaining({
//         latitude: mockDestination.latitude,
//         longitude: mockDestination.longitude,
//       }),
//       'WALK'
//     );
//     expect(result.current.loading).toBe(false);
//     expect(result.current.error).toBeNull();
//   });
//
//   test('should refetch route data when destination changes', async () => {
//     const { result, rerender } = renderHook(
//       ({ destination, travelMode }) =>
//         useGoogleMapsRoute(
//           mockOrigin,
//           destination,
//           travelMode,
//           mockNavigationState
//         ),
//       {
//         initialProps: {
//           destination: mockDestination,
//           travelMode: mockTravelMode,
//         },
//       }
//     );
//
//     await act(async () => {
//       await new Promise(resolve => setTimeout(resolve, 0));
//     });
//
//     expect(getGoogleMapsRoute).toHaveBeenCalledTimes(1);
//
//     jest.clearAllMocks();
//
//     const newDestination = { latitude: 40.7128, longitude: -74.006 };
//     rerender({
//       destination: newDestination,
//       travelMode: mockTravelMode,
//     });
//
//     await act(async () => {
//       await new Promise(resolve => setTimeout(resolve, 0));
//     });
//
//     expect(getGoogleMapsRoute).toHaveBeenCalledTimes(1);
//     expect(getGoogleMapsRoute).toHaveBeenCalledWith(
//       mockOrigin,
//       newDestination,
//       mockTravelMode
//     );
//     expect(result.current.loading).toBe(false);
//     expect(result.current.error).toBeNull();
//   });
// });
import { renderHook, act } from '@testing-library/react-hooks';
import { useGoogleMapsRoute } from '@/hooks/useGoogleMapsRoute';
import { getGoogleMapsRoute } from '@/services/googleMapsRoutes';
import { mapRef } from '@/utils/refs';
import {
  TravelMode,
  RouteData,
  NavigationState,
  Step,
} from '@/constants/types';
import { LatLng } from 'react-native-maps';

jest.mock('@/services/googleMapsRoutes');
jest.mock('@/utils/refs', () => ({
  mapRef: {
    current: {
      fitToCoordinates: jest.fn(),
    },
  },
}));

describe('useGoogleMapsRoute', () => {
  const mockOrigin: LatLng = { latitude: 37.7749, longitude: -122.4194 };
  const mockDestination: LatLng = { latitude: 34.0522, longitude: -118.2437 };
  const mockTravelMode: TravelMode = 'DRIVE';
  const mockNavigationState: NavigationState = 'planning';

  const mockSteps: Step[] = [
    {
      startLocation: { latitude: 37.7749, longitude: -122.4194 },
      endLocation: { latitude: 36.0, longitude: -120.0 },
      distance: 250000,
      duration: 9000,
      instruction: 'Head south on I-5',
      polyline: [
        { latitude: 37.7749, longitude: -122.4194 },
        { latitude: 36.0, longitude: -120.0 },
      ],
      cumulativeDistance: 250000,
    },
    {
      startLocation: { latitude: 36.0, longitude: -120.0 },
      endLocation: { latitude: 34.0522, longitude: -118.2437 },
      distance: 250000,
      duration: 9000,
      instruction: 'Continue on I-5',
      polyline: [
        { latitude: 36.0, longitude: -120.0 },
        { latitude: 34.0522, longitude: -118.2437 },
      ],
      cumulativeDistance: 500000,
    },
  ];

  const mockRouteData: RouteData = {
    polyline: [
      { latitude: 37.7749, longitude: -122.4194 },
      { latitude: 36.0, longitude: -120.0 },
      { latitude: 34.0522, longitude: -118.2437 },
    ],
    totalDistance: 500000,
    totalDuration: 18000,
    steps: mockSteps,
  };

  let setErrorMock: jest.Mock;
  let setLoadingMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    setErrorMock = jest.fn();
    setLoadingMock = jest.fn();
    (getGoogleMapsRoute as jest.Mock).mockResolvedValue(mockRouteData);
  });

  test('should not fetch route data when origin is null', async () => {
    renderHook(() =>
      useGoogleMapsRoute(
        null,
        mockDestination,
        mockTravelMode,
        mockNavigationState,
        setErrorMock,
        setLoadingMock
      )
    );

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(getGoogleMapsRoute).not.toHaveBeenCalled();
    expect(setLoadingMock).toHaveBeenCalledWith(false);
  });

  test('should not fetch route data when navigationState is default', async () => {
    renderHook(() =>
      useGoogleMapsRoute(
        mockOrigin,
        mockDestination,
        mockTravelMode,
        'default',
        setErrorMock,
        setLoadingMock
      )
    );

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(getGoogleMapsRoute).not.toHaveBeenCalled();
    expect(setLoadingMock).toHaveBeenCalledWith(false);
  });

  test('should not fetch route data when travelMode is SHUTTLE', async () => {
    renderHook(() =>
      useGoogleMapsRoute(
        mockOrigin,
        mockDestination,
        'SHUTTLE',
        mockNavigationState,
        setErrorMock,
        setLoadingMock
      )
    );

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(getGoogleMapsRoute).not.toHaveBeenCalled();
    expect(setLoadingMock).toHaveBeenCalledWith(false);
  });

  test('should fetch route data and set it when origin and destination are provided', async () => {
    const { result } = renderHook(() =>
      useGoogleMapsRoute(
        mockOrigin,
        mockDestination,
        mockTravelMode,
        mockNavigationState,
        setErrorMock,
        setLoadingMock
      )
    );

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(getGoogleMapsRoute).toHaveBeenCalledWith(
      mockOrigin,
      mockDestination,
      mockTravelMode
    );
    expect(result.current.routeData).toEqual(mockRouteData);
    expect(setErrorMock).toHaveBeenCalledWith(null);
    expect(setLoadingMock).toHaveBeenLastCalledWith(false);
  });

  test('should fit map to coordinates when navigationState is planning', async () => {
    renderHook(() =>
      useGoogleMapsRoute(
        mockOrigin,
        mockDestination,
        mockTravelMode,
        'planning',
        setErrorMock,
        setLoadingMock
      )
    );

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(mapRef.current?.fitToCoordinates).toHaveBeenCalledWith(
      mockRouteData.polyline,
      {
        edgePadding: { top: 120, right: 60, bottom: 120, left: 60 },
        animated: true,
      }
    );
  });

  test('should not fit map to coordinates when navigationState is navigating', async () => {
    renderHook(() =>
      useGoogleMapsRoute(
        mockOrigin,
        mockDestination,
        mockTravelMode,
        'navigating',
        setErrorMock,
        setLoadingMock
      )
    );

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(mapRef.current?.fitToCoordinates).not.toHaveBeenCalled();
  });

  test('should handle errors when fetching route data fails', async () => {
    const error = new Error('Network error');
    (getGoogleMapsRoute as jest.Mock).mockRejectedValue(error);

    const { result } = renderHook(() =>
      useGoogleMapsRoute(
        mockOrigin,
        mockDestination,
        mockTravelMode,
        mockNavigationState,
        setErrorMock,
        setLoadingMock
      )
    );

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.routeData).toBeNull();
    expect(setErrorMock).toHaveBeenCalledWith(error);
    expect(setLoadingMock).toHaveBeenLastCalledWith(false);
  });

  test('should update route data when setRouteData is called', async () => {
    const { result } = renderHook(() =>
      useGoogleMapsRoute(
        mockOrigin,
        mockDestination,
        mockTravelMode,
        mockNavigationState,
        setErrorMock,
        setLoadingMock
      )
    );

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    const newSteps: Step[] = [
      {
        startLocation: { latitude: 40.7128, longitude: -74.006 },
        endLocation: { latitude: 41.0, longitude: -75.0 },
        distance: 150000,
        duration: 5400,
        instruction: 'Head north on I-95',
        polyline: [
          { latitude: 40.7128, longitude: -74.006 },
          { latitude: 41.0, longitude: -75.0 },
        ],
        cumulativeDistance: 150000,
      },
      {
        startLocation: { latitude: 41.0, longitude: -75.0 },
        endLocation: { latitude: 42.3601, longitude: -71.0589 },
        distance: 150000,
        duration: 5400,
        instruction: 'Continue on I-95',
        polyline: [
          { latitude: 41.0, longitude: -75.0 },
          { latitude: 42.3601, longitude: -71.0589 },
        ],
        cumulativeDistance: 300000,
      },
    ];

    const newRouteData: RouteData = {
      polyline: [
        { latitude: 40.7128, longitude: -74.006 },
        { latitude: 41.0, longitude: -75.0 },
        { latitude: 42.3601, longitude: -71.0589 },
      ],
      totalDistance: 300000,
      totalDuration: 10800,
      steps: newSteps,
    };

    act(() => {
      result.current.setRouteData(newRouteData);
    });

    expect(result.current.routeData).toEqual(newRouteData);
  });

  test('should refetch route data when travelMode changes', async () => {
    const { rerender } = renderHook(
      ({ travelMode, destination }) =>
        useGoogleMapsRoute(
          mockOrigin,
          destination,
          travelMode,
          mockNavigationState,
          setErrorMock,
          setLoadingMock
        ),
      {
        initialProps: {
          travelMode: 'DRIVE' as TravelMode,
          destination: mockDestination,
        },
      }
    );

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(getGoogleMapsRoute).toHaveBeenCalledTimes(1);
    expect(getGoogleMapsRoute).toHaveBeenCalledWith(
      mockOrigin,
      mockDestination,
      'DRIVE'
    );
    expect(setLoadingMock).toHaveBeenLastCalledWith(false);

    jest.clearAllMocks();

    rerender({
      travelMode: 'WALK' as TravelMode,
      destination: { ...mockDestination },
    });

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(getGoogleMapsRoute).toHaveBeenCalledTimes(1);
    expect(getGoogleMapsRoute).toHaveBeenCalledWith(
      mockOrigin,
      expect.objectContaining({
        latitude: mockDestination.latitude,
        longitude: mockDestination.longitude,
      }),
      'WALK'
    );
    expect(setLoadingMock).toHaveBeenLastCalledWith(false);
  });

  test('should refetch route data when destination changes', async () => {
    const { rerender } = renderHook(
      ({ destination, travelMode }) =>
        useGoogleMapsRoute(
          mockOrigin,
          destination,
          travelMode,
          mockNavigationState,
          setErrorMock,
          setLoadingMock
        ),
      {
        initialProps: {
          destination: mockDestination,
          travelMode: mockTravelMode,
        },
      }
    );

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(getGoogleMapsRoute).toHaveBeenCalledTimes(1);

    jest.clearAllMocks();

    const newDestination = { latitude: 40.7128, longitude: -74.006 };
    rerender({
      destination: newDestination,
      travelMode: mockTravelMode,
    });

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(getGoogleMapsRoute).toHaveBeenCalledTimes(1);
    expect(getGoogleMapsRoute).toHaveBeenCalledWith(
      mockOrigin,
      newDestination,
      mockTravelMode
    );
    expect(setLoadingMock).toHaveBeenLastCalledWith(false);
  });
});
