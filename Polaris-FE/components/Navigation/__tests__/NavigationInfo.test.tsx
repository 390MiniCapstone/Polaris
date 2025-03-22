import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NavigationInfo } from '@/components/Navigation/NavigationInfo';
import { useMapLocation } from '@/hooks/useMapLocation';
import { useNavigation } from '@/contexts/NavigationContext/NavigationContext';
import { handleGoButton } from '@/utils/navigationUtils';
import { mapRef } from '@/utils/refs';
import { LatLng } from 'react-native-maps';
import '@testing-library/jest-native/extend-expect';

jest.mock('@/hooks/useMapLocation');
jest.mock('@/contexts/NavigationContext/NavigationContext');
jest.mock('@/utils/navigationUtils');
jest.mock('@/utils/refs', () => ({
  mapRef: {
    current: {},
  },
}));
jest.mock('@expo/vector-icons', () => ({
  FontAwesome5: 'FontAwesome5',
}));

describe('NavigationInfo', () => {
  const mockLocation: LatLng = { latitude: 37.7749, longitude: -122.4194 };
  const mockDestination: LatLng = { latitude: 34.0522, longitude: -118.2437 };

  const mockSetIs3d = jest.fn();
  const mockCancelNavigation = jest.fn();
  const mockHandleStartNavigation = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useMapLocation as jest.Mock).mockReturnValue({
      location: mockLocation,
    });
  });

  describe('when data is available (not loading and no error)', () => {
    beforeEach(() => {
      (useNavigation as jest.Mock).mockReturnValue({
        travelMode: 'DRIVE',
        is3d: true,
        setIs3d: mockSetIs3d,
        remainingTime: 1800,
        remainingDistance: 15000,
        destination: mockDestination,
        cancelNavigation: mockCancelNavigation,
        handleStartNavigation: mockHandleStartNavigation,
        navigationState: 'planning',
        routeData: {},
        loading: false,
        error: null,
      });
    });

    test('renders correctly in planning state', () => {
      const { getByText, getByTestId } = render(<NavigationInfo />);
      expect(getByText('30 Minutes')).toBeTruthy();
      expect(getByText('15.0 km')).toBeTruthy();
      expect(getByText('GO')).toBeTruthy();

      const actionButton = getByTestId('action-button');
      expect(actionButton.props.style).toMatchObject(
        expect.objectContaining({
          backgroundColor: '#9A2E3F',
        })
      );
    });

    test('renders correctly in navigating state', () => {
      (useNavigation as jest.Mock).mockReturnValue({
        travelMode: 'DRIVE',
        is3d: true,
        setIs3d: mockSetIs3d,
        remainingTime: 1800,
        remainingDistance: 15000,
        destination: mockDestination,
        cancelNavigation: mockCancelNavigation,
        handleStartNavigation: mockHandleStartNavigation,
        navigationState: 'navigating',
        routeData: {},
        loading: false,
        error: null,
      });
      const { queryByText, getByTestId } = render(<NavigationInfo />);
      expect(queryByText('GO')).toBeNull();
      const actionButton = getByTestId('action-button');
      expect(actionButton.props.style).toMatchObject(
        expect.objectContaining({
          backgroundColor: 'rgba(34, 34, 34, 0.992)',
        })
      );
    });

    test('rounds up remaining time to nearest minute', () => {
      (useNavigation as jest.Mock).mockReturnValue({
        travelMode: 'DRIVE',
        is3d: true,
        setIs3d: mockSetIs3d,
        remainingTime: 138,
        remainingDistance: 15000,
        destination: mockDestination,
        cancelNavigation: mockCancelNavigation,
        handleStartNavigation: mockHandleStartNavigation,
        navigationState: 'planning',
        routeData: {},
        loading: false,
        error: null,
      });
      const { getByText } = render(<NavigationInfo />);
      expect(getByText('3 Minutes')).toBeTruthy();
    });

    test('formats distance with one decimal place', () => {
      (useNavigation as jest.Mock).mockReturnValue({
        travelMode: 'DRIVE',
        is3d: true,
        setIs3d: mockSetIs3d,
        remainingTime: 1800,
        remainingDistance: 12340,
        destination: mockDestination,
        cancelNavigation: mockCancelNavigation,
        handleStartNavigation: mockHandleStartNavigation,
        navigationState: 'planning',
        routeData: {},
        loading: false,
        error: null,
      });
      const { getByText } = render(<NavigationInfo />);
      expect(getByText('12.3 km')).toBeTruthy();
    });
  });

  describe('when loading is true', () => {
    beforeEach(() => {
      (useNavigation as jest.Mock).mockReturnValue({
        travelMode: 'DRIVE',
        is3d: true,
        setIs3d: mockSetIs3d,
        remainingTime: 1800,
        remainingDistance: 15000,
        destination: mockDestination,
        cancelNavigation: mockCancelNavigation,
        handleStartNavigation: mockHandleStartNavigation,
        navigationState: 'planning',
        routeData: {},
        loading: true,
        error: null,
      });
    });

    test('renders an ActivityIndicator in infoContainer', () => {
      const { toJSON } = render(<NavigationInfo />);
      const tree = toJSON();
      expect(JSON.stringify(tree)).toContain('ActivityIndicator');
    });
  });

  describe('when error is present', () => {
    beforeEach(() => {
      (useNavigation as jest.Mock).mockReturnValue({
        travelMode: 'DRIVE',
        is3d: true,
        setIs3d: mockSetIs3d,
        remainingTime: 1800,
        remainingDistance: 15000,
        destination: mockDestination,
        cancelNavigation: mockCancelNavigation,
        handleStartNavigation: mockHandleStartNavigation,
        navigationState: 'planning',
        routeData: {},
        loading: false,
        error: new Error('Some error'),
      });
    });

    test('renders error message', () => {
      const { getByText } = render(<NavigationInfo />);
      expect(getByText('Directions Not Available')).toBeTruthy();
    });
  });

  describe('cancel button and handleGoButton', () => {
    beforeEach(() => {
      (useNavigation as jest.Mock).mockReturnValue({
        travelMode: 'DRIVE',
        is3d: true,
        setIs3d: mockSetIs3d,
        remainingTime: 1800,
        remainingDistance: 15000,
        destination: mockDestination,
        cancelNavigation: mockCancelNavigation,
        handleStartNavigation: mockHandleStartNavigation,
        navigationState: 'planning',
        routeData: {},
        loading: false,
        error: null,
      });
    });

    test('calls cancelNavigation when cancel button is pressed', () => {
      const { getByTestId } = render(<NavigationInfo />);
      fireEvent.press(getByTestId('cancel-button'));
      expect(mockCancelNavigation).toHaveBeenCalledTimes(1);
    });

    test('calls handleGoButton with correct params when GO button is pressed in planning state', () => {
      const { getByTestId } = render(<NavigationInfo />);
      fireEvent.press(getByTestId('action-button'));
      expect(handleGoButton).toHaveBeenCalledWith({
        navigationState: 'planning',
        is3d: true,
        location: mockLocation,
        travelMode: 'DRIVE',
        destination: mockDestination,
        setIs3d: mockSetIs3d,
        handleStartNavigation: mockHandleStartNavigation,
        mapRef,
        error: null,
      });
    });

    test('calls handleGoButton with correct params when action button is pressed in navigating state', () => {
      (useNavigation as jest.Mock).mockReturnValue({
        travelMode: 'DRIVE',
        is3d: true,
        setIs3d: mockSetIs3d,
        remainingTime: 1800,
        remainingDistance: 15000,
        destination: mockDestination,
        cancelNavigation: mockCancelNavigation,
        handleStartNavigation: mockHandleStartNavigation,
        navigationState: 'navigating',
        routeData: {},
        loading: false,
        error: null,
      });
      const { getByTestId } = render(<NavigationInfo />);
      fireEvent.press(getByTestId('action-button'));
      expect(handleGoButton).toHaveBeenCalledWith({
        navigationState: 'navigating',
        is3d: true,
        location: mockLocation,
        travelMode: 'DRIVE',
        destination: mockDestination,
        setIs3d: mockSetIs3d,
        handleStartNavigation: mockHandleStartNavigation,
        mapRef,
        error: null,
      });
    });
  });

  describe('edge cases for time and distance', () => {
    test('handles zero remaining time and distance by rendering loading indicator', () => {
      (useNavigation as jest.Mock).mockReturnValue({
        travelMode: 'DRIVE',
        is3d: true,
        setIs3d: mockSetIs3d,
        remainingTime: 0,
        remainingDistance: 0,
        destination: mockDestination,
        cancelNavigation: mockCancelNavigation,
        handleStartNavigation: mockHandleStartNavigation,
        navigationState: 'planning',
        routeData: {},
        loading: false,
        error: null,
      });
      const { toJSON } = render(<NavigationInfo />);
      const tree = toJSON();
      expect(JSON.stringify(tree)).toContain('ActivityIndicator');
    });

    test('handles very small remaining time and distance', () => {
      (useNavigation as jest.Mock).mockReturnValue({
        travelMode: 'DRIVE',
        is3d: true,
        setIs3d: mockSetIs3d,
        remainingTime: 5,
        remainingDistance: 10,
        destination: mockDestination,
        cancelNavigation: mockCancelNavigation,
        handleStartNavigation: mockHandleStartNavigation,
        navigationState: 'planning',
        routeData: {},
        loading: false,
        error: null,
      });
      const { getByText } = render(<NavigationInfo />);
      expect(getByText('1 Minutes')).toBeTruthy();
      expect(getByText('0.0 km')).toBeTruthy();
    });
  });
});
