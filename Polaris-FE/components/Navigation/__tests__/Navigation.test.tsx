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
    });

    const { queryByText } = render(<Navigation />);
    expect(queryByText('TravelModeToggle Component')).toBeNull();
    expect(queryByText('Instructions Component')).toBeNull();
    expect(queryByText('NavigationInfo Component')).toBeNull();
  });

  it('renders TravelModeToggle and NavigationInfo when navigationState is "planning"', () => {
    (useNavigation as jest.Mock).mockReturnValue({
      navigationState: 'planning',
    });

    const { getByText, queryByText } = render(<Navigation />);
    expect(getByText('TravelModeToggle Component')).toBeTruthy();
    expect(getByText('NavigationInfo Component')).toBeTruthy();
    expect(queryByText('Instructions Component')).toBeNull();
  });

  it('renders Instructions and NavigationInfo when navigationState is "navigating"', () => {
    (useNavigation as jest.Mock).mockReturnValue({
      navigationState: 'navigating',
    });

    const { getByText, queryByText } = render(<Navigation />);
    expect(getByText('Instructions Component')).toBeTruthy();
    expect(getByText('NavigationInfo Component')).toBeTruthy();
    expect(queryByText('TravelModeToggle Component')).toBeNull();
  });
});
