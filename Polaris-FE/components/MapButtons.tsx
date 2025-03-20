import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { Region } from 'react-native-maps';
import { Downtown, Loyola } from '@/constants/mapConstants';
import { FontAwesome5 } from '@expo/vector-icons';
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {
  handleCampusSelect,
  handleCampusToggle,
  handleCurrentLocation,
} from '@/utils/mapHandlers';
import { mapRef } from '@/utils/refs';
import { useMapLocation } from '@/hooks/useMapLocation';

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

const AnimatedView = Animated.createAnimatedComponent(View);

interface NavigationButtonsProps {
  optionsAnimation: SharedValue<number>;
  animatedPosition: SharedValue<number>;
  toggleAnimation: SharedValue<number>;
}

export const MapButtons: React.FC<NavigationButtonsProps> = ({
  optionsAnimation,
  animatedPosition,
  toggleAnimation,
}) => {
  const { location } = useMapLocation();
  const [showCampusOptions, setShowCampusOptions] = useState(false);

  const buttonsStyle = useAnimatedStyle(() => {
    const startFadeHeight = 200;
    const endFadeHeight = 100;
    const closeStartFade = 800;
    const closeEndFade = 850;

    const upperFade = interpolate(
      animatedPosition.value,
      [startFadeHeight, endFadeHeight],
      [1, 0],
      'clamp'
    );

    const lowerFade = interpolate(
      animatedPosition.value,
      [closeStartFade, closeEndFade],
      [1, 0],
      'clamp'
    );

    const opacity = Math.min(upperFade, lowerFade);

    return {
      transform: [
        {
          translateY: animatedPosition.value,
        },
      ],
      opacity,
    };
  });

  const optionsStyle = useAnimatedStyle(() => {
    return {
      opacity: optionsAnimation.value,
      transform: [
        { translateY: interpolate(optionsAnimation.value, [0, 1], [20, 0]) },
        { scale: interpolate(optionsAnimation.value, [0, 1], [0.8, 1]) },
      ],
    };
  });

  const onCampusToggle = () =>
    handleCampusToggle(
      showCampusOptions,
      setShowCampusOptions,
      toggleAnimation,
      optionsAnimation
    );

  const onCampusSelect = (selectedRegion: Region) =>
    handleCampusSelect(
      selectedRegion,
      mapRef,
      setShowCampusOptions,
      toggleAnimation,
      optionsAnimation
    );

  return (
    <AnimatedView
      testID="animated-container"
      style={[styles.buttonsWrapper, buttonsStyle]}
    >
      <View>
        <AnimatedView style={[styles.downtownOption, optionsStyle]}>
          <TouchableOpacity
            style={styles.campusOption}
            onPress={() => onCampusSelect(Downtown)}
          >
            <Text style={styles.campusButtonText}>Downtown</Text>
          </TouchableOpacity>
        </AnimatedView>

        <AnimatedView style={[styles.loyolaOption, optionsStyle]}>
          <TouchableOpacity
            style={styles.campusOption}
            onPress={() => onCampusSelect(Loyola)}
          >
            <Text style={styles.campusButtonText}>Loyola</Text>
          </TouchableOpacity>
        </AnimatedView>

        <AnimatedTouchableOpacity
          style={styles.toggleButton}
          onPress={onCampusToggle}
        >
          <Text testID="button-campus" style={styles.toggleButtonText}>
            Campus
          </Text>
        </AnimatedTouchableOpacity>
      </View>
      <AnimatedTouchableOpacity
        testID="button-current-location"
        accessibilityLabel="button-current-location"
        style={styles.currentButton}
        onPress={() => handleCurrentLocation(mapRef, location)}
      >
        <FontAwesome5 name="location-arrow" size={16} color="white" />
      </AnimatedTouchableOpacity>
    </AnimatedView>
  );
};

const styles = StyleSheet.create({
  buttonsWrapper: {
    position: 'absolute',
    left: 14,
    right: 14,
    pointerEvents: 'box-none',
    bottom: '100.5%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  toggleButton: {
    backgroundColor: 'rgba(34, 34, 34, 0.992)',
    paddingHorizontal: 16,
    borderRadius: 12,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  currentButton: {
    backgroundColor: 'rgba(34, 34, 34, 0.992)',
    borderRadius: 12,
    height: 36,
    width: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  campusOption: {
    backgroundColor: 'rgba(34, 34, 34, 0.992)',
    paddingHorizontal: 16,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  campusButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  downtownOption: {
    minWidth: 113,
    position: 'absolute',
    left: 0,
    bottom: 90,
  },
  loyolaOption: {
    position: 'absolute',
    left: 0,
    bottom: 45,
  },
});
