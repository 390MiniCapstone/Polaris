import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NavigationInfo } from '@/components/Navigation/NavigationInfo';
import { useNavigation } from '@/contexts/NavigationContext/NavigationContext';
import { useMapLocation } from '@/hooks/useMapLocation';
import { handleGoButton } from '@/utils/navigationUtils';
import { LatLng } from 'react-native-maps';
import '@testing-library/jest-native/extend-expect';

jest.mock('@/contexts/NavigationContext/NavigationContext');
jest.mock('@/hooks/useMapLocation');
jest.mock('@/utils/navigationUtils');
jest.mock('@expo/vector-icons', () => ({
  FontAwesome5: 'FontAwesome5',
}));

describe('NavigationInfo', () => {
  const mockLocation: LatLng = { latitude: 1, longitude: 1 };
  const mockDestination: LatLng = { latitude: 2, longitude: 2 };
  const mockSetIs3d = jest.fn();
  const mockCancelNavigation = jest.fn();
  const mockHandleStartNavigation = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useMapLocation as jest.Mock).mockReturnValue({ location: mockLocation });
  });

  const mockUseNavigation = (override = {}) => {
    (useNavigation as jest.Mock).mockReturnValue({
      travelMode: 'DRIVE',
      is3d: true,
      setIs3d: mockSetIs3d,
      remainingTime: 1800, // 30 minutes
      remainingDistance: 15000, // 15 km
      destination: mockDestination,
      cancelNavigation: mockCancelNavigation,
      handleStartNavigation: mockHandleStartNavigation,
      navigationState: 'planning',
      routeData: {},
      loading: false,
      error: null,
      nextDeparture: null,
      currentLeg: 'legOne',
      shuttleData: {},
      ...override,
    });
  };

  describe('Display Route Estimates', () => {
    it('shows remaining time and distance', () => {
      mockUseNavigation();
      const { getByText } = render(<NavigationInfo />);
      expect(getByText('30 Minutes')).toBeTruthy();
      expect(getByText('15.0 km')).toBeTruthy();
    });

    it('shows ActivityIndicator when loading', () => {
      mockUseNavigation({ loading: true });
      const { getByTestId } = render(<NavigationInfo />);
      expect(getByTestId('ActivityIndicator')).toBeTruthy();
    });

    it('shows error message when error exists', () => {
      mockUseNavigation({ error: new Error('Something went wrong') });
      const { getByText } = render(<NavigationInfo />);
      expect(getByText('Something went wrong')).toBeTruthy();
    });

    it('shows next shuttle time during planning state for shuttle', () => {
      mockUseNavigation({
        navigationState: 'planning',
        travelMode: 'SHUTTLE',
        nextDeparture: '12:30 PM',
      });
      const { getByText } = render(<NavigationInfo />);
      expect(getByText('Next Shuttle at 12:30 PM')).toBeTruthy();
    });

    it('shows arriving time during legTwo navigation', () => {
      mockUseNavigation({
        navigationState: 'navigating',
        travelMode: 'SHUTTLE',
        currentLeg: 'legTwo',
        shuttleData: { legTwo: { busData: { totalDuration: 600 } } },
      });
      const { getByText } = render(<NavigationInfo />);
      expect(getByText(/Arriving at/)).toBeTruthy();
    });
  });

  describe('Buttons behavior', () => {
    it('cancel button triggers cancelNavigation', () => {
      mockUseNavigation();
      const { getByTestId } = render(<NavigationInfo />);
      fireEvent.press(getByTestId('cancel-button'));
      expect(mockCancelNavigation).toHaveBeenCalled();
    });

    it('GO button triggers handleGoButton in planning state', () => {
      mockUseNavigation();
      const { getByTestId } = render(<NavigationInfo />);
      fireEvent.press(getByTestId('action-button'));
      expect(handleGoButton).toHaveBeenCalledWith(
        expect.objectContaining({
          navigationState: 'planning',
          location: mockLocation,
          travelMode: 'DRIVE',
          destination: mockDestination,
        })
      );
    });

    it('Navigation icon appears in navigating state instead of GO text', () => {
      mockUseNavigation({ navigationState: 'navigating' });
      const { queryByText } = render(<NavigationInfo />);
      expect(queryByText('GO')).toBeNull();
    });
  });

  describe('Edge Cases', () => {
    it('rounds remaining time up correctly', () => {
      mockUseNavigation({ remainingTime: 95 });
      const { getByText } = render(<NavigationInfo />);
      expect(getByText('2 Minutes')).toBeTruthy();
    });

    it('formats small distance correctly', () => {
      mockUseNavigation({ remainingDistance: 250 });
      const { getByText } = render(<NavigationInfo />);
      expect(getByText('0.3 km')).toBeTruthy();
    });

    it('shows loading indicator if no time or distance', () => {
      mockUseNavigation({ remainingTime: null, remainingDistance: null });
      const { getByTestId } = render(<NavigationInfo />);
      expect(getByTestId('ActivityIndicator')).toBeTruthy();
    });
  });
});
