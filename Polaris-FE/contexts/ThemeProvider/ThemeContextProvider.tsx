import React, { useState } from 'react';
import { DarkTheme, DefaultTheme, Theme } from '@react-navigation/native';
import { ThemeContext } from '@/contexts/ThemeProvider/ThemeContext';
import { useColorScheme } from '@/hooks/useColorScheme';

interface ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const colorScheme = useColorScheme();
  const [theme, setTheme] = useState<Theme>(
    colorScheme === 'dark' ? DarkTheme : DefaultTheme
  );

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
