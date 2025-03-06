import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NavigationInfo } from '../NavigationInfo';

jest.mock('expo-font', () => ({
  loadAsync: jest.fn(() => Promise.resolve()),
  isLoaded: () => true,
}));

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    FontAwesome5: (props: any) => <Text {...props} />,
    Ionicons: (props: any) => <Text {...props} />,
  };
});

jest.mock('@/hooks/useMapLocation', () => ({
  useMapLocation: jest.fn(),
}));
jest.mock('@/contexts/NavigationContext/NavigationContext', () => ({
  useNavigation: jest.fn(),
}));
jest.mock('@/utils/mapHandlers', () => ({
  handleCurrentLocation: jest.fn(),
}));
jest.mock('@/utils/navigationUtils', () => ({
  openTransitInMaps: jest.fn(),
}));
jest.mock('@/utils/refs', () => ({
  mapRef: { current: {} },
}));

import { useMapLocation } from '@/hooks/useMapLocation';
import { useNavigation } from '@/contexts/NavigationContext/NavigationContext';
import { handleCurrentLocation } from '@/utils/mapHandlers';
import { openTransitInMaps } from '@/utils/navigationUtils';
import { mapRef } from '@/utils/refs';

describe('NavigationInfo Component', () => {
  const dummyLocation = {
    latitude: 37.39223512591287,
    longitude: -122.16990035825833,
  };
  const dummyDestination = { latitude: 37.4, longitude: -122.17 };

  beforeEach(() => {
    jest.clearAllMocks();
    (useMapLocation as jest.Mock).mockReturnValue({
      location: dummyLocation,
    });
  });

  it('calls cancelNavigation when cancel button is pressed', () => {
    const cancelNavigation = jest.fn();
    (useNavigation as jest.Mock).mockReturnValue({
      navigationState: 'navigating',
      cancelNavigation,
      travelMode: 'DRIVE',
      is3d: false,
      setIs3d: jest.fn(),
      remainingTime: 300,
      remainingDistance: 2000,
      destination: dummyDestination,
      handleStartNavigation: jest.fn(),
    });

    const { getByTestId } = render(<NavigationInfo />);
    const cancelButton = getByTestId('cancel-button');
    fireEvent.press(cancelButton);

    expect(cancelNavigation).toHaveBeenCalled();
  });

  it('calls handleStartNavigation and setIs3d(true) when navigationState is "navigating" and is3d is false on action press', () => {
    const handleStartNavigation = jest.fn();
    const setIs3d = jest.fn();

    (useNavigation as jest.Mock).mockReturnValue({
      navigationState: 'navigating',
      travelMode: 'DRIVE',
      is3d: false,
      setIs3d,
      remainingTime: 300,
      remainingDistance: 2000,
      destination: dummyDestination,
      cancelNavigation: jest.fn(),
      handleStartNavigation,
    });

    const { getByTestId } = render(<NavigationInfo />);
    const actionButton = getByTestId('action-button');

    fireEvent.press(actionButton);

    expect(handleStartNavigation).toHaveBeenCalled();
    expect(setIs3d).toHaveBeenCalledWith(true);
  });

  it('calls handleCurrentLocation with mapRef and location and setIs3d(false) when navigationState is "navigating" and is3d is true on action press', () => {
    const handleStartNavigation = jest.fn();
    const setIs3d = jest.fn();

    (useNavigation as jest.Mock).mockReturnValue({
      navigationState: 'navigating',
      travelMode: 'DRIVE',
      is3d: true,
      setIs3d,
      remainingTime: 300,
      remainingDistance: 2000,
      destination: dummyDestination,
      cancelNavigation: jest.fn(),
      handleStartNavigation,
    });

    const { getByTestId } = render(<NavigationInfo />);
    const actionButton = getByTestId('action-button');

    fireEvent.press(actionButton);

    expect(handleCurrentLocation).toHaveBeenCalledWith(mapRef, dummyLocation);
    expect(setIs3d).toHaveBeenCalledWith(false);
  });

  it('calls openTransitInMaps when navigationState is not "navigating" and travelMode is "TRANSIT" with location available on action press', () => {
    const handleStartNavigation = jest.fn();
    const setIs3d = jest.fn();

    (useNavigation as jest.Mock).mockReturnValue({
      navigationState: 'planning',
      travelMode: 'TRANSIT',
      is3d: false,
      setIs3d,
      remainingTime: 300,
      remainingDistance: 2000,
      destination: dummyDestination,
      cancelNavigation: jest.fn(),
      handleStartNavigation,
    });

    const { getByTestId } = render(<NavigationInfo />);
    const actionButton = getByTestId('action-button');

    fireEvent.press(actionButton);

    expect(openTransitInMaps).toHaveBeenCalledWith(
      dummyLocation,
      dummyDestination
    );
    expect(handleStartNavigation).not.toHaveBeenCalled();
  });

  it('calls handleStartNavigation when navigationState is not "navigating" and travelMode is not "TRANSIT" on action press', () => {
    const handleStartNavigation = jest.fn();
    const setIs3d = jest.fn();

    (useNavigation as jest.Mock).mockReturnValue({
      navigationState: 'planning',
      travelMode: 'DRIVE',
      is3d: false,
      setIs3d,
      remainingTime: 300,
      remainingDistance: 2000,
      destination: dummyDestination,
      cancelNavigation: jest.fn(),
      handleStartNavigation,
    });

    const { getByTestId } = render(<NavigationInfo />);
    const actionButton = getByTestId('action-button');

    fireEvent.press(actionButton);

    expect(handleStartNavigation).toHaveBeenCalled();
    expect(openTransitInMaps).not.toHaveBeenCalled();
  });

  it('displays the correct remaining time and distance', () => {
    (useNavigation as jest.Mock).mockReturnValue({
      navigationState: 'planning',
      travelMode: 'DRIVE',
      is3d: false,
      setIs3d: jest.fn(),
      remainingTime: 125,
      remainingDistance: 2300,
      destination: dummyDestination,
      cancelNavigation: jest.fn(),
      handleStartNavigation: jest.fn(),
    });

    const { getByText } = render(<NavigationInfo />);

    expect(getByText('3 Minutes')).toBeTruthy();
    expect(getByText('2.3 km')).toBeTruthy();
  });
});
