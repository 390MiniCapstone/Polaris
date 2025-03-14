import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SharedValue } from 'react-native-reanimated';
import { MapButtons } from '@/components/MapButtons';

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { View } = require('react-native');
  const MockFontAwesome5 = (props: any) => <View {...props} />;
  return {
    __esModule: true,
    FontAwesome5: MockFontAwesome5,
  };
});

jest.mock('@/constants/mapConstants', () => ({
  Downtown: { latitude: 1, longitude: 1 },
  Loyola: { latitude: 2, longitude: 2 },
}));

const createDummySharedValue = (initialValue: number): SharedValue<number> => {
  const dummy: SharedValue<number> = {
    value: initialValue,
    get: () => dummy.value,
    set: (newValue: number) => {
      dummy.value = newValue;
    },
    addListener: jest.fn(),
    removeListener: jest.fn(),
    modify: jest.fn(),
  };
  return dummy;
};

const dummyOptionsAnimation: SharedValue<number> = createDummySharedValue(1);
const dummyAnimatedPosition: SharedValue<number> = createDummySharedValue(0);

describe('MapButtons Component', () => {
  const defaultProps = {
    onCampusToggle: jest.fn(),
    onCampusSelect: jest.fn(),
    onCurrentLocationPress: jest.fn(),
    optionsAnimation: dummyOptionsAnimation,
    animatedPosition: dummyAnimatedPosition,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing and displays all buttons', () => {
    const { getByTestId, getByText } = render(<MapButtons {...defaultProps} />);
    expect(getByTestId('animated-container')).toBeTruthy();
    expect(getByText('Downtown')).toBeTruthy();
    expect(getByText('Loyola')).toBeTruthy();
    expect(getByText('Campus')).toBeTruthy();
    expect(getByTestId('button-current-location')).toBeTruthy();
  });

  it('calls onCampusToggle when the Campus button is pressed', () => {
    const { getByText } = render(<MapButtons {...defaultProps} />);
    const campusButton = getByText('Campus');
    fireEvent.press(campusButton);
    expect(defaultProps.onCampusToggle).toHaveBeenCalled();
  });

  it('calls onCurrentLocationPress when the current location button is pressed', () => {
    const { getByTestId } = render(<MapButtons {...defaultProps} />);
    const currentLocationButton = getByTestId('button-current-location');
    fireEvent.press(currentLocationButton);
    expect(defaultProps.onCurrentLocationPress).toHaveBeenCalled();
  });

  it('calls onCampusSelect with Downtown when the Downtown button is pressed', () => {
    const { getByText } = render(<MapButtons {...defaultProps} />);
    const downtownButton = getByText('Downtown');
    fireEvent.press(downtownButton);
    expect(defaultProps.onCampusSelect).toHaveBeenCalledWith({
      latitude: 1,
      longitude: 1,
    });
  });

  it('calls onCampusSelect with Loyola when the Loyola button is pressed', () => {
    const { getByText } = render(<MapButtons {...defaultProps} />);
    const loyolaButton = getByText('Loyola');
    fireEvent.press(loyolaButton);
    expect(defaultProps.onCampusSelect).toHaveBeenCalledWith({
      latitude: 2,
      longitude: 2,
    });
  });
});
