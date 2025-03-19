import { renderHook } from '@testing-library/react-hooks';
import { useCurrentBuilding } from '../useCurrentBuilding';
import { downtownBuildings } from '../../constants/buildings';

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

    const expectedBuilding = downtownBuildings.features[12];

    expect(result.current).toEqual(expectedBuilding);
  });

  it('should return the correct building for another given location', () => {
    const mockLocation = { latitude: '45.497050', longitude: '-73.578009' };
    jest
      .spyOn(require('../useMapLocation'), 'useMapLocation')
      .mockReturnValue({ location: mockLocation });

    const { result } = renderHook(() => useCurrentBuilding());

    const expectedBuilding = downtownBuildings.features[14];

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

  it('should return the correct building for a boundary location', () => {
    const mockLocation = { latitude: '45.495413', longitude: '-73.579399' };
    jest
      .spyOn(require('../useMapLocation'), 'useMapLocation')
      .mockReturnValue({ location: mockLocation });

    const { result } = renderHook(() => useCurrentBuilding());

    const expectedBuilding = downtownBuildings.features[1];

    expect(result.current).toEqual(expectedBuilding);
  });

  it('should handle invalid coordinates gracefully', () => {
    const mockLocation = { latitude: 'invalid', longitude: 'invalid' };
    jest
      .spyOn(require('../useMapLocation'), 'useMapLocation')
      .mockReturnValue({ location: mockLocation });

    const { result } = renderHook(() => useCurrentBuilding());

    expect(result.current).toBeNull();
  });

  it('should handle null location input', () => {
    jest
      .spyOn(require('../useMapLocation'), 'useMapLocation')
      .mockReturnValue({ location: null });

    const { result } = renderHook(() => useCurrentBuilding());

    expect(result.current).toBeNull();
  });
});
