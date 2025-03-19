import { useContext } from 'react';
import { ThemeContext } from '@/contexts/ThemeProvider/ThemeContext';

const useTheme = () => useContext(ThemeContext);

export default useTheme;
