import { ShuttleBusResponse } from '@/constants/types';
import { toast } from 'sonner-native';

let cookie: string | null = null;

const getShuttleCookie = async (): Promise<string> => {
  try {
    const response = await fetch(
      'https://shuttle.concordia.ca/concordiabusmap/Map.aspx',
      {
        method: 'GET',
        headers: {
          Host: 'shuttle.concordia.ca',
        },
      }
    );

    const newCookie = response.headers.get('Set-Cookie');

    if (!newCookie) {
      throw new Error('Cookie not found in response headers.');
    }

    cookie = newCookie;
    return newCookie;
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
          'Content-Type': 'application/json',
          charset: 'UTF-8',
          Cookie: cookie ? cookie : await getShuttleCookie(),
        },
      }
    );

    if (response.status !== 200) {
      cookie = await getShuttleCookie();
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
