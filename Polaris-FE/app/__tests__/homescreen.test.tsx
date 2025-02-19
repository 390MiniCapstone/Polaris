import React from 'react';
import { render, waitFor, screen } from '@testing-library/react-native';
import HomeScreen from '@/app/index';

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { View } = require('react-native');
  const MockIcon = (props: any) => <View {...props} />;
  return {
    __esModule: true,
    Ionicons: MockIcon,
    FontAwesome5: MockIcon,
    MaterialIcons: MockIcon,
    MaterialCommunityIcons: MockIcon,
  };
});

jest.mock('expo-font', () => ({
  loadAsync: jest.fn(),
  isLoaded: jest.fn(() => true),
}));

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  return Reanimated;
});

describe('HomeScreen Minimal Test', () => {
  it('renders without crashing and displays "Campus"', async () => {
    render(<HomeScreen />);
    await waitFor(() => {
      expect(screen.getByText('Campus')).toBeTruthy();
    });
  });
});
