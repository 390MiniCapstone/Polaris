jest.mock('react-native-maps', () => {
  const { View } = require('react-native');

  const MockMapView = (props: any) => <View {...props} />;
  const MockMarker = (props: any) => <View {...props} />;
  const MockPolyline = (props: any) => <View {...props} />;

  return {
    __esModule: true,
    default: MockMapView,
    Marker: MockMarker,
    Polyline: MockPolyline,
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

import {render} from '@testing-library/react-native';
import {Marker, Polyline} from 'react-native-maps';
import {NavigationPolyline} from '@/components/Navigation/NavigationPolyline';

describe('NavigationPolyline Component', () => {
  const destination = { latitude: 10, longitude: 20 };
  const samplePolyline = [
    { latitude: 10, longitude: 20 },
    { latitude: 15, longitude: 25 },
  ];
  const snappedPoint = { latitude: 10, longitude: 20 };

  it('renders nothing when navigationState is not "planning" or "navigating"', () => {
    const { toJSON } = render(
      <NavigationPolyline
        navigationState="idle"
        destination={destination}
        travelMode="WALK"
        clippedPolyline={samplePolyline}
        snappedPoint={snappedPoint}
      />
    );
    expect(toJSON()).toBeNull();
  });

  it('renders nothing when clippedPolyline is null', () => {
    const { toJSON } = render(
      <NavigationPolyline
        navigationState="planning"
        destination={destination}
        travelMode="WALK"
        clippedPolyline={null}
        snappedPoint={snappedPoint}
      />
    );
    expect(toJSON()).toBeNull();
  });

  it('renders nothing when snappedPoint is null', () => {
    const { toJSON } = render(
      <NavigationPolyline
        navigationState="planning"
        destination={destination}
        travelMode="WALK"
        clippedPolyline={samplePolyline}
        snappedPoint={null}
      />
    );
    expect(toJSON()).toBeNull();
  });

  it('renders Marker and one dashed Polyline for WALK mode', () => {
    const { UNSAFE_getAllByType } = render(
      <NavigationPolyline
        navigationState="planning"
        destination={destination}
        travelMode="WALK"
        clippedPolyline={samplePolyline}
        snappedPoint={snappedPoint}
      />
    );

    const markers = UNSAFE_getAllByType(Marker);
    expect(markers).toHaveLength(1);
    const marker = markers[0];
    expect(marker.props.coordinate).toEqual(destination);
    expect(marker.props.pinColor).toBe(mockTheme.colors.primary);

    const polylines = UNSAFE_getAllByType(Polyline);
    expect(polylines).toHaveLength(1);

    const polyline = polylines[0];
    expect(polyline.props.coordinates).toEqual(samplePolyline);
    expect(polyline.props.strokeWidth).toBe(4);
    expect(polyline.props.strokeColor).toBe(mockTheme.colors.secondary);
    expect(polyline.props.lineDashPattern).toEqual([5, 10]);
  });

  it('renders Marker and two Polylines for non-WALK modes', () => {
    const { UNSAFE_getAllByType } = render(
      <NavigationPolyline
        navigationState="navigating"
        destination={destination}
        travelMode="DRIVE"
        clippedPolyline={samplePolyline}
        snappedPoint={snappedPoint}
      />
    );

    const markers = UNSAFE_getAllByType(Marker);
    expect(markers).toHaveLength(1);
    const marker = markers[0];
    expect(marker.props.coordinate).toEqual(destination);
    expect(marker.props.pinColor).toBe(mockTheme.colors.primary);

    const polylines = UNSAFE_getAllByType(Polyline);
    expect(polylines).toHaveLength(2);

    const firstPolyline = polylines[0];
    expect(firstPolyline.props.coordinates).toEqual(samplePolyline);
    expect(firstPolyline.props.strokeWidth).toBe(9);
    expect(firstPolyline.props.strokeColor).toBe(mockTheme.colors.primary);

    const secondPolyline = polylines[1];
    expect(secondPolyline.props.coordinates).toEqual(samplePolyline);
    expect(secondPolyline.props.strokeWidth).toBe(6);
    expect(secondPolyline.props.strokeColor).toBe(mockTheme.colors.secondary);
  });
});
