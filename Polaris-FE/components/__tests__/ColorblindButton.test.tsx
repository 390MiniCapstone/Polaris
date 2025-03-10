import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { ColorblindButton } from '../ColorblindButton';

describe('ColorblindButton', () => {
  const mockSetColorblindTheme = jest.fn();

  it('renders the button', () => {
    const { getByText } = render(
      <ColorblindButton setColorblindTheme={mockSetColorblindTheme} />
    );
    expect(getByText('🎨 Mode')).toBeTruthy();
  });

  it('opens the modal when the button is pressed', () => {
    const { getByText, queryByText } = render(
      <ColorblindButton setColorblindTheme={mockSetColorblindTheme} />
    );

    fireEvent.press(getByText('🎨 Mode'));

    expect(queryByText('Select a Colorblind Mode')).toBeTruthy();
  });

  it('selects the Deuteranopia mode and closes modal', () => {
    const { getByText, queryByText } = render(
      <ColorblindButton setColorblindTheme={mockSetColorblindTheme} />
    );

    fireEvent.press(getByText('🎨 Mode'));
    fireEvent.press(getByText('🟢 Deuteranopia (Red-Green)'));

    expect(mockSetColorblindTheme).toHaveBeenCalledWith('deuteranopia');
    expect(queryByText('Select a Colorblind Mode')).toBeFalsy();
  });

  it('closes the modal when the cancel button is pressed', () => {
    const { getByText, queryByText } = render(
      <ColorblindButton setColorblindTheme={mockSetColorblindTheme} />
    );

    fireEvent.press(getByText('🎨 Mode'));
    fireEvent.press(getByText('Cancel'));

    expect(queryByText('Select a Colorblind Mode')).toBeFalsy();
  });
});
