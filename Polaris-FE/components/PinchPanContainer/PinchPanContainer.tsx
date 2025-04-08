import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import {
  GestureHandlerRootView,
  GestureDetector,
} from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { useZoomAndPan } from './useZoomAndPan';
import { FloorPlanObject } from '@/constants/floorPlans';
import Svg, { Circle, Line, Text as SvgText } from 'react-native-svg';
import { NodeNav } from '@/app/NodeNav';
import { FLOOR_PLANS } from '@/constants/floorPlans';

type PinchPanContainerProps = {
  floorPlan: FloorPlanObject;
  filteredDjsNodes: NodeNav[];
  djsEdges: any;
};

const PinchPanContainer: React.FC<PinchPanContainerProps> = ({
  floorPlan,
  filteredDjsNodes,
  djsEdges,
}) => {
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

  const verifyNodes = (filteredDjsNodes: NodeNav[], nodeObj: NodeNav) =>
    filteredDjsNodes.find((node: NodeNav) => node.id === nodeObj.id);

  console.log('TEST', filteredDjsNodes);

  return (
    <GestureHandlerRootView style={styles.container}>
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.svgContainer, animatedStyle]}>
          <Svg
            width="100%"
            height="100%"
            viewBox={`0 0 ${floorPlan.width} ${floorPlan.height}`}
            preserveAspectRatio="xMidYMid meet"
          >
            <SvgComponent width="100%" height="100%" />

            {filteredDjsNodes.map(node => (
              <React.Fragment key={node.id}>
                <Circle
                  cx={node.getAbsoluteX(parseFloat(floorPlan.width))}
                  cy={node.getAbsoluteY(parseFloat(floorPlan.height))}
                  r={1}
                  fill="red"
                />
              </React.Fragment>
            ))}

            {djsEdges.map((edge, index) => {
              const { from, to } = edge;

              const isStartingNodeInCurrentFloorPlan = verifyNodes(
                filteredDjsNodes,
                from
              );
              const isDestinationNodeInCurrentFloorPlan = verifyNodes(
                filteredDjsNodes,
                to
              );

              if (
                isStartingNodeInCurrentFloorPlan &&
                isDestinationNodeInCurrentFloorPlan
              ) {
                const fromX = from.xRatio * floorPlan.width;
                const fromY = from.yRatio * floorPlan.height;
                const toX = to.xRatio * floorPlan.width;
                const toY = to.yRatio * floorPlan.height;

                return (
                  <Line
                    key={index}
                    x1={fromX}
                    y1={fromY}
                    x2={toX}
                    y2={toY}
                    stroke="red"
                    strokeWidth={0.005 * parseFloat(floorPlan.width)}
                  />
                );
              }
            })}
          </Svg>
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

export default PinchPanContainer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fceed4',
  },
  svgContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
