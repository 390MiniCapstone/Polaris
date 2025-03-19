import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, createContext } from 'react';
import 'react-native-reanimated';
import GlobalContextProvider from '@/contexts/ContextProvider/GlobalContextProvider';
import ThemeProvider from '@/contexts/ThemeProvider/ThemeContextProvider';

export interface BuildingContextType {
  indoorBuilding: string | null;
  setIndoorBuilding: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export const BuildingContext = createContext<BuildingContextType | undefined>(
  undefined
);

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider>
      <GlobalContextProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="indoor" options={{ headerShown: false }} />
          <Stack.Screen name="oauthredirect" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </GlobalContextProvider>
    </ThemeProvider>
  );
}
