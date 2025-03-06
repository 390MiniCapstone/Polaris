import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { TravelModeToggle } from '@/components/Navigation/TravelModeToggle';

jest.mock('@/contexts/NavigationContext/NavigationContext', () => ({
  useNavigation: jest.fn(),
}));

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    FontAwesome: (props: any) => <Text {...props} />,
    FontAwesome5: (props: any) => <Text {...props} />,
    FontAwesome6: (props: any) => <Text {...props} />,
  };
});

import { useNavigation } from '@/contexts/NavigationContext/NavigationContext';

describe('TravelModeToggle', () => {
  const setTravelModeMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all transport mode buttons', () => {
    (useNavigation as jest.Mock).mockReturnValue({
      travelMode: 'DRIVE',
      setTravelMode: setTravelModeMock,
    });

    const { getByTestId } = render(<TravelModeToggle />);

    expect(getByTestId('transport-mode-button-DRIVE')).toBeTruthy();
    expect(getByTestId('transport-mode-button-WALK')).toBeTruthy();
    expect(getByTestId('transport-mode-button-TRANSIT')).toBeTruthy();
    expect(getByTestId('transport-mode-button-BICYCLE')).toBeTruthy();
  });

  it('calls setTravelMode with DRIVE when the DRIVE button is pressed', () => {
    (useNavigation as jest.Mock).mockReturnValue({
      travelMode: 'WALK',
      setTravelMode: setTravelModeMock,
    });

    const { getByTestId } = render(<TravelModeToggle />);
    const driveButton = getByTestId('transport-mode-button-DRIVE');
    fireEvent.press(driveButton);

    expect(setTravelModeMock).toHaveBeenCalledWith('DRIVE');
  });

  it('calls setTravelMode with WALK when the WALK button is pressed', () => {
    (useNavigation as jest.Mock).mockReturnValue({
      travelMode: 'DRIVE',
      setTravelMode: setTravelModeMock,
    });

    const { getByTestId } = render(<TravelModeToggle />);
    const walkButton = getByTestId('transport-mode-button-WALK');
    fireEvent.press(walkButton);

    expect(setTravelModeMock).toHaveBeenCalledWith('WALK');
  });

  it('calls setTravelMode with TRANSIT when the TRANSIT button is pressed', () => {
    (useNavigation as jest.Mock).mockReturnValue({
      travelMode: 'DRIVE',
      setTravelMode: setTravelModeMock,
    });

    const { getByTestId } = render(<TravelModeToggle />);
    const transitButton = getByTestId('transport-mode-button-TRANSIT');
    fireEvent.press(transitButton);

    expect(setTravelModeMock).toHaveBeenCalledWith('TRANSIT');
  });

  it('calls setTravelMode with BICYCLE when the BICYCLE button is pressed', () => {
    (useNavigation as jest.Mock).mockReturnValue({
      travelMode: 'DRIVE',
      setTravelMode: setTravelModeMock,
    });

    const { getByTestId } = render(<TravelModeToggle />);
    const bicycleButton = getByTestId('transport-mode-button-BICYCLE');
    fireEvent.press(bicycleButton);

    expect(setTravelModeMock).toHaveBeenCalledWith('BICYCLE');
  });

  it('applies the selected style for the active travel mode', () => {
    (useNavigation as jest.Mock).mockReturnValue({
      travelMode: 'WALK',
      setTravelMode: setTravelModeMock,
    });

    const { getByTestId } = render(<TravelModeToggle />);
    const walkButton = getByTestId('transport-mode-button-WALK');
    expect(walkButton).toHaveStyle({ backgroundColor: '#9A2E3F' });

    const driveButton = getByTestId('transport-mode-button-DRIVE');
    expect(driveButton).not.toHaveStyle({ backgroundColor: '#9A2E3F' });
  });
});
