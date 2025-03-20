import React from 'react';
import { render } from '@testing-library/react-native';
import { Navigation } from '@/components/Navigation/Navigation';
import { useNavigation } from '@/contexts/NavigationContext/NavigationContext';

jest.mock('@/contexts/NavigationContext/NavigationContext', () => ({
  useNavigation: jest.fn(),
}));

jest.mock('@/components/Navigation/TravelModeToggle', () => ({
  TravelModeToggle: () => {
    const { Text } = require('react-native');
    return <Text>TravelModeToggle Component</Text>;
  },
}));

jest.mock('@/components/Navigation/Instructions', () => ({
  Instructions: () => {
    const { Text } = require('react-native');
    return <Text>Instructions Component</Text>;
  },
}));

jest.mock('@/components/Navigation/NavigationInfo', () => ({
  NavigationInfo: () => {
    const { Text } = require('react-native');
    return <Text>NavigationInfo Component</Text>;
  },
}));

describe('Navigation Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing when navigationState is not "planning" or "navigating"', () => {
    (useNavigation as jest.Mock).mockReturnValue({
      navigationState: 'default',
      routeData: null,
    });

    const { queryByText } = render(<Navigation />);
    expect(queryByText('TravelModeToggle Component')).toBeNull();
    expect(queryByText('Instructions Component')).toBeNull();
    expect(queryByText('NavigationInfo Component')).toBeNull();
  });

  it('renders only TravelModeToggle when navigationState is "planning" and no routeData is provided', () => {
    (useNavigation as jest.Mock).mockReturnValue({
      navigationState: 'planning',
      routeData: null,
    });

    const { getByText, queryByText } = render(<Navigation />);
    expect(getByText('TravelModeToggle Component')).toBeTruthy();
    expect(queryByText('NavigationInfo Component')).toBeNull();
    expect(queryByText('Instructions Component')).toBeNull();
  });

  it('renders TravelModeToggle and NavigationInfo when navigationState is "planning" and routeData is provided', () => {
    (useNavigation as jest.Mock).mockReturnValue({
      navigationState: 'planning',
      routeData: { some: 'data' },
    });

    const { getByText, queryByText } = render(<Navigation />);
    expect(getByText('TravelModeToggle Component')).toBeTruthy();
    expect(getByText('NavigationInfo Component')).toBeTruthy();
    expect(queryByText('Instructions Component')).toBeNull();
  });

  it('renders only Instructions when navigationState is "navigating" and no routeData is provided', () => {
    (useNavigation as jest.Mock).mockReturnValue({
      navigationState: 'navigating',
      routeData: null,
    });

    const { getByText, queryByText } = render(<Navigation />);
    expect(getByText('Instructions Component')).toBeTruthy();
    expect(queryByText('NavigationInfo Component')).toBeNull();
    expect(queryByText('TravelModeToggle Component')).toBeNull();
  });

  it('renders Instructions and NavigationInfo when navigationState is "navigating" and routeData is provided', () => {
    (useNavigation as jest.Mock).mockReturnValue({
      navigationState: 'navigating',
      routeData: { some: 'data' },
    });

    const { getByText, queryByText } = render(<Navigation />);
    expect(getByText('Instructions Component')).toBeTruthy();
    expect(getByText('NavigationInfo Component')).toBeTruthy();
    expect(queryByText('TravelModeToggle Component')).toBeNull();
  });
});
