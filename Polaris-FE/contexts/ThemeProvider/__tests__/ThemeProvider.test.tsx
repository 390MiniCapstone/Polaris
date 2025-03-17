import React from 'react';
import { ThemeContext } from '@/contexts/ThemeProvider/ThemeContext';
import { themes } from '@/utils/themeOptions';
import { screen, render, fireEvent } from '@testing-library/react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import ThemeProvider from '../ThemeContextProvider';
import { Button, View, Text } from 'react-native';

describe('ThemeProvider', () => {
  jest.mock('@/hooks/useColorScheme');
  const mockUseColorScheme = jest.mocked(useColorScheme);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('provides the default theme initially', () => {
    mockUseColorScheme.mockReturnValueOnce('light');
    render(
      <ThemeProvider>
        <ThemeContext.Consumer>
          {({ theme }) => <view testID="theme">{theme.colors.primary}</view>}
        </ThemeContext.Consumer>
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme')).toHaveTextContent(
      themes.default.colors.primary
    );
  });

  it('provides the dark theme when colorScheme is dark', () => {
    mockUseColorScheme.mockReturnValueOnce('dark');
    render(
      <ThemeProvider>
        <ThemeContext.Consumer>
          {({ theme }) => <Text testID="theme">{theme.colors.primary}</Text>}
        </ThemeContext.Consumer>
      </ThemeProvider>
    );
    expect(screen.getByTestId('theme')).toHaveTextContent(
      themes.dark.colors.primary
    );
  });

  Object.entries(themes).forEach(([themeName, themeValue]) => {
    it(`changes theme to ${themeName} when a new theme is selected`, () => {
      const { getByTestId } = render(
        <ThemeProvider>
          <ThemeContext.Consumer>
            {({ theme, setTheme }) => (
              <View testID="theme-container">
                <Text testID="theme">{theme.colors.primary}</Text>
                <Button
                  testID="change-theme-button"
                  onPress={() => setTheme(themeValue)}
                  title="Change Theme"
                />
              </View>
            )}
          </ThemeContext.Consumer>
        </ThemeProvider>
      );

      const changeThemeButton = getByTestId('change-theme-button');
      fireEvent.press(changeThemeButton);

      const updatedThemeText = getByTestId('theme');
      expect(updatedThemeText).toHaveTextContent(themeValue.colors.primary);
    });
  });
});
