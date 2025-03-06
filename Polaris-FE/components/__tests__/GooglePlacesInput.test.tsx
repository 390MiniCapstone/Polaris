import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import GooglePlacesInput from '@/components/GooglePlacesInput';
import { useMapLocation } from '@/hooks/useMapLocation';

jest.mock('@/hooks/useMapLocation', () => ({
  useMapLocation: jest.fn(),
}));

describe('GooglePlacesInput', () => {
  const setSearchResultsMock = jest.fn();
  const onFocusMock = jest.fn();
  const setQueryMock = jest.fn();

  const fakeLocation = { latitude: 10, longitude: 20 };

  beforeEach(() => {
    jest.clearAllMocks();
    (useMapLocation as jest.Mock).mockReturnValue({ location: fakeLocation });
  });

  test('renders correctly without clear button when query is empty', () => {
    const { queryByTestId, queryByText } = render(
      <GooglePlacesInput
        setSearchResults={setSearchResultsMock}
        onFocus={onFocusMock}
        query=""
        setQuery={setQueryMock}
      />
    );

    const input = queryByTestId('places-input');
    expect(input).toBeTruthy();

    const clearButton = queryByText('✕');
    expect(clearButton).toBeNull();
  });

  test('calls onFocus when the input is focused', () => {
    const { getByTestId } = render(
      <GooglePlacesInput
        setSearchResults={setSearchResultsMock}
        onFocus={onFocusMock}
        query=""
        setQuery={setQueryMock}
      />
    );

    const input = getByTestId('places-input');
    fireEvent(input, 'focus');
    expect(onFocusMock).toHaveBeenCalled();
  });

  test('displays clear button when query is non-empty and clears query when pressed', () => {
    const { getByText } = render(
      <GooglePlacesInput
        setSearchResults={setSearchResultsMock}
        onFocus={onFocusMock}
        query="test"
        setQuery={setQueryMock}
      />
    );

    const clearButton = getByText('✕');
    expect(clearButton).toBeTruthy();

    fireEvent.press(clearButton);
    expect(setQueryMock).toHaveBeenCalledWith('');
  });

  test('calls fetch and updates search results when query is provided and location exists', async () => {
    const fakePredictions = [{ place_id: '1', description: 'Test Place' }];
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue({ predictions: fakePredictions }),
    });

    const { rerender } = render(
      <GooglePlacesInput
        setSearchResults={setSearchResultsMock}
        onFocus={onFocusMock}
        query=""
        setQuery={setQueryMock}
      />
    );

    rerender(
      <GooglePlacesInput
        setSearchResults={setSearchResultsMock}
        onFocus={onFocusMock}
        query="New Query"
        setQuery={setQueryMock}
      />
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
      expect(setSearchResultsMock).toHaveBeenCalledWith(fakePredictions);
    });
  });

  test('does not call fetch and sets search results to empty array when query is empty', async () => {
    global.fetch = jest.fn();

    render(
      <GooglePlacesInput
        setSearchResults={setSearchResultsMock}
        onFocus={onFocusMock}
        query=""
        setQuery={setQueryMock}
      />
    );

    await waitFor(() => {
      expect(global.fetch).not.toHaveBeenCalled();
      expect(setSearchResultsMock).toHaveBeenCalledWith([]);
    });
  });

  test('does not call fetch when location is undefined', async () => {
    (useMapLocation as jest.Mock).mockReturnValue({ location: null });
    global.fetch = jest.fn();

    render(
      <GooglePlacesInput
        setSearchResults={setSearchResultsMock}
        onFocus={onFocusMock}
        query="Some Query"
        setQuery={setQueryMock}
      />
    );

    await waitFor(() => {
      expect(global.fetch).not.toHaveBeenCalled();
      expect(setSearchResultsMock).toHaveBeenCalledWith([]);
    });
  });
});
