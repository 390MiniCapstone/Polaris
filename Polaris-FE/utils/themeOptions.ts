import { DarkTheme, DefaultTheme, Theme } from '@react-navigation/native';
import { fonts } from '@react-navigation/native/src/theming/fonts';

export const themes: { [key: string]: Theme } = {
  default: DefaultTheme,
  dark: DarkTheme,
  protanopia: {
    dark: false,
    colors: {
      primary: 'rgba(0, 128, 128, 1)', // Teal
      background: 'white',
      card: 'white',
      text: 'black',
      border: 'rgba(169, 169, 169, 1)', // Light gray
      notification: 'rgba(255, 165, 0, 1)', // Orange
    },
    fonts,
  },
  deuteranopia: {
    dark: false,
    colors: {
      primary: 'rgba(128, 0, 128, 1)', // Purple
      background: 'white',
      card: 'white',
      text: 'black',
      border: 'rgba(169, 169, 169, 1)', // Light gray
      notification: 'rgba(0, 191, 255, 1)', // Sky blue
    },
    fonts,
  },
  tritanopia: {
    dark: false,
    colors: {
      primary: 'rgba(255, 69, 0, 1)', // Orange-red
      background: 'white',
      card: 'white',
      text: 'black',
      border: 'rgba(169, 169, 169, 1)', // Light gray
      notification: 'rgba(50, 205, 50, 1)', // Lime green
    },
    fonts,
  },
};
