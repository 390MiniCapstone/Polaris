import React, { useRef, useState } from 'react';
import MapView, { Region } from 'react-native-maps';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import React, { useState } from 'react';
import { Region } from 'react-native-maps';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSharedValue } from 'react-native-reanimated';
import { mapRef, bottomSheetRef } from '@/utils/refs';
import { MapComponent } from '@/components/Map';
import { BottomSheetComponent } from '@/components/BottomSheetComponent/BottomSheetComponent';
import { NavigationButtons } from '@/components/NavigationButtons';
import { BottomSheetComponent } from '@/components/BottomSheetComponent';
import { MapButtons } from '@/components/MapButtons';
import { useMapLocation } from '@/hooks/useMapLocation';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
  handleCurrentLocation,
  handleCampusSelect,
  handleCampusToggle,
  handleLocation,
} from '@/utils/mapHandlers';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const { location, region, setRegion } = useMapLocation();
  const [showCampusOptions, setShowCampusOptions] = useState(false);
  const router = useRouter();

  const toggleAnimation = useSharedValue(0);
  const optionsAnimation = useSharedValue(0);
  const animatedPosition = useSharedValue(0);

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <MapComponent region={region} setRegion={setRegion} />
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
});
