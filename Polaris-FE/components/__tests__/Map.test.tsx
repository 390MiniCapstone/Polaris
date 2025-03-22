import React from 'react';
import { render } from '@testing-library/react-native';
import { Geojson } from 'react-native-maps';
import { MapComponent } from '@/components/Map';
import { useCurrentBuilding } from '@/hooks/useCurrentBuilding';
import { useNavigation } from '@/contexts/NavigationContext/NavigationContext';
import { themes } from '@/utils/themeOptions';

jest.mock('@/hooks/useCurrentBuilding', () => ({
  useCurrentBuilding: jest.fn(),
}));
jest.mock('@/contexts/NavigationContext/NavigationContext', () => ({
  useNavigation: jest.fn(),
}));

jest.mock('@/components/Buildings/Buildings', () => ({
  Buildings: () => {
    const React = require('react');
    const { View } = require('react-native');
    return <View testID="buildings" />;
  },
}));
jest.mock('@/components/Navigation/Navigation', () => ({
  Navigation: () => {
    const React = require('react');
    const { View } = require('react-native');
    return <View testID="navigation" />;
  },
}));
jest.mock('@/components/Navigation/NavigationPolyline', () => ({
  NavigationPolyline: () => {
    const React = require('react');
    const { View } = require('react-native');
    return <View testID="navigation-polyline" />;
  },
}));

jest.mock('react-native-maps', () => {
  const React = require('react');
  const { View } = require('react-native');
  const MockMapView = React.forwardRef((props: any, ref: any) => (
    <View {...props} ref={ref} testID="map-view">
      {props.children}
    </View>
  ));
  const MockGeojson = (props: any) => <View {...props} />;
  return {
    __esModule: true,
    default: MockMapView,
    Geojson: MockGeojson,
  };
});

describe('MapComponent', () => {
  const setRegionMock = jest.fn();
  const fakeRegion = {
    latitude: 10,
    longitude: 20,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useCurrentBuilding as jest.Mock).mockReturnValue(null);
    (useNavigation as jest.Mock).mockReturnValue({
      navigationState: 'default',
    });
  });

  it('renders MapView with correct props', () => {
    const { getByTestId } = render(
      <MapComponent region={fakeRegion} setRegion={setRegionMock} />
    );
    const mapView = getByTestId('map-view');

    expect(mapView).toBeTruthy();
    expect(mapView.props.initialRegion).toEqual(fakeRegion);
    expect(mapView.props.onRegionChangeComplete).toBe(setRegionMock);
    expect(mapView.props.showsUserLocation).toBe(true);
    expect(mapView.props.compassOffset).toEqual({ x: -10, y: 90 });
    expect(mapView.props.tintColor).toBe('#A83B4A');
    expect(mapView.props.userLocationCalloutEnabled).toBe(true);
    expect(mapView.props.showsPointsOfInterest).toBe(true);
    expect(mapView.props.showsTraffic).toBe(false);
  });

  it('renders two Geojson layers for downtown and loyola buildings', () => {
    const { UNSAFE_getAllByType } = render(
      <MapComponent region={fakeRegion} setRegion={setRegionMock} />
    );
    const geojsons = UNSAFE_getAllByType(Geojson);
    const buildingGeojsons = geojsons.filter(
      g => g.props.fillColor === themes.default.colors.primary //theme.colors.primary
    );
    expect(buildingGeojsons.length).toBe(2);
  });

  it('renders NavigationPolyline, Buildings, and Navigation components', () => {
    const { getByTestId } = render(
      <MapComponent region={fakeRegion} setRegion={setRegionMock} />
    );
    expect(getByTestId('navigation-polyline')).toBeTruthy();
    expect(getByTestId('buildings')).toBeTruthy();
    expect(getByTestId('navigation')).toBeTruthy();
  });

  it('renders current building Geojson when currentBuilding exists', () => {
    const fakeBuilding = {
      geometry: {
        coordinates: [
          [
            [1, 2],
            [3, 4],
            [5, 6],
            [1, 2],
          ],
        ],
      },
    };
    (useCurrentBuilding as jest.Mock).mockReturnValue(fakeBuilding);

    const { UNSAFE_getAllByType } = render(
      <MapComponent region={fakeRegion} setRegion={setRegionMock} />
    );
    const geojsons = UNSAFE_getAllByType(Geojson);
    const currentBuildingGeojson = geojsons.find(
      g =>
        g.props.fillColor === themes.default.colors.currentBuildingFillColor &&
        g.props.strokeColor ===
          themes.default.colors.currentBuildingStrokeColor &&
        g.props.strokeWidth === 3
    );
    expect(currentBuildingGeojson).toBeTruthy();
  });

  it('shows traffic when navigationState is "navigating"', () => {
    (useNavigation as jest.Mock).mockReturnValue({
      navigationState: 'navigating',
    });
    const { getByTestId } = render(
      <MapComponent region={fakeRegion} setRegion={setRegionMock} />
    );
    const mapView = getByTestId('map-view');
    expect(mapView.props.showsTraffic).toBe(true);
  });
});
