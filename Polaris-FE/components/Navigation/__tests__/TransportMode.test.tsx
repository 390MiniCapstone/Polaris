jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { View } = require('react-native');
  const Icon = (props: any) => <View {...props} />;
  return {
    Ionicons: Icon,
    MaterialIcons: Icon,
    FontAwesome: Icon,
    FontAwesome5: Icon,
    FontAwesome6: Icon,
    MaterialCommunityIcons: Icon,
    Entypo: Icon,
    SimpleLineIcons: Icon,
  };
});

jest.mock('expo-font', () => ({
  loadAsync: jest.fn(),
  isLoaded: jest.fn(() => true),
}));

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';
import { TravelModeToggle } from '@/components/Navigation/TravelModeToggle';

const modes: Array<'DRIVE' | 'WALK' | 'TRANSIT' | 'BICYCLE'> = [
  'DRIVE',
  'WALK',
  'TRANSIT',
  'BICYCLE',
];

describe('TravelModeToggle Component', () => {
  it('renders correctly (snapshot)', () => {
    const { toJSON } = render(
      <TravelModeToggle selectedMode="DRIVE" onModeSelect={jest.fn()} />
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('calls onModeSelect with the correct mode when each button is pressed', () => {
    const onModeSelectMock = jest.fn();
    const { getByTestId } = render(
      <TravelModeToggle selectedMode="DRIVE" onModeSelect={onModeSelectMock} />
    );

    modes.forEach(mode => {
      const button = getByTestId(`transport-mode-button-${mode}`);
      fireEvent.press(button);
      expect(onModeSelectMock).toHaveBeenCalledWith(mode);
    });
    expect(onModeSelectMock).toHaveBeenCalledTimes(modes.length);
  });

  it('applies the selected style to the button corresponding to the selected mode', () => {
    const { getByTestId } = render(
      <TravelModeToggle selectedMode="TRANSIT" onModeSelect={jest.fn()} />
    );

    const transitButton = getByTestId('transport-mode-button-TRANSIT');
    const transitStyle = StyleSheet.flatten(transitButton.props.style);

    expect(transitStyle.backgroundColor).toBe('#9A2E3F');
  });
});
