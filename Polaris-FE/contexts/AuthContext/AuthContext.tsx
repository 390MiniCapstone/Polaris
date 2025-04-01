import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from 'react';
import * as Google from 'expo-auth-session/providers/google';
import {
  GoogleAuthProvider,
  signInWithCredential,
  UserCredential,
} from 'firebase/auth';
import { auth } from '@/firebase/firebaseConfig';
import * as WebBrowser from 'expo-web-browser';
import Constants from 'expo-constants';
import { authStorage } from './authStorage';
import { refreshAccessToken } from './authService';

WebBrowser.maybeCompleteAuthSession();

type AuthContextType = {
  user: UserCredential | null;
  accessToken: string | null;
  refreshAccessToken: () => Promise<string | null>;
  promptAsync: () => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserCredential | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const [, response, promptAsync] = Google.useAuthRequest({
    iosClientId: Constants.expoConfig?.extra?.iosClientId,
    androidClientId: Constants.expoConfig?.extra?.androidClientId,
    scopes: [
      'https://www.googleapis.com/auth/calendar.readonly',
      'https://www.googleapis.com/auth/calendar.events.readonly',
    ],
    extraParams: {
      access_type: 'offline',
      prompt: 'consent',
    },
  });

  useEffect(() => {
    const loadStoredAuth = async () => {
      const storedUser = await authStorage.getUser();
      const storedAccessToken = await authStorage.getAccessToken();
      setUser(storedUser);
      setAccessToken(storedAccessToken);
    };

    loadStoredAuth();
  }, []);

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token, access_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);

      signInWithCredential(auth, credential)
        .then(async authUser => {
          setUser(authUser);
          setAccessToken(access_token || null);
          await authStorage.saveAuthData(
            authUser,
            access_token || '',
            response.authentication?.refreshToken
          );
        })
        .catch(console.error);
    }
  }, [response]);

  useEffect(() => {
    if (!accessToken) return;
    const refreshInterval = setInterval(refreshAccessToken, 55 * 60 * 1000);
    return () => clearInterval(refreshInterval);
  }, [accessToken]);

  const logout = async () => {
    setUser(null);
    setAccessToken(null);
    await authStorage.clearAuthData();
  };

  const contextValue = useMemo(
    () => ({ user, accessToken, refreshAccessToken, promptAsync, logout }),
    [user, accessToken]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useGoogleAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useGoogleAuth must be used within an AuthProvider');
  }
  return context;
};
