import React from 'react';
import { StyleSheet } from 'react-native';
import {
  GestureHandlerRootView,
  GestureDetector,
} from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { useZoomAndPan } from './useZoomAndPan';
import { FloorPlanObject } from '@/constants/floorPlans';

type PinchPanContainerProps = {
  floorPlan: FloorPlanObject;
};

const PinchPanContainer: React.FC<PinchPanContainerProps> = ({ floorPlan }) => {
  const { zoomLevel, panTranslateX, panTranslateY, gesture } = useZoomAndPan(
    1,
    3,
    1.5
  );
  const SvgComponent = floorPlan.SvgComponent;
  const initialOffsetY = 50;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: zoomLevel.value },
      { translateX: panTranslateX.value },
      { translateY: panTranslateY.value - initialOffsetY },
    ],
  }));

  return (
    <GestureHandlerRootView style={styles.container}>
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.svgContainer, animatedStyle]}>
          <SvgComponent
            width="100%"
            height="100%"
            viewBox={`0 0 ${floorPlan.width} ${floorPlan.height}`}
            preserveAspectRatio="xMidYMid meet"
          />
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

export default PinchPanContainer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  svgContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
