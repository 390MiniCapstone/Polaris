import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import BottomSheetComponent from '@/components/BottomSheetComponent';
import { SharedValue } from 'react-native-reanimated';
import { AuthProvider } from '@/contexts/AuthContext/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

jest.mock('@/utils/refs', () => ({
  bottomSheetRef: {
    current: {
      snapToIndex: jest.fn(),
    },
  },
}));

jest.mock('@/components/GooglePlacesInput', () => {
  return {
    __esModule: true,
    default: ({
      setSearchResults,
      onFocus,
    }: {
      setSearchResults: Function;
      onFocus: Function;
    }) => {
      const { Text, TouchableOpacity } = require('react-native');
      return (
        <TouchableOpacity
          testID="mock-google-places-input"
          onPress={() => {
            if (onFocus) {
              onFocus();
            }
            setSearchResults([
              { place_id: '1', description: 'Place 1' },
              { place_id: '2', description: 'Place 2' },
            ]);
          }}
        >
          <Text>Search</Text>
        </TouchableOpacity>
      );
    },
  };
});

jest.mock('@gorhom/bottom-sheet', () => {
  const React = require('react');
  const { View, TextInput } = require('react-native');
  const BottomSheet = (props: any) => (
    <View testID="bottom-sheet">{props.children}</View>
  );
  const BottomSheetTextInput = (props: any) => <TextInput {...props} />;
  const BottomSheetView = (props: any) => <View {...props} />;
  return {
    __esModule: true,
    default: BottomSheet,
    BottomSheetTextInput,
    BottomSheetView,
  };
});

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  return {
    ...Reanimated,
    SharedValue: jest.fn(() => ({
      value: 0,
      get: jest.fn(),
      set: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn(),
      modify: jest.fn(),
    })),
  };
});

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        result: {
          geometry: {
            location: { lat: 45.5017, lng: -73.5673 },
          },
        },
      }),
  })
) as jest.Mock;

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(message => {
    if (
      typeof message === 'string' &&
      message.includes('Function components cannot be given refs')
    ) {
      return;
    }
  });
});

afterAll(() => {
  (console.error as jest.Mock).mockRestore();
});

let animatedPosition: SharedValue<number>;

beforeEach(() => {
  animatedPosition = {
    value: 0,
    get: jest.fn(),
    set: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
    modify: jest.fn(),
  } as SharedValue<number>;
});

describe('BottomSheetComponent', () => {
  it('shows search results when Search is clicked', async () => {
    const onSearchClick = jest.fn();
    const onFocus = jest.fn();
    const queryClient = createTestQueryClient();

    const { getByText } = render(
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BottomSheetComponent
            onSearchClick={onSearchClick}
            onFocus={onFocus}
            animatedPosition={animatedPosition}
          />
        </AuthProvider>
      </QueryClientProvider>
    );

    fireEvent.press(getByText('Search'));

    await waitFor(() => {
      expect(onFocus).toHaveBeenCalled();
    });
  });

  it('calls onSearchClick with correct coordinates and snaps bottom sheet when a place is selected', async () => {
    const onSearchClick = jest.fn();
    const onFocus = jest.fn();
    const { bottomSheetRef } = require('@/utils/refs');
    bottomSheetRef.current.snapToIndex.mockClear();

    const animatedPosition: SharedValue<number> = {
      value: 0,
      get: jest.fn(),
      set: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn(),
      modify: jest.fn(),
    };

    const queryClient = createTestQueryClient();

    const { getByText, findByText } = render(
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BottomSheetComponent
            onSearchClick={onSearchClick}
            onFocus={onFocus}
            animatedPosition={animatedPosition}
          />
        </AuthProvider>
      </QueryClientProvider>
    );

    fireEvent.press(getByText('Search'));

    const place1 = await findByText('Place 1');
    fireEvent.press(place1);

    await waitFor(() => {
      expect(onSearchClick).toHaveBeenCalledWith({
        latitude: 45.5017,
        longitude: -73.5673,
        latitudeDelta: 0.001,
        longitudeDelta: 0.001,
      });
      expect(bottomSheetRef.current.snapToIndex).toHaveBeenCalledWith(1);
    });
  });
});
