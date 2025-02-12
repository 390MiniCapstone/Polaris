import { renderHook } from '@testing-library/react-hooks';
import { useCurrentBuilding } from '../useCurrentBuilding';

describe('useCurrentBuilding', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return the correct building for a given location', () => {
    const mockLocation = { latitude: '45.497092', longitude: '-73.578800' };
    jest
      .spyOn(require('../useMapLocation'), 'useMapLocation')
      .mockReturnValue({ location: mockLocation });

    const { result } = renderHook(() => useCurrentBuilding());

    const expectedBuilding = {
      type: 'Feature',
      properties: {
        name: 'Henry F. Hall Building',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-73.5788241, 45.4968261],
            [-73.5786245, 45.4970373],
            [-73.5784089, 45.4972544],
            [-73.5782927, 45.4973714],
            [-73.578399, 45.4974227],
            [-73.5785783, 45.4975092],
            [-73.5790075, 45.4977164],
            [-73.5790121, 45.497713],
            [-73.579269, 45.4974475],
            [-73.5795378, 45.4971739],
            [-73.5795431, 45.4971671],
            [-73.5794591, 45.497128],
            [-73.5788241, 45.4968261],
          ],
        ],
      },
    };

    expect(result.current).toEqual(expectedBuilding);
  });

  it('should return the correct building for another given location', () => {
    const mockLocation = { latitude: '45.497050', longitude: '-73.578009' };
    jest
      .spyOn(require('../useMapLocation'), 'useMapLocation')
      .mockReturnValue({ location: mockLocation });

    const { result } = renderHook(() => useCurrentBuilding());

    const expectedBuilding = {
      type: 'Feature',
      properties: {
        name: 'J. W. McConnell Building (Library Building)',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-73.5785573, 45.4966595],
            [-73.5782102, 45.4964933],
            [-73.57774, 45.4962682],
            [-73.5776884, 45.4962438],
            [-73.5774775, 45.4964601],
            [-73.5774533, 45.4964854],
            [-73.5776244, 45.4965695],
            [-73.5776438, 45.4965785],
            [-73.5776912, 45.4966005],
            [-73.5776683, 45.4966303],
            [-73.5776483, 45.4966522],
            [-73.5776045, 45.496632],
            [-73.5775774, 45.4966195],
            [-73.5775555, 45.4966092],
            [-73.5772806, 45.4968912],
            [-73.5773036, 45.4969031],
            [-73.577393, 45.4969457],
            [-73.5775784, 45.4970355],
            [-73.5777573, 45.4971222],
            [-73.577856, 45.49717],
            [-73.5780094, 45.4972443],
            [-73.578045, 45.4972616],
            [-73.578317, 45.4969852],
            [-73.5782783, 45.4969634],
            [-73.5783211, 45.4969052],
            [-73.5783716, 45.4969277],
            [-73.5785731, 45.496716],
            [-73.578525, 45.4966932],
            [-73.5785573, 45.4966595],
          ],
        ],
      },
    };

    expect(result.current).toEqual(expectedBuilding);
  });

  it('should return null if the location is outside any building', () => {
    const mockLocation = { latitude: 0, longitude: 0 };
    jest
      .spyOn(require('../useMapLocation'), 'useMapLocation')
      .mockReturnValue({ location: mockLocation });

    const { result } = renderHook(() => useCurrentBuilding());

    expect(result.current).toBeNull();
  });
});
