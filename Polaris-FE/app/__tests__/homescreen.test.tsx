import React from 'react';
import { render } from '@testing-library/react-native';
import HomeScreen from '@/app/index';

jest.mock('react-native-reanimated', () => ({
  useSharedValue: jest
    .fn()
    .mockImplementation(initialValue => ({ value: initialValue })),
}));

jest.mock('@/hooks/useMapLocation', () => ({
  useMapLocation: () => ({
    region: {
      latitude: 0,
      longitude: 0,
      latitudeDelta: 0.1,
      longitudeDelta: 0.1,
    },
    setRegion: jest.fn(),
  }),
}));

jest.mock('@/components/Map', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    MapComponent: () => <View testID="map-component" />,
  };
});
jest.mock('@/components/BottomSheetComponent', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    BottomSheetComponent: () => <View testID="bottom-sheet" />,
  };
});
jest.mock('@/components/MapButtons', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    MapButtons: () => <View testID="map-buttons" />,
  };
});

describe('HomeScreen', () => {
  it('renders all child components', () => {
    const { getByTestId } = render(<HomeScreen />);

    expect(getByTestId('map-component')).toBeTruthy();
    expect(getByTestId('bottom-sheet')).toBeTruthy();
    expect(getByTestId('map-buttons')).toBeTruthy();
  });
});
