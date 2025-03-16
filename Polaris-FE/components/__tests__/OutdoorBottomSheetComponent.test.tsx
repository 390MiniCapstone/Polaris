import { AuthProvider } from '@/contexts/AuthContext/AuthContext';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import OutdoorBottomSheetComponent from '@/components/BottomSheetComponent/OutdoorBottomSheetComponent';
import { Keyboard } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSharedValue } from 'react-native-reanimated';
import { bottomSheetRef } from '@/utils/refs';

const queryClient = new QueryClient();

describe('OutdoorBottomSheetComponent', () => {
  it('renders without crashing', () => {
    const mockOnSearchClick = jest.fn();
    const mockOnFocus = jest.fn();
    const animatedPosition = useSharedValue(0);

    const { getByTestId, getByText } = render(
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <OutdoorBottomSheetComponent
            onSearchClick={mockOnSearchClick}
            onFocus={mockOnFocus}
            animatedPosition={animatedPosition}
          />
        </AuthProvider>
      </QueryClientProvider>
    );

    expect(getByTestId('google-sign-in-container-outer-layer')).toBeTruthy();
    expect(getByTestId('google-sign-in-container-outer-layer')).toBeTruthy();
    expect(getByTestId('google-sign-in')).toBeTruthy();
    expect(getByTestId('google-sign-in-text')).toBeTruthy();
    expect(getByTestId('google-sign-in-text')).toBeTruthy();

    expect(getByText('Sign in with Google')).toBeTruthy();
  });
});

jest.mock('@/components/BottomSheetComponent/BottomSheetComponent', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    __esModule: true,
    BottomSheetComponent: ({ children }: { children: React.ReactNode }) => (
      <View testID="bottom-sheet-mock">{children}</View>
    ),
  };
});

jest.mock('@/utils/refs', () => ({
  bottomSheetRef: {
    current: {
      snapToIndex: jest.fn().mockImplementation(() => {}),
    },
  },
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        result: {
          geometry: {
            location: { lat: 40.7128, lng: -74.006 },
          },
        },
      }),
  })
) as jest.Mock;

jest.mock('@/components/GooglePlacesInput', () => {
  const React = require('react');
  const { View, Text, TouchableOpacity } = require('react-native');

  return {
    __esModule: true,
    default: ({ setSearchResults }: { setSearchResults: Function }) => (
      <View testID="google-places-input">
        <TouchableOpacity
          testID="search-result-trigger"
          onPress={() =>
            setSearchResults([
              { place_id: 'place1', description: 'Test Location' },
            ])
          }
        >
          <Text>Trigger Search Results</Text>
        </TouchableOpacity>
      </View>
    ),
  };
});

describe('OutdoorBottomSheetComponent', () => {
  it('calls handleLocationSelect correctly', async () => {
    const mockOnSearchClick = jest.fn();
    const mockOnFocus = jest.fn();
    const animatedPosition = useSharedValue(0);

    const { getByText, getByTestId, debug } = render(
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <OutdoorBottomSheetComponent
            onSearchClick={mockOnSearchClick}
            onFocus={mockOnFocus}
            animatedPosition={animatedPosition}
          />
        </QueryClientProvider>
      </AuthProvider>
    );

    fireEvent.press(getByTestId('search-result-trigger'));

    await waitFor(() => {
      expect(getByText('Test Location')).toBeTruthy();
    });

    jest.spyOn(Keyboard, 'dismiss');

    fireEvent.press(getByText('Test Location'));

    await waitFor(() => {
      expect(Keyboard.dismiss).toHaveBeenCalled();
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining(
          'https://maps.googleapis.com/maps/api/place/details/json?place_id=place1&key='
        )
      );

      expect(mockOnSearchClick).toHaveBeenCalledTimes(1);
      expect(mockOnSearchClick).toHaveBeenCalledWith({
        latitude: 40.7128,
        longitude: -74.006,
        latitudeDelta: 0.001,
        longitudeDelta: 0.001,
      });

      if (bottomSheetRef.current) {
        expect(bottomSheetRef.current.snapToIndex).toHaveBeenCalledWith(1);
      }
    });
  });
});
