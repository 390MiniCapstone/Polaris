import { useState } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';

import PinchPanContainer from '@/components/PinchPanContainer/PinchPanContainer';
import { FLOOR_PLANS } from '@/constants/floorPlans';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { IndoorBottomSheetComponent } from '@/components/BottomSheetComponent/IndoorBottomSheetComponent';
import { useBuildingContext } from '@/contexts/BuildingContext/BuildingContext';

const Indoor = () => {
  const { indoorBuilding } = useBuildingContext();

  const DEFAULT_FLOOR = FLOOR_PLANS?.[indoorBuilding]?.[0];

  const [floorPlan, setFloorPlan] = useState(DEFAULT_FLOOR);

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
    backgroundColor: '#fceed4',
  },
  floorPlanWrapper: {
    flex: 1,
  },
});
