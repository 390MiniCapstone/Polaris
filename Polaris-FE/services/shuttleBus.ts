import { ShuttleBusResponse } from '@/constants/types';
import { toast } from 'sonner-native';
import CookieManager from '@react-native-cookies/cookies';

const getShuttleCookie = async (): Promise<string> => {
  try {
    await fetch('https://shuttle.concordia.ca/concordiabusmap/Map.aspx', {
      method: 'GET',
      headers: {
        Host: 'shuttle.concordia.ca',
      },
    });

    const cookieData = await CookieManager.get('https://shuttle.concordia.ca');

    const cookie = Object.entries(cookieData)
      .map(([key, cookie]) => `${key}=${cookie.value}`)
      .join('; ');

    if (!cookie) {
      throw new Error('Cookie not found in cookie storage.');
    }

    return cookie;
  } catch (error) {
    console.error('Error fetching cookie:', error);
    throw error;
  }
};

export const getShuttleBus = async (): Promise<ShuttleBusResponse> => {
  try {
    const response = await fetch(
      'https://shuttle.concordia.ca/concordiabusmap/WebService/GService.asmx/GetGoogleObject',
      {
        method: 'POST',
        headers: {
          Host: 'shuttle.concordia.ca',
          'Content-Length': '0',
          'Content-Type': 'application/json; charset=UTF-8',
        },
      }
    );

    if (response.status !== 200) {
      await getShuttleCookie();
      return getShuttleBus();
    }

    const data = await response.json();

    return data;
  } catch (error) {
    toast.error('Error fetching shuttle bus data', {
      description: `${error instanceof Error ? error.message : 'Unknown error'}`,
      duration: 2000,
    });
    throw error;
  }
};
