import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSharedValue } from 'react-native-reanimated';
import { MapComponent } from '@/components/Map';
import { OutdoorBottomSheetComponent } from '@/components/BottomSheetComponent/OutdoorBottomSheetComponent';
import { MapButtons } from '@/components/MapButtons';
import { useMapLocation } from '@/hooks/useMapLocation';
import useClarity from '@/hooks/useClarity';
import { ColorblindButton } from '@/components/ColorblindButton';
import { Toaster } from 'sonner-native';

export default function HomeScreen() {
  const { region, setRegion } = useMapLocation();

  const toggleAnimation = useSharedValue(0);
  const optionsAnimation = useSharedValue(0);
  const animatedPosition = useSharedValue(0);
  useClarity();
  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <MapComponent region={region} setRegion={setRegion} />
        <View style={styles.buttonContainer}>
          <ColorblindButton />
        </View>
        <OutdoorBottomSheetComponent animatedPosition={animatedPosition} />
        <MapButtons
          toggleAnimation={toggleAnimation}
          animatedPosition={animatedPosition}
          optionsAnimation={optionsAnimation}
        />
        <Toaster
          toastOptions={{
            style: { backgroundColor: '#222' },
          }}
        />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    top: 60,
    right: 10,
    zIndex: 1,
  },
});
