import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationPolyline } from '@/components/Navigation/NavigationPolyline';
import { useNavigation } from '@/contexts/NavigationContext/NavigationContext';

jest.mock('@/contexts/NavigationContext/NavigationContext', () => ({
  useNavigation: jest.fn(),
}));

jest.mock('react-native-maps', () => {
  const { View } = require('react-native');
  return {
    Marker: (props: any) => <View testID="marker" {...props} />,
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

afterEach(() => {
  jest.clearAllMocks();
});

describe('NavigationPolyline Component', () => {
  const destination = { latitude: 10, longitude: 20 };
  const snappedPoint = { latitude: 10, longitude: 20 };
  const clippedPolyline = [
    { latitude: 10, longitude: 20 },
    { latitude: 30, longitude: 40 },
  ];

  it('should not render anything if navigationState is not "planning" or "navigating"', () => {
    (useNavigation as jest.Mock).mockReturnValue({
      navigationState: 'default',
      travelMode: 'WALK',
      destination,
      snappedPoint,
      clippedPolyline,
    });
    const { queryByTestId } = render(<NavigationPolyline />);
    expect(queryByTestId('marker')).toBeNull();
    expect(queryByTestId('polyline')).toBeNull();
  });

  it('should not render anything if clippedPolyline is missing', () => {
    (useNavigation as jest.Mock).mockReturnValue({
      navigationState: 'planning',
      travelMode: 'WALK',
      destination,
      snappedPoint,
      clippedPolyline: null,
    });
    const { queryByTestId } = render(<NavigationPolyline />);
    expect(queryByTestId('marker')).toBeNull();
    expect(queryByTestId('polyline')).toBeNull();
  });

  it('should not render anything if snappedPoint is missing', () => {
    (useNavigation as jest.Mock).mockReturnValue({
      navigationState: 'planning',
      travelMode: 'WALK',
      destination,
      snappedPoint: null,
      clippedPolyline,
    });
    const { queryByTestId } = render(<NavigationPolyline />);
    expect(queryByTestId('marker')).toBeNull();
    expect(queryByTestId('polyline')).toBeNull();
  });

  it('should render a Marker and a dashed Polyline when travelMode is "WALK"', () => {
    (useNavigation as jest.Mock).mockReturnValue({
      navigationState: 'planning',
      travelMode: 'WALK',
      destination,
      snappedPoint,
      clippedPolyline,
    });
    const { getByTestId, getAllByTestId } = render(<NavigationPolyline />);

    expect(getByTestId('marker')).toBeTruthy();

    const polylineElements = getAllByTestId('polyline');
    expect(polylineElements).toHaveLength(1);
    expect(polylineElements[0].props.strokeWidth).toBe(4);
    expect(polylineElements[0].props.strokeColor).toBe(
      mockTheme.colors.primary
    );
    expect(polylineElements[0].props.lineDashPattern).toEqual([5, 10]);
  });

  it('should render a Marker and two Polylines when travelMode is not "WALK"', () => {
    (useNavigation as jest.Mock).mockReturnValue({
      navigationState: 'planning',
      travelMode: 'DRIVE',
      destination,
      snappedPoint,
      clippedPolyline,
    });
    const { getByTestId, getAllByTestId } = render(<NavigationPolyline />);

    expect(getByTestId('marker')).toBeTruthy();

    const polylineElements = getAllByTestId('polyline');
    expect(polylineElements).toHaveLength(2);

    expect(polylineElements[0].props.strokeWidth).toBe(9);
    expect(polylineElements[0].props.strokeColor).toBe(
      mockTheme.colors.primary
    );

    expect(polylineElements[1].props.strokeWidth).toBe(6);
    expect(polylineElements[1].props.strokeColor).toBe(
      mockTheme.colors.secondary
    );
  });
});
