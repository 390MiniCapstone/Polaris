import { render, fireEvent, waitFor } from '@testing-library/react-native';
import GooglePlacesInput from '@/components/GooglePlacesInput/GooglePlacesInput';
import { useMapLocation } from '@/hooks/useMapLocation';
import { SearchResult } from '../BottomSheetComponent/OutdoorBottomSheetComponent';

jest.mock('@/hooks/useMapLocation', () => ({
  useMapLocation: jest.fn(),
}));

describe('GooglePlacesInput', () => {
  const setSearchResultsMock = jest.fn();
  const searchResultsMock: SearchResult[] = [
    {
      place_id: 'place1',
      description: 'Test Location 1',
      latitude: 0,
      longitude: 0,
    },
    {
      place_id: 'place2',
      description: 'Test Location 2',
      latitude: 0,
      longitude: 0,
    },
  ];
  const onFocusMock = jest.fn();
  const setQueryMock = jest.fn();

  const fakeLocation = { latitude: 10, longitude: 20 };

  beforeEach(() => {
    jest.clearAllMocks();
    (useMapLocation as jest.Mock).mockReturnValue({ location: fakeLocation });
  });

  test('renders correctly without clear button when searchResults is empty', () => {
    const { queryByTestId, queryByText } = render(
      <GooglePlacesInput
        searchResults={[]}
        setSearchResults={setSearchResultsMock}
        onFocus={onFocusMock}
        query="anything"
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
        searchResults={searchResultsMock}
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
        searchResults={searchResultsMock}
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
        searchResults={searchResultsMock}
        setSearchResults={setSearchResultsMock}
        onFocus={onFocusMock}
        query=""
        setQuery={setQueryMock}
      />
    );

    rerender(
      <GooglePlacesInput
        searchResults={searchResultsMock}
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
        searchResults={searchResultsMock}
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
        searchResults={searchResultsMock}
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

  it('sets an empty array when data.predictions is null or undefined', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ predictions: null }),
      })
    ) as jest.Mock;

    const setSearchResultsMock = jest.fn();

    const { rerender } = render(
      <GooglePlacesInput
        searchResults={[]}
        setSearchResults={setSearchResultsMock}
        onFocus={jest.fn()}
        query=""
        setQuery={jest.fn()}
      />
    );

    rerender(
      <GooglePlacesInput
        searchResults={[]}
        setSearchResults={setSearchResultsMock}
        onFocus={jest.fn()}
        query="test"
        setQuery={jest.fn()}
      />
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
      expect(setSearchResultsMock).toHaveBeenCalledWith([]);
    });
  });

  test('clears timeout when a new query is entered', async () => {
    jest.useFakeTimers();
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
    const setSearchResultsMock = jest.fn();

    const { rerender } = render(
      <GooglePlacesInput
        searchResults={[]}
        setSearchResults={setSearchResultsMock}
        onFocus={jest.fn()}
        query="initial"
        setQuery={jest.fn()}
      />
    );

    rerender(
      <GooglePlacesInput
        searchResults={[]}
        setSearchResults={setSearchResultsMock}
        onFocus={jest.fn()}
        query="new query"
        setQuery={jest.fn()}
      />
    );

    expect(clearTimeoutSpy).toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();
    jest.useRealTimers();
  });

  test('clears timeout on component unmount', async () => {
    jest.useFakeTimers();
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
    const setSearchResultsMock = jest.fn();

    const { unmount } = render(
      <GooglePlacesInput
        searchResults={[]}
        setSearchResults={setSearchResultsMock}
        onFocus={jest.fn()}
        query="test"
        setQuery={jest.fn()}
      />
    );

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();
    jest.useRealTimers();
  });

  test('logs an error when fetch fails', async () => {
    const consoleErrorMock = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    global.fetch = jest.fn(() => Promise.reject(new Error('Fetch failed')));

    const setSearchResultsMock = jest.fn();

    render(
      <GooglePlacesInput
        searchResults={[]}
        setSearchResults={setSearchResultsMock}
        onFocus={jest.fn()}
        query="test"
        setQuery={jest.fn()}
      />
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
      expect(consoleErrorMock).toHaveBeenCalledWith(expect.any(Error));
    });

    consoleErrorMock.mockRestore();
  });
});
