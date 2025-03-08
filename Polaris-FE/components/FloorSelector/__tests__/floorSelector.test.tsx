import { render } from '@testing-library/react-native';
import { FloorSelector } from '../FloorSelector';

jest.mock('@/constants/floorPlans', () => ({
  FLOOR_PLANS: {
    'Building A': [{ name: 'Floor 1', id: 'b1_f1', image: 'floor1.png' }],
  },
}));

jest.mock('@react-native-picker/picker', () => {
  const React = require('react');
  const { View, Text } = require('react-native');

  const Picker = ({ children }) => (
    <View data-testid="picker-container">{children}</View>
  );

  Picker.Item = ({ label }) => <Text>{label}</Text>;

  return {
    Picker,
  };
});

describe('FloorSelector Component', () => {
  it('renders without crashing', () => {
    const mockSelectFloor = jest.fn();
    const props = {
      floorPlan: { name: 'Floor 1', id: 'b1_f1', image: 'floor1.png' },
      selectFloor: mockSelectFloor,
      indoorBuilding: 'Building A',
    };

    const { getByTestId } = render(<FloorSelector {...props} />);
    expect(getByTestId('picker-container')).toBeTruthy();
  });
});
