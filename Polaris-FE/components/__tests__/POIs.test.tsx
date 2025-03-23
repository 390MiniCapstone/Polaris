import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { POIS as POI_CATEGORIES } from '@/constants/mapConstants';
import { useMapLocation } from '@/hooks/useMapLocation';
import { POIs } from '../POIs/POIs';

jest.mock('@/hooks/useMapLocation', () => ({
  useMapLocation: jest.fn(),
}));

const mockSetSearchResults = jest.fn();
const mockLocation = { latitude: 45.5017, longitude: -73.5673 };

describe('<POIs />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useMapLocation as jest.Mock).mockReturnValue({ location: mockLocation });
    global.fetch = jest.fn();
  });

  it('renders all POI categories', () => {
    const { getByText } = render(
      <POIs setSearchResults={mockSetSearchResults} />
    );
    POI_CATEGORIES.forEach(category => {
      expect(getByText(category)).toBeTruthy();
    });
  });

  it('disables button when loading', async () => {
    const mockResults: never[] = [];
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ results: mockResults }),
    });

    const { getByText } = render(
      <POIs setSearchResults={mockSetSearchResults} />
    );
    const firstCategory = POI_CATEGORIES[0];
    const button = getByText(firstCategory);

    fireEvent.press(button);

    await waitFor(() => {
      expect(() => getByText(firstCategory)).toThrow();
    });
  });

  it('fetches POIs on category press and updates results', async () => {
    const mockResults = [{ name: 'POI 1' }, { name: 'POI 2' }];
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ results: mockResults }),
    });

    const { getByText } = render(
      <POIs setSearchResults={mockSetSearchResults} />
    );
    const button = getByText(POI_CATEGORIES[0]);

    fireEvent.press(button);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
      expect(mockSetSearchResults).toHaveBeenCalledWith(mockResults);
    });
  });

  it('handles fetch failure gracefully', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error('Network Error')
    );

    const { getByText } = render(
      <POIs setSearchResults={mockSetSearchResults} />
    );
    const button = getByText(POI_CATEGORIES[0]);

    fireEvent.press(button);

    await waitFor(() => {
      expect(mockSetSearchResults).toHaveBeenCalledWith([]);
    });
  });

  it('does not fetch if location is missing', async () => {
    (useMapLocation as jest.Mock).mockReturnValue({ location: null });

    const { getByText } = render(
      <POIs setSearchResults={mockSetSearchResults} />
    );
    const button = getByText(POI_CATEGORIES[0]);

    fireEvent.press(button);

    await waitFor(() => {
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });
});
