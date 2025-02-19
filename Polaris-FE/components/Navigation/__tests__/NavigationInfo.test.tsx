jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { View } = require('react-native');
  const MockIcon = (props: any) => <View {...props} />;
  return {
    __esModule: true,
    FontAwesome5: MockIcon,
  };
});

jest.mock('expo-font', () => ({
  loadAsync: jest.fn(),
  isLoaded: jest.fn(() => true),
}));

jest.mock('@/hooks/useMapLocation', () => ({
  useMapLocation: () => ({
    location: { latitude: 30, longitude: 40 },
  }),
}));

jest.mock('@/utils/mapHandlers', () => ({
  handleCurrentLocation: jest.fn(),
}));

jest.mock('@/utils/navigationUtils', () => ({
  openTransitInMaps: jest.fn(),
}));

jest.mock('@/utils/refs', () => ({
  mapRef: {},
}));

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NavigationInfo } from '@/components/Navigation/NavigationInfo';
import { handleCurrentLocation } from '@/utils/mapHandlers';
import { openTransitInMaps } from '@/utils/navigationUtils';

describe('NavigationInfo Component', () => {
  const defaultProps = {
    duration: 300,
    distance: 1500,
    isNavigating: false,
    is3d: false,
    transportMode: 'DRIVE',
    destination: { latitude: 10, longitude: 20 },
    onCancel: jest.fn(),
    onStartNavigation: jest.fn(),
    updateIs3d: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders cancel button, info texts, and GO button when not navigating', () => {
    const { getByText, getByTestId } = render(
      <NavigationInfo {...defaultProps} />
    );

    expect(getByTestId('cancel-button')).toBeTruthy();
    expect(getByTestId('action-button')).toBeTruthy();

    expect(getByText('5 Minutes')).toBeTruthy();
    expect(getByText('·')).toBeTruthy();
    expect(getByText('1.5 km')).toBeTruthy();
    expect(getByText('GO')).toBeTruthy();
  });

  it('calls onCancel when cancel button is pressed', () => {
    const { getByTestId } = render(<NavigationInfo {...defaultProps} />);
    fireEvent.press(getByTestId('cancel-button'));
    expect(defaultProps.onCancel).toHaveBeenCalled();
  });

  it('calls openTransitInMaps when not navigating, transportMode is TRANSIT, and location exists', () => {
    const props = { ...defaultProps, transportMode: 'TRANSIT' };
    const { getByTestId } = render(<NavigationInfo {...props} />);
    fireEvent.press(getByTestId('action-button'));

    expect(openTransitInMaps).toHaveBeenCalledWith(
      { latitude: 30, longitude: 40 },
      props.destination
    );
    expect(props.onStartNavigation).not.toHaveBeenCalled();
  });

  it('calls onStartNavigation when not navigating and transportMode is not TRANSIT', () => {
    const props = { ...defaultProps, transportMode: 'DRIVE' };
    const { getByTestId } = render(<NavigationInfo {...props} />);
    fireEvent.press(getByTestId('action-button'));

    expect(props.onStartNavigation).toHaveBeenCalled();
    expect(openTransitInMaps).not.toHaveBeenCalled();
  });

  it('calls handleCurrentLocation and updateIs3d(false) when navigating and is3d is true', () => {
    const props = { ...defaultProps, isNavigating: true, is3d: true };
    const { getByTestId } = render(<NavigationInfo {...props} />);
    fireEvent.press(getByTestId('action-button'));

    expect(handleCurrentLocation).toHaveBeenCalledWith(expect.any(Object), {
      latitude: 30,
      longitude: 40,
    });
    expect(props.updateIs3d).toHaveBeenCalledWith(false);
    expect(props.onStartNavigation).not.toHaveBeenCalled();
  });

  it('calls onStartNavigation and updateIs3d(true) when navigating and is3d is false', () => {
    const props = { ...defaultProps, isNavigating: true, is3d: false };
    const { getByTestId } = render(<NavigationInfo {...props} />);
    fireEvent.press(getByTestId('action-button'));

    expect(props.onStartNavigation).toHaveBeenCalled();
    expect(props.updateIs3d).toHaveBeenCalledWith(true);
    expect(handleCurrentLocation).not.toHaveBeenCalled();
  });
});
