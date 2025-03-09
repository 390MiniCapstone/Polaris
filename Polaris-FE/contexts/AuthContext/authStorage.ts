import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserCredential } from 'firebase/auth';

const STORAGE_KEYS = {
  USER: '@user',
  ACCESS_TOKEN: '@access_token',
  REFRESH_TOKEN: '@refresh_token',
  SELECT_CALENDAR_ID: '@selectedCalendarId',
  SELECT_CALENDAR_NAME: '@selectedCalendarNAME',
};

export const authStorage = {
  async getUser() {
    const storedUser = await AsyncStorage.getItem(STORAGE_KEYS.USER);
    return storedUser ? JSON.parse(storedUser) : null;
  },

  async getAccessToken() {
    return await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  },

  async getRefreshToken() {
    return await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  },

  async saveAuthData(
    user?: UserCredential,
    accessToken?: string,
    refreshToken?: string
  ) {
    if (user !== undefined) {
      await AsyncStorage.setItem('@user', JSON.stringify(user));
    }
    if (accessToken !== undefined) {
      await AsyncStorage.setItem('@access_token', accessToken);
    }
    if (refreshToken !== undefined) {
      await AsyncStorage.setItem('@refresh_token', refreshToken);
    }
  },

  async clearAuthData() {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER);
    await AsyncStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    await AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    await AsyncStorage.removeItem(STORAGE_KEYS.SELECT_CALENDAR_ID);
    await AsyncStorage.removeItem(STORAGE_KEYS.SELECT_CALENDAR_NAME);
  },
};
