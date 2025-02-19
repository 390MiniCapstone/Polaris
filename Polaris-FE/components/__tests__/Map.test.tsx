import React from 'react';
import { render, act } from '@testing-library/react-native';
import { MapComponent } from '@/components/Map';

jest.mock('react-native-maps', () => {
  const React = require('react');
  const { View } = require('react-native');

  const MockMapView = React.forwardRef((props: any, ref: any) => (
    <View {...props} ref={ref} testID="map-view">
      {props.children}
    </View>
  ));

  const MockGeojson = React.forwardRef((props: any, ref: any) => (
    <View {...props} ref={ref} testID="geojson">
      {props.children}
    </View>
  ));

  return {
    __esModule: true,
    default: MockMapView,
    Geojson: MockGeojson,
  };
});

jest.mock('@/components/Navigation/Navigation', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    Navigation: () => <View testID="navigation" />,
  };
});

jest.mock('@/components/Navigation/NavigationPolyline', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    NavigationPolyline: () => <View testID="navigation-polyline" />,
  };
});

jest.mock('@/components/Buildings/Buildings', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    Buildings: () => <View testID="buildings" />,
  };
});

describe('MapComponent', () => {
  const initialRegion = {
    latitude: 37.39223512591287,
    longitude: -122.16990035825833,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  };

  it('renders MapView and its child components', () => {
    const setRegion = jest.fn();

    const { getByTestId, getAllByTestId } = render(
      <MapComponent region={initialRegion} setRegion={setRegion} />
    );

    expect(getByTestId('map-view')).toBeTruthy();

    const geojsonElements = getAllByTestId('geojson');
    expect(geojsonElements.length).toBeGreaterThan(0);

    expect(getByTestId('navigation-polyline')).toBeTruthy();
    expect(getByTestId('buildings')).toBeTruthy();
    expect(getByTestId('navigation')).toBeTruthy();
  });

  it('calls setRegion when MapView region changes', async () => {
    const setRegion = jest.fn();

    const { getByTestId } = render(
      <MapComponent region={initialRegion} setRegion={setRegion} />
    );

    const mapView = getByTestId('map-view');

    await act(async () => {
      mapView.props.onRegionChangeComplete({
        ...initialRegion,
        latitude: initialRegion.latitude + 0.01,
        longitude: initialRegion.longitude + 0.01,
      });
    });

    expect(setRegion).toHaveBeenCalledWith({
      ...initialRegion,
      latitude: initialRegion.latitude + 0.01,
      longitude: initialRegion.longitude + 0.01,
    });
  });
});
