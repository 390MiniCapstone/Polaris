import { AuthProvider } from '@/contexts/AuthContext/AuthContext';
import { NavigationProvider } from '@/contexts/NavigationContext/NavigationContext';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { OutdoorBottomSheetComponent } from '@/components/BottomSheetComponent/OutdoorBottomSheetComponent';
import { Keyboard } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSharedValue } from 'react-native-reanimated';
import { bottomSheetRef } from '@/utils/refs';
import { inputRef } from '@/utils/refs';

const queryClient = new QueryClient();

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    __esModule: true,
    MaterialIcons: (props: { name: string; style?: object }) => {
      const { name, style } = props;
      return <View testID={`icon-${name}`} style={style} />;
    },
  };
});

describe('OutdoorBottomSheetComponent', () => {
  it('renders without crashing', () => {
    const animatedPosition = useSharedValue(0);

    const { getByTestId, getByText } = render(
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <NavigationProvider>
            <OutdoorBottomSheetComponent animatedPosition={animatedPosition} />
          </NavigationProvider>
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
  const { View } = require('react-native');

  return {
    __esModule: true,
    BottomSheetComponent: ({ children }: { children: React.ReactNode }) => (
      <View testID="bottom-sheet-mock">{children}</View>
    ),
  };
});

jest.mock('@/components/GooglePlacesInput', () => {
  const { View, Text, TouchableOpacity } = require('react-native');

  const POIS = ['Groceries', 'Library', 'Cafe'];

  return {
    __esModule: true,
    default: ({
      setSearchResults,
      onFocus,
    }: {
      setSearchResults: Function;
      onFocus: Function;
    }) => (
      <View testID="google-places-input">
        <TouchableOpacity
          testID="search-result-trigger"
          onPress={() => {
            setSearchResults([
              { place_id: 'place1', description: 'Test Location 1' },
              { place_id: 'place2', description: 'Test Location 2' },
            ]);
          }}
        >
          <Text>Trigger Search Results</Text>
        </TouchableOpacity>

        <TouchableOpacity testID="focus-trigger" onPress={onFocus}>
          <Text>Focus Input</Text>
        </TouchableOpacity>

        {POIS.map(category => (
          <TouchableOpacity
            key={category}
            testID={`poi-button-${category.toLowerCase()}`}
            onPress={() => {
              setSearchResults([
                { place_id: 'place1', description: `${category} Result 1` },
                { place_id: 'place2', description: `${category} Result 2` },
              ]);
            }}
          >
            <Text>{category}</Text>
          </TouchableOpacity>
        ))}
      </View>
    ),
  };
});

jest.mock('@/utils/refs', () => ({
  bottomSheetRef: {
    current: {
      snapToIndex: jest.fn(),
    },
  },
  inputRef: {
    current: {
      blur: jest.fn(),
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

describe('OutdoorBottomSheetComponent', () => {
  it('renders GooglePlacesInput and NextClassCard', () => {
    const animatedPosition = useSharedValue(0);

    const { getByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <NavigationProvider>
            <OutdoorBottomSheetComponent animatedPosition={animatedPosition} />
          </NavigationProvider>
        </AuthProvider>
      </QueryClientProvider>
    );

    expect(getByTestId('google-places-input')).toBeTruthy();
    expect(getByTestId('bottom-sheet-mock')).toBeTruthy();
  });

  it('handles search result selection correctly', async () => {
    const animatedPosition = useSharedValue(0);

    const { getByTestId, getByText } = render(
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <NavigationProvider>
            <OutdoorBottomSheetComponent animatedPosition={animatedPosition} />
          </NavigationProvider>
        </AuthProvider>
      </QueryClientProvider>
    );

    fireEvent.press(getByTestId('search-result-trigger'));

    await waitFor(() => {
      expect(getByText('Test Location 1')).toBeTruthy();
      expect(getByText('Test Location 2')).toBeTruthy();
    });

    jest.spyOn(Keyboard, 'dismiss');

    fireEvent.press(getByText('Test Location 1'));

    await waitFor(() => {
      expect(Keyboard.dismiss).toHaveBeenCalled();
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining(
          'https://maps.googleapis.com/maps/api/place/details/json?place_id=place1&key='
        )
      );
      expect(inputRef.current?.blur).toHaveBeenCalled();
    });
  });

  it('handles fetch errors gracefully', async () => {
    global.fetch = jest.fn(() =>
      Promise.reject(new Error('Fetch failed'))
    ) as jest.Mock;

    const animatedPosition = useSharedValue(0);

    const { getByTestId, getByText } = render(
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <NavigationProvider>
            <OutdoorBottomSheetComponent animatedPosition={animatedPosition} />
          </NavigationProvider>
        </AuthProvider>
      </QueryClientProvider>
    );

    fireEvent.press(getByTestId('search-result-trigger'));

    await waitFor(() => {
      expect(getByText('Test Location 1')).toBeTruthy();
    });

    fireEvent.press(getByText('Test Location 1'));

    await waitFor(() => {
      expect(inputRef.current?.blur).toHaveBeenCalled();
      expect(bottomSheetRef.current?.snapToIndex).not.toHaveBeenCalled();
    });
  });

  it('calls onFocus and snaps the bottom sheet to the correct index', () => {
    const animatedPosition = useSharedValue(0);

    const { getByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <NavigationProvider>
            <OutdoorBottomSheetComponent animatedPosition={animatedPosition} />
          </NavigationProvider>
        </AuthProvider>
      </QueryClientProvider>
    );

    fireEvent.press(getByTestId('focus-trigger'));

    expect(bottomSheetRef.current?.snapToIndex).toHaveBeenCalledWith(3);
  });

  it('renders search results and separators correctly', async () => {
    const animatedPosition = useSharedValue(0);

    const { getByTestId, getAllByTestId, getByText } = render(
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <NavigationProvider>
            <OutdoorBottomSheetComponent animatedPosition={animatedPosition} />
          </NavigationProvider>
        </AuthProvider>
      </QueryClientProvider>
    );

    fireEvent.press(getByTestId('search-result-trigger'));

    await waitFor(() => {
      expect(getByText('Test Location 1')).toBeTruthy();
      expect(getByText('Test Location 2')).toBeTruthy();
    });
  });

  it('handles missing data in fetch response gracefully', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            result: null,
          }),
      })
    ) as jest.Mock;

    const animatedPosition = useSharedValue(0);

    const { getByTestId, getByText } = render(
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <NavigationProvider>
            <OutdoorBottomSheetComponent animatedPosition={animatedPosition} />
          </NavigationProvider>
        </AuthProvider>
      </QueryClientProvider>
    );

    fireEvent.press(getByTestId('search-result-trigger'));

    await waitFor(() => {
      expect(getByText('Test Location 1')).toBeTruthy();
    });

    fireEvent.press(getByText('Test Location 1'));

    await waitFor(() => {
      expect(inputRef.current?.blur).toHaveBeenCalled();
      expect(bottomSheetRef.current?.snapToIndex).toHaveBeenCalled();
    });
  });

  it('handles malformed geometry in fetch response gracefully', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            result: {
              geometry: null,
            },
          }),
      })
    ) as jest.Mock;

    const animatedPosition = useSharedValue(0);

    const { getByTestId, getByText } = render(
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <NavigationProvider>
            <OutdoorBottomSheetComponent animatedPosition={animatedPosition} />
          </NavigationProvider>
        </AuthProvider>
      </QueryClientProvider>
    );

    fireEvent.press(getByTestId('search-result-trigger'));

    await waitFor(() => {
      expect(getByText('Test Location 1')).toBeTruthy();
    });

    fireEvent.press(getByText('Test Location 1'));

    await waitFor(() => {
      expect(inputRef.current?.blur).toHaveBeenCalled();
      expect(bottomSheetRef.current?.snapToIndex).toHaveBeenCalled();
    });
  });

  it('renders POI buttons and shows mocked POI search results when pressed', async () => {
    const animatedPosition = useSharedValue(0);

    const { getByText } = render(
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <NavigationProvider>
            <OutdoorBottomSheetComponent animatedPosition={animatedPosition} />
          </NavigationProvider>
        </AuthProvider>
      </QueryClientProvider>
    );

    const groceriesButton = getByText('Groceries');
    fireEvent.press(groceriesButton);

    await waitFor(() => {
      expect(getByText('Groceries Result 1')).toBeTruthy();
      expect(getByText('Groceries Result 2')).toBeTruthy();
    });
  });
});
