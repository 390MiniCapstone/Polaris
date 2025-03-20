import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSharedValue } from 'react-native-reanimated';
import { MapComponent } from '@/components/Map';
import { OutdoorBottomSheetComponent } from '@/components/BottomSheetComponent/OutdoorBottomSheetComponent';
import { MapButtons } from '@/components/MapButtons';
import { useMapLocation } from '@/hooks/useMapLocation';
import useClarity from '@/hooks/useClarity';

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
        <OutdoorBottomSheetComponent animatedPosition={animatedPosition} />
        <MapButtons
          toggleAnimation={toggleAnimation}
          animatedPosition={animatedPosition}
          optionsAnimation={optionsAnimation}
        />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
