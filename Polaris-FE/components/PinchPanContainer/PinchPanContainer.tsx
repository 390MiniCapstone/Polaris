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
//import { Graph } from '@/app/NodeNav';
import { dijkstra } from './utils';

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

  // const graphRef = useRef(new Graph());
  //  const graph = graphRef.current;

  // const [shortestPath, setShortestPath] = useState<string[]>([]);

  // useEffect(() => {
  //   graph.nodes.clear();
  //   graph.edges.clear();

  //   floorPlan?.nodes?.forEach(node => graph.addNode(node));

  //   floorPlan?.edges?.forEach(edge => {
  //     const fromNode = graph.nodes.get(edge.from);
  //     const toNode = graph.nodes.get(edge.to);

  //     if (fromNode && toNode) {
  //       const distance = fromNode.distanceTo(
  //         toNode,
  //         parseFloat(floorPlan.width),
  //         parseFloat(floorPlan.height)
  //       );
  //       graph.addEdge(fromNode.id, toNode.id, distance);
  //     }
  //   });

  //   console.log('Graph Updated', graph);

  //   const startNode = 'EN4';
  //   const endNode = 'H13';
  //   const { path } = dijkstra(graph, startNode, endNode);

  //   setShortestPath(path);
  //   console.log(`Shortest Path: ${path.join(' → ')}`);
  // }, [floorPlan]);

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

            {/* {floorPlan?.nodes?.map(node => (
              <React.Fragment key={node.id}>
                <Circle
                  cx={node.getAbsoluteX(parseFloat(floorPlan.width))}
                  cy={node.getAbsoluteY(parseFloat(floorPlan.height))}
                  r={15}
                  fill={shortestPath.includes(node.id) ? 'red' : 'lightgrey'}
                />
                <SvgText
                  x={node.getAbsoluteX(parseFloat(floorPlan.width)) + 20}
                  y={node.getAbsoluteY(parseFloat(floorPlan.height)) - 20}
                  fontSize="25"
                  fill="purple"
                  textAnchor="middle"
                >
                  {node.id}
                </SvgText>
              </React.Fragment>
            ))}

            {floorPlan?.edges?.map((edge, index) => {
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
