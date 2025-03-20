import { createContext } from 'react';
import { CustomTheme, themes } from '@/utils/themeOptions';

interface ThemeContextType {
  theme: CustomTheme;
  setTheme: (theme: CustomTheme) => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: themes.default,
  setTheme: () => {
    throw new Error('setTheme must be used within a ThemeProvider');
  },
});
