import { useState } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';

import PinchPanContainer from '@/components/PinchPanContainer/PinchPanContainer';
import { FLOOR_PLANS } from '@/constants/floorPlans';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { IndoorBottomSheetComponent } from '@/components/BottomSheetComponent/IndoorBottomSheetComponent';
import { useBuildingContext } from './BuildingContext';

const Indoor = () => {
  const { indoorBuilding } = useBuildingContext();
  const DEFAULT_FLOOR = indoorBuilding
    ? FLOOR_PLANS[indoorBuilding]?.[0]
    : null;
  const [floorPlan, setFloorPlan] = useState(DEFAULT_FLOOR);
  console.log('testing', indoorBuilding);
  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <View style={styles.floorPlanWrapper}>
          <PinchPanContainer floorPlan={floorPlan} />
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
