import React from 'react';
import { NavigationProvider } from '@/contexts/NavigationContext/NavigationContext';

const GlobalContextProvider = ({ children }: { children: React.ReactNode }) => {
  return <NavigationProvider>{children}</NavigationProvider>;
};

export default GlobalContextProvider;
