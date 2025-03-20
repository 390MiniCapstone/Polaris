import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { ColorblindButton } from '@/components/ColorblindButton';
import useTheme from '@/hooks/useTheme';

// Mock useTheme to track setTheme calls
jest.mock('@/hooks/useTheme', () => ({
  __esModule: true,
  default: jest.fn(() => ({ setTheme: jest.fn() })),
}));

describe('ColorblindButton', () => {
  it('renders button and opens modal on press', () => {
    const { getByText } = render(<ColorblindButton />);

    const button = getByText('🎨 Mode');
    expect(button).toBeTruthy();

    fireEvent.press(button);

    expect(getByText('Select a Colorblind Mode')).toBeTruthy();
  });

  it('calls setTheme and closes modal when an option is selected', () => {
    const mockSetTheme = jest.fn();
    (useTheme as jest.Mock).mockReturnValue({ setTheme: mockSetTheme });

    const { getByText, queryByText } = render(<ColorblindButton />);
    fireEvent.press(getByText('🎨 Mode'));

    const option = getByText('🔵 Default');
    fireEvent.press(option);

    expect(mockSetTheme).toHaveBeenCalled();

    expect(queryByText('Select a Colorblind Mode')).toBeNull();
  });

  it('closes modal when "Cancel" is pressed', () => {
    const { getByText, queryByText } = render(<ColorblindButton />);
    fireEvent.press(getByText('🎨 Mode'));

    fireEvent.press(getByText('Cancel'));

    expect(queryByText('Select a Colorblind Mode')).toBeNull();
  });
});
