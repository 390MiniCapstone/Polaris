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

const Indoor = () => {
  const { indoorBuilding } = useBuildingContext();
  const DEFAULT_FLOOR = FLOOR_PLANS?.[indoorBuilding]?.[0];
  const buildingRef = useRef<Building>();
  const [floorPlan, setFloorPlan] = useState(DEFAULT_FLOOR);

  const { path } = useMemo(() => {
    buildingRef.current = BuildingFlyWeight.getBuilding(indoorBuilding);
    const graph = buildingRef.current.getGraph();

    const djs = new Dijkstra(new NodeNav('23', 0.27, 0.7, 'room'), graph);
    const path = djs.getPathFromSource(
      new NodeNav('199-40', 0.58, 0.53, 'room')
    );
    // console.log(path.map(node => node.id));

    return { path: path };
  }, [indoorBuilding]);

  console.log(path);

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <View style={styles.floorPlanWrapper}>
          <PinchPanContainer floorPlan={floorPlan} path={path} />
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
    backgroundColor: 'black',
  },
  floorPlanWrapper: {
    flex: 1,
  },
});
