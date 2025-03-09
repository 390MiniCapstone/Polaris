import React from 'react';
import { AuthProvider } from '../AuthContext/AuthContext';
import { PaperProvider } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const GlobalContextProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider>
        <AuthProvider>{children}</AuthProvider>
      </PaperProvider>
    </QueryClientProvider>
  );
};

export default GlobalContextProvider;
