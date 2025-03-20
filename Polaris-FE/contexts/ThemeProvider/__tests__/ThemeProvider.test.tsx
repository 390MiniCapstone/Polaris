import React, { useContext } from 'react';
import { ThemeContext } from '@/contexts/ThemeProvider/ThemeContext';
import { themes } from '@/utils/themeOptions';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import ThemeProvider from '../ThemeContextProvider';
import { Button, Text, View } from 'react-native';

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
          {({ theme }) => <View testID="theme">{theme.colors.primary}</View>}
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

  it('throws an error when setIndoorBuilding is called outside of BuildingProvider', () => {
    const BrokenComponent = () => {
      const { setTheme } = useContext(ThemeContext);
      setTheme(themes['default']);
      return <Text>Broken</Text>;
    };

    expect(() => {
      render(<BrokenComponent />);
    }).toThrow('setTheme must be used within a ThemeProvider');
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
