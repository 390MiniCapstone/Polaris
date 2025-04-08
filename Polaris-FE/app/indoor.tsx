import { useMemo, useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';

import { IndoorBottomSheetComponent } from '@/components/BottomSheetComponent/IndoorBottomSheetComponent';
import PinchPanContainer from '@/components/PinchPanContainer/PinchPanContainer';
import { FLOOR_PLANS, FloorPlanObject } from '@/constants/floorPlans';
import { useBuildingContext } from '@/contexts/BuildingContext/BuildingContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Building } from './indoor-logic/building';
import { BuildingFlyWeight } from './indoor-logic/buildingFlyWeight';
import { Dijkstra } from './indoor-logic/dijkstra';
import NodeInput from './NodeInputComponent';
import { NodeNav } from './NodeNav';

const Indoor = () => {
  const { indoorBuilding } = useBuildingContext();
  const DEFAULT_FLOOR = FLOOR_PLANS?.[indoorBuilding]?.floors[0];
  const buildingRef = useRef<Building>();
  const [floorPlan, setFloorPlan] = useState(DEFAULT_FLOOR);
  const [startNode, setStartNode] = useState('');
  const [destinationNode, setDestinationNode] = useState('');

  const { djsNodes, djsEdges } = useMemo(() => {
    buildingRef.current = BuildingFlyWeight.getBuilding(indoorBuilding);
    const graph = buildingRef.current.getGraph();

    if (
      !buildingRef.current.getNode(startNode) ||
      !buildingRef.current.getNode(destinationNode)
    ) {
      return { djsNodes: [], djsEdges: [] };
    }

    const djs = new Dijkstra(buildingRef.current.getNode(startNode)!, graph);
    const path = djs.getPathFromSource(
      buildingRef.current.getNode(destinationNode)!
    );
    const edges = djs.getEdgesFromSource(
      buildingRef.current.getNode(destinationNode)!,
      graph
    );

    return { djsNodes: path, djsEdges: edges };
  }, [indoorBuilding, startNode, destinationNode]);

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
          <View style={styles.inputContainer}>
            <NodeInput
              label="Start"
              value={startNode}
              onChangeText={setStartNode}
            />
            <NodeInput
              label="Destination"
              value={destinationNode}
              onChangeText={setDestinationNode}
            />
          </View>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fceed4',
  },
  floorPlanWrapper: {
    flex: 1,
  },
  inputContainer: {
    padding: 32,
    backgroundColor: '#1e1e1e',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
});

export default Indoor;
