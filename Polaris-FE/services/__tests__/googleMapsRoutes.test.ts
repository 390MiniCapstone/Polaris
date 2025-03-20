import { getGoogleMapsRoute } from '@/services/googleMapsRoutes';
import polyline from '@mapbox/polyline';

jest.mock('@mapbox/polyline', () => ({
  decode: jest.fn(),
}));

jest.mock('expo-constants', () => ({
  expoConfig: {
    extra: {
      googleMapsApiKey: 'FAKE_KEY',
    },
  },
}));

global.fetch = jest.fn();

describe('getGoogleMapsRoute', () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('returns route data for a valid API response', async () => {
    const fakeResponse = {
      routes: [
        {
          polyline: { encodedPolyline: 'encodedFullPolyline' },
          legs: [
            {
              polyline: { encodedPolyline: 'encodedLegPolyline' },
              steps: [
                {
                  startLocation: { latLng: { latitude: 10, longitude: 20 } },
                  endLocation: { latLng: { latitude: 30, longitude: 40 } },
                  distanceMeters: 100,
                  staticDuration: '120s',
                  polyline: { encodedPolyline: 'encodedStepPolyline' },
                  navigationInstruction: { instructions: 'Turn right' },
                },
              ],
            },
          ],
          distanceMeters: 500,
          duration: '300s',
        },
      ],
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      json: () => Promise.resolve(fakeResponse),
    });

    (polyline.decode as jest.Mock)
      .mockImplementationOnce((encoded: string) => {
        expect(encoded).toBe('encodedFullPolyline');
        return [
          [10, 20],
          [30, 40],
        ];
      })
      .mockImplementationOnce((encoded: string) => {
        expect(encoded).toBe('encodedStepPolyline');
        return [
          [10, 20],
          [30, 40],
        ];
      });

    const origin = { latitude: 1, longitude: 2 };
    const destination = { latitude: 3, longitude: 4 };
    const travelMode: 'DRIVE' = 'DRIVE';

    const routeData = await getGoogleMapsRoute(origin, destination, travelMode);

    expect(routeData.totalDistance).toEqual(500);
    expect(routeData.totalDuration).toEqual('300');
    expect(routeData.polyline).toEqual([
      { latitude: 10, longitude: 20 },
      { latitude: 30, longitude: 40 },
    ]);
    expect(routeData.steps.length).toBe(1);

    const step = routeData.steps[0];
    expect(step.distance).toEqual(100);
    expect(step.duration).toEqual('120');
    expect(step.instruction).toEqual('Turn right');
    expect(step.cumulativeDistance).toEqual(100);
    expect(step.polyline).toEqual([
      { latitude: 10, longitude: 20 },
      { latitude: 30, longitude: 40 },
    ]);
  });

  it('throws an error when no routes are found', async () => {
    const fakeResponse = { routes: [] };
    (global.fetch as jest.Mock).mockResolvedValue({
      json: () => Promise.resolve(fakeResponse),
    });

    await expect(
      getGoogleMapsRoute(
        { latitude: 1, longitude: 2 },
        { latitude: 3, longitude: 4 },
        'WALK'
      )
    ).rejects.toThrow('No routes found in the response.');
  });

  it('throws an error when no polyline is provided in route or leg', async () => {
    const fakeResponse = {
      routes: [
        {
          legs: [
            {
              steps: [
                {
                  startLocation: { latLng: { latitude: 10, longitude: 20 } },
                  endLocation: { latLng: { latitude: 30, longitude: 40 } },
                  distanceMeters: 100,
                  staticDuration: '120s',
                  polyline: { encodedPolyline: 'encodedStepPolyline' },
                  navigationInstruction: { instructions: 'Turn right' },
                },
              ],
            },
          ],
          distanceMeters: 500,
          duration: '300s',
        },
      ],
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      json: () => Promise.resolve(fakeResponse),
    });

    await expect(
      getGoogleMapsRoute(
        { latitude: 1, longitude: 2 },
        { latitude: 3, longitude: 4 },
        'DRIVE'
      )
    ).rejects.toThrow('No polyline provided in route or leg.');
  });

  it('propagates errors from the fetch call', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    await expect(
      getGoogleMapsRoute(
        { latitude: 1, longitude: 2 },
        { latitude: 3, longitude: 4 },
        'BICYCLE'
      )
    ).rejects.toThrow('Network error');
  });

  it('includes routingPreference for DRIVE mode', async () => {
    const fakeResponse = {
      routes: [
        {
          polyline: { encodedPolyline: 'encodedFullPolyline' },
          legs: [
            {
              polyline: { encodedPolyline: 'encodedLegPolyline' },
              steps: [
                {
                  startLocation: { latLng: { latitude: 10, longitude: 20 } },
                  endLocation: { latLng: { latitude: 30, longitude: 40 } },
                  distanceMeters: 100,
                  staticDuration: '120s',
                  polyline: { encodedPolyline: 'encodedStepPolyline' },
                  navigationInstruction: { instructions: 'Turn right' },
                },
              ],
            },
          ],
          distanceMeters: 500,
          duration: '300s',
        },
      ],
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      json: () => Promise.resolve(fakeResponse),
    });

    (polyline.decode as jest.Mock)
      .mockImplementationOnce(() => [
        [10, 20],
        [30, 40],
      ])
      .mockImplementationOnce(() => [
        [10, 20],
        [30, 40],
      ]);

    const origin = { latitude: 1, longitude: 2 };
    const destination = { latitude: 3, longitude: 4 };

    await getGoogleMapsRoute(origin, destination, 'DRIVE');

    expect(global.fetch).toHaveBeenCalled();
    const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
    const requestBody = JSON.parse(fetchCall[1].body);
    expect(requestBody.routingPreference).toEqual('TRAFFIC_AWARE');
  });

  it('does not include routingPreference for non-DRIVE modes', async () => {
    const fakeResponse = {
      routes: [
        {
          polyline: { encodedPolyline: 'encodedFullPolyline' },
          legs: [
            {
              polyline: { encodedPolyline: 'encodedLegPolyline' },
              steps: [
                {
                  startLocation: { latLng: { latitude: 10, longitude: 20 } },
                  endLocation: { latLng: { latitude: 30, longitude: 40 } },
                  distanceMeters: 100,
                  staticDuration: '120s',
                  polyline: { encodedPolyline: 'encodedStepPolyline' },
                  navigationInstruction: { instructions: 'Turn right' },
                },
              ],
            },
          ],
          distanceMeters: 500,
          duration: '300s',
        },
      ],
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      json: () => Promise.resolve(fakeResponse),
    });

    (polyline.decode as jest.Mock)
      .mockImplementationOnce(() => [
        [10, 20],
        [30, 40],
      ])
      .mockImplementationOnce(() => [
        [10, 20],
        [30, 40],
      ]);

    const origin = { latitude: 1, longitude: 2 };
    const destination = { latitude: 3, longitude: 4 };

    await getGoogleMapsRoute(origin, destination, 'WALK');

    const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
    const requestBody = JSON.parse(fetchCall[1].body);
    expect(requestBody.routingPreference).toBeUndefined();
  });
});
