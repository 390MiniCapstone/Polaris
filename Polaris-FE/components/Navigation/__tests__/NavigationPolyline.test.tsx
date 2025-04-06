import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationPolyline } from '@/components/Navigation/NavigationPolyline';
import { useNavigation } from '@/contexts/NavigationContext/NavigationContext';

// Mocks
jest.mock('@/contexts/NavigationContext/NavigationContext', () => ({
  useNavigation: jest.fn(),
}));

jest.mock('react-native-maps', () => {
  const { View } = require('react-native');
  return {
    Polyline: (props: any) => <View testID="polyline" {...props} />,
  };
});

const mockTheme = {
  colors: {
    primary: '#000000',
    secondary: '#FFFFFF',
  },
};

jest.mock('@/hooks/useTheme', () => ({
  __esModule: true,
  default: () => ({
    theme: mockTheme,
    setTheme: jest.fn(),
  }),
}));

describe('NavigationPolyline', () => {
  const destination = { latitude: 10, longitude: 20 };
  const snappedPoint = { latitude: 10, longitude: 20 };
  const clippedPolyline = [
    { latitude: 10, longitude: 20 },
    { latitude: 30, longitude: 40 },
  ];

  const mockUseNavigation = (override = {}) => {
    (useNavigation as jest.Mock).mockReturnValue({
      navigationState: 'planning',
      travelMode: 'WALK',
      destination,
      snappedPoint,
      clippedPolyline,
      shuttleData: null,
      nextDeparture: null,
      ...override,
    });
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Common rendering checks', () => {
    it('does not render if navigationState is not planning or navigating', () => {
      mockUseNavigation({ navigationState: 'default' });
      const { queryAllByTestId } = render(<NavigationPolyline />);
      expect(queryAllByTestId('polyline')).toHaveLength(0);
    });

    it('does not render if clippedPolyline is missing', () => {
      mockUseNavigation({ clippedPolyline: null });
      const { queryAllByTestId } = render(<NavigationPolyline />);
      expect(queryAllByTestId('polyline')).toHaveLength(0);
    });

    it('does not render if snappedPoint is missing', () => {
      mockUseNavigation({ snappedPoint: null });
      const { queryAllByTestId } = render(<NavigationPolyline />);
      expect(queryAllByTestId('polyline')).toHaveLength(0);
    });

    it('does not render if destination is missing', () => {
      mockUseNavigation({ destination: null });
      const { queryAllByTestId } = render(<NavigationPolyline />);
      expect(queryAllByTestId('polyline')).toHaveLength(0);
    });
  });

  describe('Travel mode specific behavior', () => {
    it('renders a dashed polyline when travelMode is WALK', () => {
      mockUseNavigation({ travelMode: 'WALK' });
      const { getAllByTestId } = render(<NavigationPolyline />);
      const polylines = getAllByTestId('polyline');
      expect(polylines).toHaveLength(1);
      expect(polylines[0].props.strokeWidth).toBe(4);
      expect(polylines[0].props.strokeColor).toBe(mockTheme.colors.primary);
      expect(polylines[0].props.lineDashPattern).toEqual([5, 10]);
    });

    it('renders two polylines when travelMode is DRIVE', () => {
      mockUseNavigation({ travelMode: 'DRIVE' });
      const { getAllByTestId } = render(<NavigationPolyline />);
      const polylines = getAllByTestId('polyline');
      expect(polylines).toHaveLength(2);
      expect(polylines[0].props.strokeWidth).toBe(9);
      expect(polylines[0].props.strokeColor).toBe(mockTheme.colors.primary);
      expect(polylines[1].props.strokeWidth).toBe(6);
      expect(polylines[1].props.strokeColor).toBe(mockTheme.colors.secondary);
    });

    it('renders 4 polylines for SHUTTLE mode if shuttle data exists', () => {
      mockUseNavigation({
        travelMode: 'SHUTTLE',
        nextDeparture: '12:00',
        shuttleData: {
          legOne: { polyline: clippedPolyline },
          legTwo: { busData: { polyline: clippedPolyline } },
          legThree: { polyline: clippedPolyline },
        },
      });
      const { getAllByTestId } = render(<NavigationPolyline />);
      const polylines = getAllByTestId('polyline');
      expect(polylines).toHaveLength(4);
      expect(polylines[0].props.lineDashPattern).toEqual([5, 10]);
      expect(polylines[1].props.strokeWidth).toBe(9);
      expect(polylines[2].props.strokeWidth).toBe(6);
      expect(polylines[3].props.lineDashPattern).toEqual([5, 10]);
    });

    it('does not render polylines for SHUTTLE if data is incomplete', () => {
      mockUseNavigation({
        travelMode: 'SHUTTLE',
        nextDeparture: null,
        shuttleData: null,
      });
      const { queryAllByTestId } = render(<NavigationPolyline />);
      expect(queryAllByTestId('polyline')).toHaveLength(0);
    });
  });
});
