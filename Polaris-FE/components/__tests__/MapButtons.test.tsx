import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { MapButtons } from '@/components/MapButtons';
import { Downtown, Loyola } from '@/constants/mapConstants';
import { SharedValue } from 'react-native-reanimated';

const mockAnimatedPosition = {
  value: 0,
  set: jest.fn(),
  addListener: jest.fn(),
  removeListener: jest.fn(),
} as unknown as SharedValue<number>;

const mockOptionsAnimation = {
  value: 0,
  set: jest.fn(),
  addListener: jest.fn(),
  removeListener: jest.fn(),
} as unknown as SharedValue<number>;

describe('MapButtons Component', () => {
  const mockOnCampusToggle = jest.fn();
  const mockOnCampusSelect = jest.fn();
  const mockOnCurrentLocationPress = jest.fn();

  const defaultProps = {
    onCampusToggle: mockOnCampusToggle,
    onCampusSelect: mockOnCampusSelect,
    onCurrentLocationPress: mockOnCurrentLocationPress,
    animatedPosition: mockAnimatedPosition,
    optionsAnimation: mockOptionsAnimation,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { getByTestId } = render(<MapButtons {...defaultProps} />);
    expect(getByTestId('animated-container')).toBeTruthy();
  });

  it('calls onCampusSelect with DOWNTOWN when "Downtown" is pressed', () => {
    const { getByText } = render(<MapButtons {...defaultProps} />);
    fireEvent.press(getByText('Downtown'));
    expect(mockOnCampusSelect).toHaveBeenCalledWith(Downtown);
  });

  it('calls onCampusSelect with LOYOLA when "Loyola" is pressed', () => {
    const { getByText } = render(<MapButtons {...defaultProps} />);
    fireEvent.press(getByText('Loyola'));
    expect(mockOnCampusSelect).toHaveBeenCalledWith(Loyola);
  });

  it('calls onCampusToggle when the "Campus" button is pressed', () => {
    const { getByText } = render(<MapButtons {...defaultProps} />);
    fireEvent.press(getByText('Campus'));
    expect(mockOnCampusToggle).toHaveBeenCalledTimes(1);
  });

  it('calls onCurrentLocationPress when the location button is pressed', () => {
    const { getByTestId } = render(<MapButtons {...defaultProps} />);
    fireEvent.press(getByTestId('button-current-location'));
    expect(mockOnCurrentLocationPress).toHaveBeenCalledTimes(1);
  });
});
