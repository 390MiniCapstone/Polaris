jest.mock('@/utils/refs', () => ({
  bottomSheetRef: { current: { close: jest.fn(), snapToIndex: jest.fn() } },
  mapRef: {
    current: {
      fitToCoordinates: jest.fn(),
      animateToRegion: jest.fn(),
    },
  },
}));

jest.mock('@/hooks/useMapLocation', () => ({
  useMapLocation: () => ({
    location: { latitude: 37.39223512591287, longitude: -122.16990035825833 },
  }),
}));

jest.mock('@/services/googleMapsRoutes', () => ({
  getGoogleMapsRoute: jest.fn(() =>
    Promise.resolve({
      polyline: [
        { latitude: 37.39223512591287, longitude: -122.16990035825833 },
        { latitude: 37.392, longitude: -122.17 },
      ],
      steps: [],
      totalDuration: 600,
      totalDistance: 2000,
    })
  ),
}));

jest.mock('@/utils/navigationUtils', () => ({
  clipPolylineFromSnappedPoint: jest.fn(() => [
    { latitude: 37.39223512591287, longitude: -122.16990035825833 },
  ]),
  computeRemainingDistance: jest.fn(() => 1000),
  computeRemainingTime: jest.fn(() => 300),
  determineNextInstruction: jest.fn(() => 'Turn right in 100 meters'),
  startNavigation: jest.fn(),
}));

jest.mock('@/utils/mapHandlers', () => ({
  __esModule: true,
  handleCurrentLocation: jest.fn(),
}));

jest.mock('@/components/Navigation/TravelModeToggle', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    TravelModeToggle: ({ selectedMode }: { selectedMode: string }) => (
      <Text testID="transport-mode">TravelModeToggle: {selectedMode}</Text>
    ),
  };
});
jest.mock('@/components/Navigation/Instructions', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    Instructions: ({ instruction }: { instruction: string }) => (
      <Text testID="instructions">Instructions: {instruction}</Text>
    ),
  };
});
jest.mock('@/components/Navigation/NavigationInfo', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    NavigationInfo: (props: any) => (
      <Text testID="navigation-info">
        NavigationInfo: {props.duration} {props.distance}
      </Text>
    ),
  };
});

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { View } = require('react-native');
  const MockIcon = (props: any) => <View {...props} />;
  return {
    __esModule: true,
    FontAwesome5: MockIcon,
    Ionicons: MockIcon,
  };
});
jest.mock('expo-font', () => ({
  loadAsync: jest.fn(),
  isLoaded: jest.fn(() => true),
}));

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Navigation } from '@/components/Navigation/Navigation';
import { getGoogleMapsRoute } from '@/services/googleMapsRoutes';
import { handleCurrentLocation } from '@/utils/mapHandlers';
import { NavigationState } from '@/constants/types';
import type { NavigationProps } from '@/components/Navigation/Navigation';

const navigationStateDefault: NavigationState = 'default';

const defaultProps: NavigationProps = {
  navigationState: navigationStateDefault,
  setNavigationState: jest.fn(),
  destination: { latitude: 0, longitude: 0 },
  setDestination: jest.fn(),
  travelMode: 'DRIVE',
  setTravelMode: jest.fn(),
  snappedPoint: null,
  setSnappedPoint: jest.fn(),
  clippedPolyline: null,
  setClippedPolyline: jest.fn(),
};

describe('Navigation Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the "Navigation Demo" button when in default state', () => {
    const { getByText } = render(<Navigation {...defaultProps} />);
    expect(getByText('Navigation Demo')).toBeTruthy();
  });

  it('transitions from default to planning when "Navigation Demo" button is pressed', () => {
    const { getByText } = render(<Navigation {...defaultProps} />);
    const button = getByText('Navigation Demo');
    fireEvent.press(button);

    const { bottomSheetRef } = require('@/utils/refs');
    expect(bottomSheetRef.current.close).toHaveBeenCalled();

    expect(defaultProps.setNavigationState).toHaveBeenCalledWith('planning');

    expect(defaultProps.setDestination).toHaveBeenCalledWith({
      latitude: expect.any(Number),
      longitude: expect.any(Number),
    });
  });

  it('renders TravelModeToggle and NavigationInfo when in planning state after route data is fetched', async () => {
    const props = {
      ...defaultProps,
      navigationState: 'planning' as NavigationState,
    };
    const { getByTestId } = render(<Navigation {...props} />);

    await waitFor(() => {
      expect(getGoogleMapsRoute).toHaveBeenCalled();
    });

    expect(getByTestId('transport-mode')).toBeTruthy();

    expect(getByTestId('navigation-info')).toBeTruthy();
  });

  it('renders Instructions and NavigationInfo when in navigating state', async () => {
    const props = {
      ...defaultProps,
      navigationState: 'navigating' as NavigationState,
    };
    const { getByTestId } = render(<Navigation {...props} />);

    await waitFor(() => {
      expect(getGoogleMapsRoute).toHaveBeenCalled();
    });

    expect(getByTestId('instructions')).toBeTruthy();

    expect(getByTestId('navigation-info')).toBeTruthy();
  });

  it('triggers arrival behavior when remainingDistance is below threshold', async () => {
    const navUtils = require('@/utils/navigationUtils');
    navUtils.computeRemainingDistance.mockReturnValue(5);

    const props = {
      ...defaultProps,
      navigationState: 'navigating' as NavigationState,
    };
    render(<Navigation {...props} />);

    await waitFor(() => {
      expect(navUtils.computeRemainingDistance).toHaveBeenCalled();
    });

    const { bottomSheetRef, mapRef } = require('@/utils/refs');
    expect(bottomSheetRef.current.snapToIndex).toHaveBeenCalledWith(1);

    expect(handleCurrentLocation).toHaveBeenCalledWith(mapRef, {
      latitude: 37.39223512591287,
      longitude: -122.16990035825833,
    });

    expect(props.setNavigationState).toHaveBeenCalledWith('default');
  });
});
