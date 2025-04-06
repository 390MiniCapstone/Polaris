import { renderHook, act } from '@testing-library/react-hooks';
import { useGoogleAuth } from '../useGoogleAuth';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { waitFor } from '@testing-library/react-native';

jest.mock('firebase/auth', () => ({
  GoogleAuthProvider: {
    credential: jest.fn(),
  },
  signInWithCredential: jest.fn(),
  getReactNativePersistence: jest.fn(() => 'mockPersistence'),
  initializeAuth: jest.fn(() => ({
    useDeviceLanguage: jest.fn(),
    setPersistence: jest.fn(),
  })),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

jest.mock('expo-auth-session/providers/google', () => ({
  useAuthRequest: jest.fn(() => [
    {
      type: 'success',
      params: { id_token: 'test_id_token', access_token: 'test_access_token' },
    },
    jest.fn(),
  ]),
}));

describe('useGoogleAuth', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('handles successful Google sign-in and stores user data', async () => {
    const mockAuthUser = { user: { uid: '12345', email: 'test@example.com' } };
    (GoogleAuthProvider.credential as jest.Mock).mockReturnValue(
      'mockCredential'
    );
    (signInWithCredential as jest.Mock).mockResolvedValue(mockAuthUser);

    const { result, waitForNextUpdate } = renderHook(() => useGoogleAuth());

    await act(async () => {
      await waitForNextUpdate();
    });

    expect(GoogleAuthProvider.credential).toHaveBeenCalledWith('test_id_token');
    expect(signInWithCredential).toHaveBeenCalledWith(
      expect.anything(),
      'mockCredential'
    );
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      '@user',
      JSON.stringify(mockAuthUser)
    );
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      '@access_token',
      'test_access_token'
    );
    expect(result.current.user).toEqual(mockAuthUser);
    expect(result.current.accessToken).toEqual('test_access_token');
  });

  it('does not proceed if response type is not success', async () => {
    const useAuthRequestMock = jest.requireMock(
      'expo-auth-session/providers/google'
    ).useAuthRequest;
    useAuthRequestMock.mockReturnValueOnce([{ type: 'error' }, jest.fn()]);

    const { result } = renderHook(() => useGoogleAuth());

    expect(result.current.user).toBeNull();
    expect(result.current.accessToken).toBeNull();
    expect(signInWithCredential).not.toHaveBeenCalled();
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });

  it('loads user and access token from AsyncStorage on initialization', async () => {
    const mockStoredUser = {
      user: { uid: '12345', email: 'test@example.com' },
    };
    const mockStoredToken = 'test_access_token';

    (AsyncStorage.getItem as jest.Mock).mockImplementation(key => {
      if (key === '@user')
        return Promise.resolve(JSON.stringify(mockStoredUser));
      if (key === '@access_token') return Promise.resolve(mockStoredToken);
      return Promise.resolve(null);
    });

    const { result, waitForNextUpdate } = renderHook(() => useGoogleAuth());

    await act(async () => {
      await waitForNextUpdate();
    });

    expect(AsyncStorage.getItem).toHaveBeenCalledWith('@user');
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('@access_token');
    expect(result.current.user).toEqual(mockStoredUser);
    expect(result.current.accessToken).toEqual(mockStoredToken);
  });

  it('clears user, access token, and AsyncStorage on logout', async () => {
    const mockStoredUser = {
      user: { uid: '12345', email: 'test@example.com' },
    };
    const mockStoredToken = 'test_access_token';

    // Mock AsyncStorage to simulate stored user and token
    (AsyncStorage.getItem as jest.Mock).mockImplementation(key => {
      if (key === '@user')
        return Promise.resolve(JSON.stringify(mockStoredUser));
      if (key === '@access_token') return Promise.resolve(mockStoredToken);
      return Promise.resolve(null);
    });

    const { result, waitForNextUpdate } = renderHook(() => useGoogleAuth());

    // Simulate loading the user and token
    await act(async () => {
      await waitForNextUpdate();
    });

    // Ensure the user and token are loaded
    expect(result.current.user).toEqual(mockStoredUser);
    expect(result.current.accessToken).toEqual(mockStoredToken);

    result.current.logout();

    // Wait for the state to update
    await waitFor(() => {
      const { user, accessToken } = result.current;

      expect(user).toBeNull();
      expect(accessToken).toBeNull();
    });

    // Verify that AsyncStorage items are removed
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('@user');
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('@access_token');
  });
});
