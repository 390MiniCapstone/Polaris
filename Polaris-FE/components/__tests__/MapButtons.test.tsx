import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { MapButtons } from '@/components/MapButtons';
import {
  handleCampusSelect,
  handleCampusToggle,
  handleCurrentLocation,
} from '@/utils/mapHandlers';
import { mapRef } from '@/utils/refs';
import { Downtown, Loyola } from '@/constants/mapConstants';
import { useMapLocation } from '@/hooks/useMapLocation';
import { SharedValue } from 'react-native-reanimated';

jest.mock('expo-font', () => ({
  loadAsync: jest.fn(() => Promise.resolve()),
  isLoaded: jest.fn(() => true),
}));

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    FontAwesome5: (props: any) => <View {...props} />,
  };
});

const createDummySharedValue = (initialValue: number): SharedValue<number> => {
  let _value = initialValue;
  return {
    value: _value,
    get: () => _value,
    set: (newValue: number) => {
      _value = newValue;
    },
    addListener: jest.fn(),
    removeListener: jest.fn(),
    modify: jest.fn(),
  };
};

const optionsAnimation = createDummySharedValue(1);
const animatedPosition = createDummySharedValue(200);
const toggleAnimation = createDummySharedValue(0);

jest.mock('@/utils/mapHandlers', () => ({
  handleCampusSelect: jest.fn(),
  handleCampusToggle: jest.fn(),
  handleCurrentLocation: jest.fn(),
}));

// Mock the mapRef.
jest.mock('@/utils/refs', () => ({
  mapRef: { current: {} },
}));

jest.mock('@/hooks/useMapLocation', () => ({
  useMapLocation: jest.fn(),
}));

describe('MapButtons', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useMapLocation as jest.Mock).mockReturnValue({
      location: { latitude: 10, longitude: 20 },
    });
  });

  it('renders the component with required buttons', () => {
    const { getByTestId, getByText } = render(
      <MapButtons
        optionsAnimation={optionsAnimation}
        animatedPosition={animatedPosition}
        toggleAnimation={toggleAnimation}
      />
    );

    expect(getByTestId('animated-container')).toBeTruthy();

    const campusToggleButton = getByTestId('button-campus');
    expect(campusToggleButton).toBeTruthy();
    expect(getByText('Campus')).toBeTruthy();

    expect(getByTestId('button-current-location')).toBeTruthy();

    expect(getByText('Downtown')).toBeTruthy();
    expect(getByText('Loyola')).toBeTruthy();
  });

  it('calls handleCampusSelect with Downtown when the Downtown option is pressed', () => {
    const { getByText } = render(
      <MapButtons
        optionsAnimation={optionsAnimation}
        animatedPosition={animatedPosition}
        toggleAnimation={toggleAnimation}
      />
    );

    fireEvent.press(getByText('Downtown'));

    expect(handleCampusSelect).toHaveBeenCalledWith(
      Downtown,
      mapRef,
      expect.any(Function),
      toggleAnimation,
      optionsAnimation
    );
  });

  it('calls handleCampusSelect with Loyola when the Loyola option is pressed', () => {
    const { getByText } = render(
      <MapButtons
        optionsAnimation={optionsAnimation}
        animatedPosition={animatedPosition}
        toggleAnimation={toggleAnimation}
      />
    );

    fireEvent.press(getByText('Loyola'));

    expect(handleCampusSelect).toHaveBeenCalledWith(
      Loyola,
      mapRef,
      expect.any(Function),
      toggleAnimation,
      optionsAnimation
    );
  });

  it('calls handleCampusToggle when the Campus toggle button is pressed', () => {
    const { getByTestId } = render(
      <MapButtons
        optionsAnimation={optionsAnimation}
        animatedPosition={animatedPosition}
        toggleAnimation={toggleAnimation}
      />
    );

    fireEvent.press(getByTestId('button-campus'));

    expect(handleCampusToggle).toHaveBeenCalledWith(
      false,
      expect.any(Function),
      toggleAnimation,
      optionsAnimation
    );
  });

  it('calls handleCurrentLocation when the current location button is pressed', () => {
    const fakeLocation = { latitude: 10, longitude: 20 };
    (useMapLocation as jest.Mock).mockReturnValue({ location: fakeLocation });

    const { getByTestId } = render(
      <MapButtons
        optionsAnimation={optionsAnimation}
        animatedPosition={animatedPosition}
        toggleAnimation={toggleAnimation}
      />
    );

    fireEvent.press(getByTestId('button-current-location'));

    expect(handleCurrentLocation).toHaveBeenCalledWith(mapRef, fakeLocation);
  });
});
