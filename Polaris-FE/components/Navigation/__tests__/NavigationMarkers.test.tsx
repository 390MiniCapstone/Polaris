import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationMarkers } from '../NavigationMarkers';

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  return {
    FontAwesome6: (props: any) => React.createElement('FontAwesome6', props),
  };
});

jest.mock('@/contexts/NavigationContext/NavigationContext', () => ({
  useNavigation: jest.fn(),
}));

jest.mock('@/hooks/useTheme', () => ({
  __esModule: true,
  default: () => ({
    theme: {
      colors: {
        primary: 'blue',
      },
    },
  }),
}));

const mockUseNavigation =
  require('@/contexts/NavigationContext/NavigationContext').useNavigation;

describe('NavigationMarkers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders shuttle bus markers when shuttleData and nextDeparture are available', () => {
    mockUseNavigation.mockReturnValue({
      shuttleData: {
        legTwo: {
          busPoints: [
            { latitude: 0, longitude: 0 },
            { latitude: 1, longitude: 1 },
          ],
        },
      },
      navigationState: 'navigating',
      nextDeparture: '10:00 AM',
      travelMode: 'DRIVE',
      nearestBusStop: null,
      otherBusStop: null,
      destination: null,
      clippedPolyline: null,
      snappedPoint: null,
    });

    const { getAllByTestId } = render(<NavigationMarkers />);
    const busMarkers = getAllByTestId('shuttle-marker');

    expect(busMarkers.length).toBe(2);
  });

  it('renders stop markers when travelMode is SHUTTLE', () => {
    mockUseNavigation.mockReturnValue({
      shuttleData: null,
      navigationState: 'default',
      nextDeparture: null,
      travelMode: 'SHUTTLE',
      nearestBusStop: {
        shortName: 'LOY',
        location: { latitude: 0, longitude: 0 },
      },
      otherBusStop: {
        shortName: 'SGW',
        location: { latitude: 1, longitude: 1 },
      },
      destination: null,
      clippedPolyline: null,
      snappedPoint: null,
    });

    const { getAllByTestId, getByText } = render(<NavigationMarkers />);
    const stopMarkers = getAllByTestId('stop-marker');

    expect(stopMarkers.length).toBeGreaterThanOrEqual(2);
    expect(getByText('LOY')).toBeTruthy();
    expect(getByText('SGW')).toBeTruthy();
  });

  it('renders destination marker when planning or navigating with necessary data', () => {
    mockUseNavigation.mockReturnValue({
      shuttleData: null,
      navigationState: 'planning',
      nextDeparture: null,
      travelMode: 'DRIVE',
      nearestBusStop: null,
      otherBusStop: null,
      destination: { latitude: 2, longitude: 2 },
      clippedPolyline: [
        { latitude: 0, longitude: 0 },
        { latitude: 1, longitude: 1 },
      ],
      snappedPoint: { latitude: 0, longitude: 0 },
    });

    const { getAllByTestId } = render(<NavigationMarkers />);
    const destinationMarkers = getAllByTestId('destination-marker');

    expect(destinationMarkers.length).toBeGreaterThanOrEqual(1);
  });

  it('renders nothing if no relevant data', () => {
    mockUseNavigation.mockReturnValue({
      shuttleData: null,
      navigationState: 'default',
      nextDeparture: null,
      travelMode: 'DRIVE',
      nearestBusStop: null,
      otherBusStop: null,
      destination: null,
      clippedPolyline: null,
      snappedPoint: null,
    });

    const { queryAllByTestId } = render(<NavigationMarkers />);
    const stopMarkers = queryAllByTestId('stop-marker');
    const shuttleMarkers = queryAllByTestId('shuttle-marker');
    const destinationMarkers = queryAllByTestId('destination-marker');

    expect(stopMarkers.length).toBe(0);
    expect(shuttleMarkers.length).toBe(0);
    expect(destinationMarkers.length).toBe(0);
  });
});
