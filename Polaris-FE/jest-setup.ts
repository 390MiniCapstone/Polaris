// jest-setup.ts
import '@testing-library/jest-native/extend-expect';
import 'react-native-reanimated/mock';
import { jest } from '@jest/globals';

jest.mock('expo-font', () => ({
  useFonts: () => [true],
}));

jest.mock('expo-router');

jest.mock('expo-splash-screen', () => ({
  preventAutoHideAsync: jest.fn(),
  hideAsync: jest.fn(),
}));

jest.mock('@react-navigation/bottom-tabs', () => ({
  useBottomTabBarHeight: jest.fn(() => 50),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: jest.fn(() => ({ top: 0, bottom: 20, left: 0, right: 0 })),
}));

jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(() =>
    Promise.resolve({ status: 'granted' })
  ),
  getCurrentPositionAsync: jest.fn(() =>
    Promise.resolve({
      coords: { latitude: 37.7749, longitude: -122.4194 },
    })
  ),
  watchPositionAsync: jest.fn(
    async (
      _options: object,
      callback: (location: {
        coords: { latitude: number; longitude: number };
      }) => void
    ) => {
      callback({
        coords: { latitude: 37.7749, longitude: -122.4194 },
      });

      return { remove: jest.fn() };
    }
  ),
  Accuracy: {
    Lowest: 1,
    Low: 2,
    Balanced: 3,
    High: 4,
    Highest: 5,
    BestForNavigation: 6,
  },
}));

jest.mock('@gorhom/bottom-sheet', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: View,
    BottomSheetTextInput: View,
    BottomSheetView: View,
    BottomSheetScrollView: View,
  };
});

jest.mock('react-native-gesture-handler', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    GestureHandlerRootView: View,
    PanGestureHandler: View,
    TapGestureHandler: View,
    LongPressGestureHandler: View,
    BaseButton: View,
    RectButton: View,
    Directions: {},
    State: {
      UNDETERMINED: 'UNDETERMINED',
      BEGAN: 'BEGAN',
      FAILED: 'FAILED',
      ACTIVE: 'ACTIVE',
      END: 'END',
      CANCELLED: 'CANCELLED',
      PAN: 'PAN',
    },
  };
});

jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    SafeAreaProvider: View,
  };
});

jest.mock('react-native-maps', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: View,
    Marker: View,
    Geojson: View,
  };
});

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  return {
    ...Reanimated,
    useReducedMotion: jest.fn(() => false),
  };
});

jest.mock('firebase/app', () => ({
  getApps: jest.fn(() => []),
  initializeApp: jest.fn(() => ({ name: 'mockApp' })),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(() => ({
    collection: jest.fn(),
  })),
}));

jest.mock('firebase/auth', () => ({
  GoogleAuthProvider: {
    credential: jest.fn(() => ({
      accessToken: 'mock-access-token',
      idToken: 'mock-id-token',
    })),
  },
  signInWithCredential: jest.fn(() =>
    Promise.resolve({ user: { uid: 'mockUserId', email: 'mock@example.com' } })
  ),
  getAuth: jest.fn(() => ({
    currentUser: { uid: 'mockUserId', email: 'mock@example.com' },
    signOut: jest.fn(),
  })),
  initializeAuth: jest.fn(() => ({
    currentUser: null,
  })),
  getReactNativePersistence: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve(null)),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve(null)),
  clear: jest.fn(() => Promise.resolve(null)),
}));

jest.mock('expo-constants', () => ({
  __esModule: true,
  default: {
    expoConfig: {
      extra: {
        iosClientId: 'mock-ios-client-id',
        androidClientId: 'mock-android-client-id',
      },
    },
  },
}));

jest.mock('expo-auth-session/providers/google', () => ({
  useAuthRequest: jest.fn(() => [
    null,
    {
      type: 'success',
      params: { id_token: 'mock-id-token', access_token: 'mock-access-token' },
    },
    jest.fn(),
  ]),
}));

jest.mock('expo-font', () => ({
  loadAsync: jest.fn(),
  isLoaded: jest.fn(() => true),
}));

jest.mock('@expo/vector-icons', () => ({
  Ionicons: jest.fn(),
}));
