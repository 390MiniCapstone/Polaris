import React from 'react';
import { NavigationProvider } from '@/contexts/NavigationContext/NavigationContext';
import { AuthProvider } from '../AuthContext/AuthContext';
import { PaperProvider } from 'react-native-paper';
import { BuildingProvider } from '../BuildingContext/BuildingContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const GlobalContextProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider>
        <BuildingProvider>
          <NavigationProvider>
            <AuthProvider>{children}</AuthProvider>
          </NavigationProvider>
        </BuildingProvider>
      </PaperProvider>
    </QueryClientProvider>
  );
};

export default GlobalContextProvider;
