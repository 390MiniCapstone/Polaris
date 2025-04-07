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

type PinchPanContainerProps = {
  floorPlan: FloorPlanObject;
  path: NodeNav[];
};

const PinchPanContainer: React.FC<PinchPanContainerProps> = ({
  floorPlan,
  path,
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

            {path.map(node => (
              <React.Fragment key={node.id}>
                <Circle
                  cx={node.getAbsoluteX(parseFloat(floorPlan.width))}
                  cy={node.getAbsoluteY(parseFloat(floorPlan.height))}
                  r={15}
                  fill="red" // changed from 'red' to 'blue'
                />
              </React.Fragment>
            ))}

            {/* {floorPlan?.edges?.map((edge, index) => {
              const fromNode = floorPlan.nodes.find(n => n.id === edge.from);
              const toNode = floorPlan.nodes.find(n => n.id === edge.to);

              if (!fromNode || !toNode) return null;
              const graphEdge = graph.edges
                .get(edge.from)
                ?.find(e => e.to === edge.to);
              const distance = graphEdge ? graphEdge.weight.toFixed(2) : 'N/A';

              const midX =
                (fromNode.getAbsoluteX(parseFloat(floorPlan.width)) +
                  toNode.getAbsoluteX(parseFloat(floorPlan.width))) /
                2;
              const midY =
                (fromNode.getAbsoluteY(parseFloat(floorPlan.height)) +
                  toNode.getAbsoluteY(parseFloat(floorPlan.height))) /
                2;

              return (
                <React.Fragment key={index}>
                  <Line
                    x1={fromNode.getAbsoluteX(parseFloat(floorPlan.width))}
                    y1={fromNode.getAbsoluteY(parseFloat(floorPlan.height))}
                    x2={toNode.getAbsoluteX(parseFloat(floorPlan.width))}
                    y2={toNode.getAbsoluteY(parseFloat(floorPlan.height))}
                    stroke={
                      shortestPath.includes(fromNode.id) &&
                      shortestPath.includes(toNode.id)
                        ? 'red'
                        : 'transparent'
                    }
                    strokeWidth={5}
                  />
                  <SvgText
                    x={midX}
                    y={midY}
                    fontSize="18"
                    fill="purple"
                    textAnchor="middle"
                  >
                    {distance}
                  </SvgText>
                </React.Fragment>
              );
            })} */}
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
    backgroundColor: 'black',
  },
  svgContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
