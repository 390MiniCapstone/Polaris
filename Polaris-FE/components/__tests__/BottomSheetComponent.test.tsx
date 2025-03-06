import React from 'react';
import {
  render,
  fireEvent,
  waitFor,
  RenderAPI,
} from '@testing-library/react-native';
import BottomSheetComponent from '@/components/BottomSheetComponent';
import type { SharedValue } from 'react-native-reanimated';

const animatedPosition: SharedValue<number> = {
  value: 0,
  get: jest.fn(),
  set: jest.fn(),
  addListener: jest.fn(),
  removeListener: jest.fn(),
  modify: jest.fn(),
};

const mockStartNavigationToDestination = jest.fn();

jest.mock('@/components/GooglePlacesInput', () => {
  const React = require('react');
  const { useEffect } = React;
  const { View } = require('react-native');

  const GooglePlacesInput = (props: {
    setSearchResults: (
      results: Array<{ place_id: string; description: string }>
    ) => void;
    onFocus?: () => void;
    query?: string;
    setQuery?: (q: string) => void;
  }) => {
    useEffect(() => {
      props.setSearchResults([
        { place_id: '123', description: 'Test Location' },
      ]);
    }, [props.setSearchResults]);
    return <View testID="GooglePlacesInput" />;
  };

  return GooglePlacesInput;
});

jest.mock('@gorhom/bottom-sheet', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: React.forwardRef((props: any, ref: React.Ref<any>) => {
      return <View {...props} ref={ref} />;
    }),
    BottomSheetView: View,
  };
});

jest.mock('@/utils/refs', () => ({
  bottomSheetRef: {
    current: { snapToIndex: jest.fn() },
  },
  inputRef: {
    current: { blur: jest.fn() },
  },
}));

jest.mock('@/contexts/NavigationContext/NavigationContext', () => ({
  useNavigation: () => ({
    startNavigationToDestination: mockStartNavigationToDestination,
  }),
}));

jest.mock('react-native-reanimated', () => {
  return {
    __esModule: true,
    default: {},
  };
});

describe('BottomSheetComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders search results provided by the GooglePlacesInput mock', async () => {
    const rendered: RenderAPI = render(
      <BottomSheetComponent animatedPosition={animatedPosition} />
    );
    const searchResult = await waitFor(() =>
      rendered.getByText('Test Location')
    );
    expect(searchResult).toBeTruthy();
  });

  it('handles location selection and navigates to destination', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: () =>
        Promise.resolve({
          result: {
            geometry: { location: { lat: 10, lng: 20 } },
          },
        }),
    }) as jest.Mock;

    const rendered: RenderAPI = render(
      <BottomSheetComponent animatedPosition={animatedPosition} />
    );

    const searchResult = await waitFor(() =>
      rendered.getByText('Test Location')
    );

    fireEvent.press(searchResult);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('place_id=123')
      );
    });

    await waitFor(() => {
      expect(mockStartNavigationToDestination).toHaveBeenCalledWith({
        latitude: 10,
        longitude: 20,
      });
    });
  });
});
