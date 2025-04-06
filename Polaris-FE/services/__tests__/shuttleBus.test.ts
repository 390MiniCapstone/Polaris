import { getShuttleBus, getShuttleCookie } from '@/services/shuttleBus';
import { toast } from 'sonner-native';
import CookieManager from '@react-native-cookies/cookies';

jest.mock('sonner-native', () => ({
  toast: {
    error: jest.fn(),
  },
}));

jest.mock('@react-native-cookies/cookies', () => ({
  get: jest.fn(),
}));

global.fetch = jest.fn();

const originalConsoleError = console.error;
console.error = jest.fn();

describe('Shuttle Bus Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    console.error = originalConsoleError;
  });

  describe('getShuttleCookie', () => {
    it('should fetch and return cookie string', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        status: 200,
      });

      (CookieManager.get as jest.Mock).mockResolvedValueOnce({
        ASP_NET_SessionId: { value: 'session123' },
        _ga: { value: 'GA1.2.123456789.1234567890' },
      });

      const result = await getShuttleCookie();

      expect(global.fetch).toHaveBeenCalledWith(
        'https://shuttle.concordia.ca/concordiabusmap/Map.aspx',
        {
          method: 'GET',
          headers: {
            Host: 'shuttle.concordia.ca',
          },
        }
      );

      expect(CookieManager.get).toHaveBeenCalledWith(
        'https://shuttle.concordia.ca'
      );

      expect(result).toBe(
        'ASP_NET_SessionId=session123; _ga=GA1.2.123456789.1234567890'
      );
    });

    it('should throw error when no cookies are found', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        status: 200,
      });

      (CookieManager.get as jest.Mock).mockResolvedValueOnce({});

      await expect(getShuttleCookie()).rejects.toThrow(
        'Cookie not found in cookie storage.'
      );

      expect(console.error).toHaveBeenCalled();
    });

    it('should propagate fetch errors', async () => {
      const fetchError = new Error('Network error');
      (global.fetch as jest.Mock).mockRejectedValueOnce(fetchError);

      await expect(getShuttleCookie()).rejects.toThrow('Network error');

      expect(console.error).toHaveBeenCalledWith(
        'Error fetching cookie:',
        fetchError
      );
    });
  });

  describe('getShuttleBus', () => {
    it('should fetch and return shuttle bus data', async () => {
      const mockResponse = {
        d: {
          buses: [{ id: 1, location: { lat: 45.123, lng: -73.456 } }],
          routes: [{ id: 1, name: 'Loyola Campus' }],
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        status: 200,
        json: jest.fn().mockResolvedValueOnce(mockResponse),
      });

      const result = await getShuttleBus();

      expect(global.fetch).toHaveBeenCalledWith(
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

      expect(result).toEqual(mockResponse);
    });

    it('should retry with new cookie when response status is not 200', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        status: 401,
      });

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        status: 200,
      });
      (CookieManager.get as jest.Mock).mockResolvedValueOnce({
        ASP_NET_SessionId: { value: 'newsession456' },
      });

      const mockResponse = { d: { buses: [], routes: [] } };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        status: 200,
        json: jest.fn().mockResolvedValueOnce(mockResponse),
      });

      const result = await getShuttleBus();

      expect(global.fetch).toHaveBeenCalledTimes(3);
      expect(result).toEqual(mockResponse);
    });

    it('should show toast and throw error when fetch fails', async () => {
      const fetchError = new Error('API error');
      (global.fetch as jest.Mock).mockRejectedValueOnce(fetchError);

      await expect(getShuttleBus()).rejects.toThrow('API error');

      expect(toast.error).toHaveBeenCalledWith(
        'Error fetching shuttle bus data',
        {
          description: 'API error',
          duration: 2000,
        }
      );
    });
  });
});
