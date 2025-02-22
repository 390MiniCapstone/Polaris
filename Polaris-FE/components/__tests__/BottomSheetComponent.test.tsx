import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { BottomSheetComponent } from '@/components/BottomSheetComponent';
import BottomSheet from '@gorhom/bottom-sheet';

// Mocking the GooglePlacesInput component
jest.mock('@/components/GooglePlacesInput', () => {
  return {
    __esModule: true,
    default: ({ setSearchResults }: { setSearchResults: Function }) => {
      return (
        <button
          onClick={() =>
            setSearchResults([
              { place_id: '1', description: 'Place 1' },
              { place_id: '2', description: 'Place 2' },
            ])
          }
        >
          Search
        </button>
      );
    },
  };
});

// Mocking the Animated.SharedValue
jest.mock('react-native-reanimated', () => {
  return {
    __esModule: true,
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

describe('BottomSheetComponent', () => {
  it('should render and update search results when Search is clicked', async () => {
    const onSearchClick = jest.fn();
    const bottomSheetRef = React.createRef<BottomSheet>();
    const onFocus = jest.fn();

    // Mocked SharedValue
    const animatedPosition =
      new (require('react-native-reanimated').SharedValue)();

    const { getByText, getByTestId } = render(
      <BottomSheetComponent
        onSearchClick={onSearchClick}
        bottomSheetRef={bottomSheetRef}
        onFocus={onFocus}
        animatedPosition={animatedPosition}
      />
    );

    // Trigger the GooglePlacesInput component search simulation
    const searchButton = getByText('Search');
    fireEvent.press(searchButton);

    // Wait for search results to be updated
    await waitFor(() => getByText('Place 1'));

    // Check that the results are rendered
    expect(getByText('Place 1')).toBeTruthy();
    expect(getByText('Place 2')).toBeTruthy();

    // Simulate selecting a place
    const placeButton = getByText('Place 1');
    fireEvent.press(placeButton);

    // Check that onSearchClick was called with correct arguments
    await waitFor(() => {
      expect(onSearchClick).toHaveBeenCalledWith({
        latitude: expect.any(Number),
        longitude: expect.any(Number),
        latitudeDelta: 0.001,
        longitudeDelta: 0.001,
      });
    });
  });
});
