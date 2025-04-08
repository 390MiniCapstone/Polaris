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
  const DEFAULT_FLOOR = FLOOR_PLANS?.[indoorBuilding]?.floors[0];
  const buildingRef = useRef<Building>();
  const [floorPlan, setFloorPlan] = useState(DEFAULT_FLOOR);

  const { djsNodes, djsEdges } = useMemo(() => {
    buildingRef.current = BuildingFlyWeight.getBuilding(indoorBuilding);
    const graph = buildingRef.current.getGraph();

    const djs = new Dijkstra(buildingRef.current.getNode('109-1')!, graph);
    const path = djs.getPathFromSource(
      // new NodeNav('39', 0.61, 0.89, 'hallway'),
      buildingRef.current.getNode('H43')!
    );
    // console.log('can we see',buildingRef.current.getNode('H119')!,)

    const edges = djs.getEdgesFromSource(
      // new NodeNav('39', 0.61, 0.89, 'hallway'),
      buildingRef.current.getNode('H43')!,
      graph
    );

    return { djsNodes: path, djsEdges: edges };
  }, [indoorBuilding]);

  const filterDjsNodes = (floorPlan: FloorPlanObject, djsNodes: NodeNav[]) => {
    const nodeSet = new Set();

    FLOOR_PLANS[indoorBuilding].floors
      ?.find(floorObj => floorObj.name === floorPlan.name)
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
