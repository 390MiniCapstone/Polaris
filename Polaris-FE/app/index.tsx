import React, { useState } from 'react';
import { Region } from 'react-native-maps';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSharedValue } from 'react-native-reanimated';
import { bottomSheetRef, mapRef } from '@/utils/refs';
import { MapComponent } from '@/components/Map';
import { BottomSheetComponent } from '@/components/BottomSheetComponent';
import { MapButtons } from '@/components/MapButtons';
import { useMapLocation } from '@/hooks/useMapLocation';
import {
  handleCampusSelect,
  handleCampusToggle,
  handleCurrentLocation,
  handleLocation,
} from '@/utils/mapHandlers';
import useClarity from '@/hooks/useClarity';
import { ColorblindButton } from '@/components/ColorblindButton';

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
        <View style={styles.buttonContainer}>
          <ColorblindButton />
        </View>
        <BottomSheetComponent
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
  buttonContainer: {
    position: 'absolute',
    top: 60,
    right: 10,
    zIndex: 1,
  },
});
