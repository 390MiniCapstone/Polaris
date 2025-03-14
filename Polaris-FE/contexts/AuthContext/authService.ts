import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { authStorage } from './authStorage';

export async function refreshAccessToken() {
  const refreshToken = await authStorage.getRefreshToken();
  if (!refreshToken) {
    console.warn('No refresh token available.');
    return null;
  }

  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id:
          Platform.OS === 'ios'
            ? Constants.expoConfig?.extra?.iosClientId
            : Constants.expoConfig?.extra?.androidClientId,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }).toString(),
    });

    const data = await response.json();

    if (data.access_token) {
      await authStorage.saveAuthData(undefined, data.access_token);
      console.log('🔄 Access token refreshed.');
      return data.access_token;
    } else {
      console.error('Failed to refresh access token:', data);
      return null;
    }
  } catch (error) {
    console.error('Error refreshing access token:', error);
    return null;
  }
}
