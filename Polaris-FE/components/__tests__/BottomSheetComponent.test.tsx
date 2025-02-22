import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import BottomSheetComponent from '@/components/BottomSheetComponent';
import BottomSheet from '@gorhom/bottom-sheet';
import { SharedValue } from 'react-native-reanimated';

jest.mock('@/components/GooglePlacesInput', () => {
  return {
    __esModule: true,
    default: ({ setSearchResults }: { setSearchResults: Function }) => {
      const { Text, TouchableOpacity } = require('react-native');
      return (
        <TouchableOpacity
          onPress={() =>
            setSearchResults([
              { place_id: '1', description: 'Place 1' },
              { place_id: '2', description: 'Place 2' },
            ])
          }
        >
          <Text>Search</Text>
        </TouchableOpacity>
      );
    },
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

describe('BottomSheetComponent', () => {
  it('shows search results when Search is clicked', async () => {
    const bottomSheetRef = {
      current: { snapToIndex: jest.fn() },
    } as unknown as React.RefObject<BottomSheet>;

    const animatedPosition: SharedValue<number> = {
      value: 0,
      get: jest.fn(),
      set: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn(),
      modify: jest.fn(),
    };

    const { getByText, findByText } = render(
      <BottomSheetComponent
        onSearchClick={jest.fn()}
        bottomSheetRef={bottomSheetRef}
        onFocus={jest.fn()}
        animatedPosition={animatedPosition}
      />
    );

    fireEvent.press(getByText('Search'));

    const place1 = await findByText('Place 1');
    const place2 = await findByText('Place 2');

    expect(place1).toBeTruthy();
    expect(place2).toBeTruthy();
  });

  it('calls onSearchClick with correct coordinates when a place is selected', async () => {
    const onSearchClick = jest.fn();
    const bottomSheetRef = {
      current: { snapToIndex: jest.fn() },
    } as unknown as React.RefObject<BottomSheet>;

    const animatedPosition: SharedValue<number> = {
      value: 0,
      get: jest.fn(),
      set: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn(),
      modify: jest.fn(),
    };

    const { getByText, findByText } = render(
      <BottomSheetComponent
        onSearchClick={onSearchClick}
        bottomSheetRef={bottomSheetRef}
        onFocus={jest.fn()}
        animatedPosition={animatedPosition}
      />
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
    });
  });
});
