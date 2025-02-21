import React, { useRef, useState } from 'react';
import MapView, { Region } from 'react-native-maps';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSharedValue } from 'react-native-reanimated';

import { MapComponent } from '@/components/Map';
import { BottomSheetComponent } from '@/components/BottomSheetComponent';
import { NavigationButtons } from '@/components/NavigationButtons';
import { useMapLocation } from '@/hooks/useMapLocation';
import {
  handleCurrentLocation,
  handleCampusSelect,
  handleCampusToggle,
  handleLocation,
} from '@/utils/mapHandlers';

export default function HomeScreen() {
  const { location, region, setRegion } = useMapLocation();
  const [showCampusOptions, setShowCampusOptions] = useState(false);

  const mapRef = useRef<MapView>(null);
  const bottomSheetRef = useRef<any>(null);

  const toggleAnimation = useSharedValue(0);
  const optionsAnimation = useSharedValue(0);
  const animatedPosition = useSharedValue(0);

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <MapComponent mapRef={mapRef} region={region} setRegion={setRegion} />
        <BottomSheetComponent
          bottomSheetRef={bottomSheetRef}
          onFocus={() => bottomSheetRef.current?.snapToIndex(3)}
          animatedPosition={animatedPosition}
          onSearchClick={(selectedRegion: Region) =>
            handleLocation(
              selectedRegion,
              mapRef,
              toggleAnimation,
              optionsAnimation
            )
          }
        />

        <NavigationButtons
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
