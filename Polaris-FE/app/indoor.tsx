import { useMemo, useRef, useState } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';

import PinchPanContainer from '@/components/PinchPanContainer/PinchPanContainer';
import { FLOOR_PLANS } from '@/constants/floorPlans';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { IndoorBottomSheetComponent } from '@/components/BottomSheetComponent/IndoorBottomSheetComponent';
import { useBuildingContext } from '@/contexts/BuildingContext/BuildingContext';
import { BuildingFlyWeight } from './indoor-logic/buildingFlyWeight';
import { Building } from './indoor-logic/building';
import { AdjacencyListGraph } from './indoor-logic/graph';
import { Dijkstra } from './indoor-logic/dijkstra';
import { NodeNav } from './NodeNav';
import { FloorPlanObject } from '@/constants/floorPlans';

const Indoor = () => {
  const { indoorBuilding } = useBuildingContext();
  const DEFAULT_FLOOR = FLOOR_PLANS?.[indoorBuilding]?.[0];
  const buildingRef = useRef<Building>();
  const [floorPlan, setFloorPlan] = useState(DEFAULT_FLOOR);

  const { djsNodes, djsEdges } = useMemo(() => {
    buildingRef.current = BuildingFlyWeight.getBuilding(indoorBuilding);
    const graph = buildingRef.current.getGraph();

    const djs = new Dijkstra(new NodeNav('23', 0.27, 0.7, 'room'), graph);
    const path = djs.getPathFromSource(
      // new NodeNav('199-40', 0.58, 0.53, 'room')
      new NodeNav('224-1', 0.55, 0.33, 'room')
    );

    const edges = djs.getEdgesFromSource(
      // new NodeNav('199-40', 0.58, 0.53, 'room'),
      new NodeNav('224-1', 0.55, 0.33, 'room'),
      graph
    );

    return { djsNodes: path, djsEdges: edges };
  }, [indoorBuilding]);

  const filterDjsNodes = (floorPlan: FloorPlanObject, djsNodes: NodeNav[]) => {
    const nodeSet = new Set();
    // const edgeSet = new Set(); if both node ids are in the set then display the edge later on no need or a set
    FLOOR_PLANS[indoorBuilding]
      .find(floorObj => floorObj.name === floorPlan.name)
      ?.nodes.forEach(node => nodeSet.add(node.id));
    return djsNodes?.filter((node: NodeNav) => nodeSet.has(node.id));
  };

  const filteredDjsNodes = filterDjsNodes(floorPlan, djsNodes);

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <View style={styles.floorPlanWrapper}>
          <PinchPanContainer
            floorPlan={floorPlan}
            filteredDjsNodes={filteredDjsNodes}
            djsEdges={djsEdges}
          />
        </View>
        <IndoorBottomSheetComponent
          floorPlan={floorPlan}
          selectFloor={setFloorPlan}
          indoorBuilding={indoorBuilding}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default Indoor;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fceed4',
  },
  floorPlanWrapper: {
    flex: 1,
  },
});
