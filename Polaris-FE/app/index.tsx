import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSharedValue } from 'react-native-reanimated';
import { mapRef, bottomSheetRef } from '@/utils/refs';
import { MapComponent } from '@/components/Map';
import { OutdoorBottomSheetComponent } from '@/components/BottomSheetComponent/OutdoorBottomSheetComponent';
import { MapButtons } from '@/components/MapButtons';
import { useMapLocation } from '@/hooks/useMapLocation';
import { Region } from 'react-native-maps';
import {
  handleCurrentLocation,
  handleCampusSelect,
  handleCampusToggle,
  handleLocation,
} from '@/utils/mapHandlers';
import useClarity from '@/hooks/useClarity';

export default function HomeScreen() {
  const { location, region, setRegion } = useMapLocation();
  const [showCampusOptions, setShowCampusOptions] = useState(false);

  const toggleAnimation = useSharedValue(0);
  const optionsAnimation = useSharedValue(0);
  const animatedPosition = useSharedValue(0);
  useClarity();
  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <MapComponent region={region} setRegion={setRegion} />
        <OutdoorBottomSheetComponent
          onFocus={() => bottomSheetRef.current?.snapToIndex(3)}
          animatedPosition={animatedPosition}
          onSearchClick={(selectedRegion: Region) =>
            handleLocation(selectedRegion, toggleAnimation, optionsAnimation)
          }
        />
        <MapButtons
          onCampusToggle={() =>
            handleCampusToggle(
              showCampusOptions,
              setShowCampusOptions,
              toggleAnimation,
              optionsAnimation
            )
          }
          onCampusSelect={(selectedRegion: Region) =>
            handleCampusSelect(
              selectedRegion,
              mapRef,
              setShowCampusOptions,
              toggleAnimation,
              optionsAnimation
            )
          }
          onCurrentLocationPress={() => handleCurrentLocation(mapRef, location)}
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
