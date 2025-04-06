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

  const mockUseNavigation = (travelMode = 'DRIVE') => {
    (useNavigation as jest.Mock).mockReturnValue({
      travelMode,
      setTravelMode: setTravelModeMock,
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders all transport mode buttons', () => {
      mockUseNavigation();
      const { getByTestId } = render(<TravelModeToggle />);

      expect(getByTestId('transport-mode-button-DRIVE')).toBeTruthy();
      expect(getByTestId('transport-mode-button-WALK')).toBeTruthy();
      expect(getByTestId('transport-mode-button-TRANSIT')).toBeTruthy();
      expect(getByTestId('transport-mode-button-BICYCLE')).toBeTruthy();
      expect(getByTestId('transport-mode-button-SHUTTLE')).toBeTruthy();
    });

    it('applies selected style only to active travel mode button', () => {
      mockUseNavigation('WALK');
      const { getByTestId } = render(<TravelModeToggle />);
      const walkButton = getByTestId('transport-mode-button-WALK');
      const driveButton = getByTestId('transport-mode-button-DRIVE');

      expect(walkButton).toHaveStyle({
        backgroundColor: 'rgba(143, 34, 54, 1)',
      });
      expect(driveButton).not.toHaveStyle({ backgroundColor: '#9A2E3F' });
    });
  });

  describe('Interaction', () => {
    it('calls setTravelMode when pressing DRIVE button', () => {
      mockUseNavigation();
      const { getByTestId } = render(<TravelModeToggle />);
      fireEvent.press(getByTestId('transport-mode-button-DRIVE'));
      expect(setTravelModeMock).toHaveBeenCalledWith('DRIVE');
    });

    it('calls setTravelMode when pressing WALK button', () => {
      mockUseNavigation();
      const { getByTestId } = render(<TravelModeToggle />);
      fireEvent.press(getByTestId('transport-mode-button-WALK'));
      expect(setTravelModeMock).toHaveBeenCalledWith('WALK');
    });

    it('calls setTravelMode when pressing TRANSIT button', () => {
      mockUseNavigation();
      const { getByTestId } = render(<TravelModeToggle />);
      fireEvent.press(getByTestId('transport-mode-button-TRANSIT'));
      expect(setTravelModeMock).toHaveBeenCalledWith('TRANSIT');
    });

    it('calls setTravelMode when pressing BICYCLE button', () => {
      mockUseNavigation();
      const { getByTestId } = render(<TravelModeToggle />);
      fireEvent.press(getByTestId('transport-mode-button-BICYCLE'));
      expect(setTravelModeMock).toHaveBeenCalledWith('BICYCLE');
    });

    it('calls setTravelMode when pressing SHUTTLE button', () => {
      mockUseNavigation();
      const { getByTestId } = render(<TravelModeToggle />);
      fireEvent.press(getByTestId('transport-mode-button-SHUTTLE'));
      expect(setTravelModeMock).toHaveBeenCalledWith('SHUTTLE');
    });
  });
});
