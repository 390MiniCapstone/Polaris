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
  });

  it('renders correctly', () => {
    const { getByPlaceholderText } = render(
      <GooglePlacesInput
        setSearchResults={mockSetSearchResults}
        onFocus={mockOnFocus}
      />
    );

    expect(getByPlaceholderText('Search Polaris')).toBeTruthy();
  });

  it('updates query state on text input', () => {
    const { getByPlaceholderText } = render(
      <GooglePlacesInput
        setSearchResults={mockSetSearchResults}
        onFocus={mockOnFocus}
      />
    );

    const input = getByPlaceholderText('Search Polaris');
    fireEvent.changeText(input, 'New York');

    expect(input.props.value).toBe('New York');
  });

  it('clears the query when clear button is pressed', () => {
    const { getByPlaceholderText, getByText } = render(
      <GooglePlacesInput
        setSearchResults={mockSetSearchResults}
        onFocus={mockOnFocus}
      />
    );

    const input = getByPlaceholderText('Search Polaris');
    fireEvent.changeText(input, 'New York');
    expect(input.props.value).toBe('New York');

    const clearButton = getByText('✕');
    fireEvent.press(clearButton);
    expect(input.props.value).toBe('');
  });

  it('fetches search results when query length is greater than 2', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            predictions: [{ description: 'New York, USA', place_id: '123' }],
          }),
      })
    ) as jest.Mock;

    const { getByPlaceholderText } = render(
      <GooglePlacesInput
        setSearchResults={mockSetSearchResults}
        onFocus={mockOnFocus}
      />
    );

    const input = getByPlaceholderText('Search Polaris');
    fireEvent.changeText(input, 'New York');

    await waitFor(() => {
      expect(mockSetSearchResults).toHaveBeenCalledWith([
        { description: 'New York, USA', place_id: '123' },
      ]);
    });
  });

  it('does not fetch results when query length is 2 or less', async () => {
    const { getByPlaceholderText } = render(
      <GooglePlacesInput
        setSearchResults={mockSetSearchResults}
        onFocus={mockOnFocus}
      />
    );

    const input = getByPlaceholderText('Search Polaris');
    fireEvent.changeText(input, 'NY');

    await waitFor(() => {
      expect(mockSetSearchResults).toHaveBeenCalledWith([]);
    });
  });
});
