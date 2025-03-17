import { DarkTheme, DefaultTheme, Theme } from '@react-navigation/native';

export interface CustomTheme extends Theme {
  colors: Theme['colors'] & {
    secondary: string;
  };
}

const fonts = { ...DefaultTheme.fonts };

export const themes: { [key: string]: CustomTheme } = {
  default: {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: 'rgba(143, 34, 54, 1)',
      secondary: 'rgba(143, 34, 54, 0.5)',
    },
  },
  dark: {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      primary: 'rgba(143, 34, 54, 1)',
      secondary: 'rgba(143, 34, 54, 0.5)',
    },
    fonts: fonts,
  },
  protanopia: {
    dark: false,
    colors: {
      primary: 'rgba(0, 128, 128, 1)',
      secondary: 'rgba(255, 165, 0, 1)',
      background: 'white',
      card: 'white',
      text: 'black',
      border: 'rgba(169, 169, 169, 1)',
      notification: 'rgba(255, 0, 0, 1)',
    },
    fonts: fonts,
  },
  deuteranopia: {
    dark: false,
    colors: {
      primary: 'rgba(128, 0, 128, 1)',
      secondary: 'rgba(0, 191, 255, 1)',
      background: 'white',
      card: 'white',
      text: 'black',
      border: 'rgba(169, 169, 169, 1)',
      notification: 'rgba(255, 0, 255, 1)',
    },
    fonts: fonts,
  },
  tritanopia: {
    dark: false,
    colors: {
      primary: 'rgba(255, 69, 0, 1)',
      secondary: 'rgba(128, 0, 128, 1)',
      background: 'white',
      card: 'white',
      text: 'black',
      border: 'rgba(169, 169, 169, 1)',
      notification: 'rgba(255, 0, 0, 1)',
    },
    fonts: fonts,
  },
};
