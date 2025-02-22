import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import GooglePlacesInput from '@/components/GooglePlacesInput';

jest.mock('@/hooks/useMapLocation', () => ({
  useMapLocation: () => ({
    location: { latitude: 37.7749, longitude: -122.4194 },
  }),
}));

describe('GooglePlacesInput', () => {
  const mockSetSearchResults = jest.fn();
  const mockOnFocus = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            predictions: [{ description: 'New York, USA', place_id: '123' }],
          }),
      } as Response)
    );
  });

  it('renders correctly', () => {
    const { getByTestId } = render(
      <GooglePlacesInput
        setSearchResults={mockSetSearchResults}
        onFocus={mockOnFocus}
      />
    );

    expect(getByTestId('places-input')).toBeTruthy();
  });

  it('updates query state on text input', async () => {
    const { getByTestId } = render(
      <GooglePlacesInput
        setSearchResults={mockSetSearchResults}
        onFocus={mockOnFocus}
      />
    );

    const input = getByTestId('places-input');
    fireEvent.changeText(input, 'New York');

    await waitFor(() => {
      expect(input.props.value).toBe('New York');
    });
  });

  it('clears the query when clear button is pressed', async () => {
    const { getByTestId, findByText } = render(
      <GooglePlacesInput
        setSearchResults={mockSetSearchResults}
        onFocus={mockOnFocus}
      />
    );

    const input = getByTestId('places-input');
    fireEvent.changeText(input, 'New York');

    expect(input.props.value).toBe('New York');

    const clearButton = await findByText('✕');
    fireEvent.press(clearButton);

    await waitFor(() => {
      expect(input.props.value).toBe('');
    });
  });

  it('fetches search results when query length is greater than 2', async () => {
    const { getByTestId } = render(
      <GooglePlacesInput
        setSearchResults={mockSetSearchResults}
        onFocus={mockOnFocus}
      />
    );

    const input = getByTestId('places-input');
    fireEvent.changeText(input, 'New York');

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
      expect(mockSetSearchResults).toHaveBeenCalledWith([
        { description: 'New York, USA', place_id: '123' },
      ]);
    });
  });
});
