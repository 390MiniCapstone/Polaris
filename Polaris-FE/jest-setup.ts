// jest-setup.ts
import '@testing-library/jest-native/extend-expect';

jest.mock('expo-font', () => ({
  useFonts: () => [true], // Pretend fonts are always loaded
}));

jest.mock('expo-router');

jest.mock('expo-splash-screen', () => ({
  preventAutoHideAsync: jest.fn(),
  hideAsync: jest.fn(),
}));

jest.mock('@react-navigation/bottom-tabs', () => ({
  useBottomTabBarHeight: jest.fn(() => 50), // Mock tab bar height
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: jest.fn(() => ({ top: 0, bottom: 20, left: 0, right: 0 })),
}));
