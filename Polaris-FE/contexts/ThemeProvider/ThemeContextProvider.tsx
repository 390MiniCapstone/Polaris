import React, { useState } from 'react';
import { ThemeContext } from '@/contexts/ThemeProvider/ThemeContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { CustomTheme, themes } from '@/utils/themeOptions';

interface ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const colorScheme = useColorScheme();
  const [theme, setTheme] = useState<CustomTheme>(
    colorScheme === 'dark' ? themes.dark : themes.default
  );

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
