import { createContext, useContext } from 'react';
import { themes } from '@/utils/themeOptions';
import { Theme } from '@react-navigation/native';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: themes.default,
  setTheme: () => {
    throw new Error('setTheme must be used within a ThemeProvider');
  },
});

export const useTheme = () => useContext(ThemeContext);
