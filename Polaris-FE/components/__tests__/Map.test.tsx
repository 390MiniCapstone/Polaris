import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import MapView from 'react-native-maps';
import { MapComponent } from '@/components/Map';

// Mock required props
const mockSetRegion = jest.fn();
const mockRegion = {
  latitude: 45.4959332,
  longitude: -73.578441,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};
const mockMapRef: React.RefObject<MapView> = React.createRef<MapView>();

describe('MapComponent', () => {
  test('renders MapView component', () => {
    const { getByTestId } = render(
      <MapComponent
        mapRef={mockMapRef}
        region={mockRegion}
        setRegion={mockSetRegion}
      />
    );
    expect(getByTestId('map-view')).toBeTruthy();
  });

  test('calls setRegion when map region changes', () => {
    const { getByTestId } = render(
      <MapComponent
        mapRef={mockMapRef}
        region={mockRegion}
        setRegion={mockSetRegion}
      />
    );

    fireEvent(getByTestId('map-view'), 'onRegionChangeComplete', mockRegion);
    expect(mockSetRegion).toHaveBeenCalledWith(mockRegion);
  });

  test('assigns mapRef correctly', () => {
    render(
      <MapComponent
        mapRef={mockMapRef}
        region={mockRegion}
        setRegion={mockSetRegion}
      />
    );
    expect(mockMapRef.current).toBeInstanceOf(MapView);
  });
});
