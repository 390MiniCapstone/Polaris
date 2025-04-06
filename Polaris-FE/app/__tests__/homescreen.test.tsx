import { render } from '@testing-library/react-native';
import HomeScreen from '@/app/index';
import { AuthProvider } from '@/contexts/AuthContext/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BuildingProvider } from '@/contexts/BuildingContext/BuildingContext';
import { NavigationProvider } from '@/contexts/NavigationContext/NavigationContext';

jest.mock('@expo/vector-icons', () => {
  const { View } = require('react-native');
  const MockIcon = () => <View />;
  return {
    __esModule: true,
    Ionicons: MockIcon,
    FontAwesome5: MockIcon,
    MaterialIcons: MockIcon,
    MaterialCommunityIcons: MockIcon,
  };
});

jest.mock('expo-font', () => ({
  loadAsync: jest.fn(),
  isLoaded: jest.fn(() => true),
}));

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  return Reanimated;
});

jest.mock('sonner-native', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    Toaster: () => (
      <View testID="toaster">
        <Text>Toaster</Text>
      </View>
    ),
  };
});

jest.mock('@react-native-cookies/cookies', () => ({
  get: jest.fn(() => Promise.resolve({})),
  set: jest.fn(() => Promise.resolve()),
  clearAll: jest.fn(() => Promise.resolve()),
  clearByName: jest.fn(() => Promise.resolve()),
}));

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

describe('HomeScreen Minimal Test', () => {
  it('renders without crashing and displays "Campus"', async () => {
    const queryClient = createTestQueryClient();

    const { getByText } = render(
      <QueryClientProvider client={queryClient}>
        <BuildingProvider>
          <AuthProvider>
            <NavigationProvider>
              <HomeScreen />
            </NavigationProvider>
          </AuthProvider>
        </BuildingProvider>
      </QueryClientProvider>
    );

    expect(getByText('Campus')).toBeTruthy();
  });
});
