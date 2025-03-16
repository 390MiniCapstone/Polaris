export const useRouter = jest.fn(() => ({
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
}));

export const useLocalSearchParams = jest.fn(() => ({}));

export const useNavigation = jest.fn(() => ({
  setOptions: jest.fn(),
}));

export const useSegments = jest.fn(() => []);

export const Stack = ({ children }) => <>{children}</>;

Stack.Screen = ({ children }) => children;
