import React, { useState } from 'react';
import { View, Button, StyleSheet, SafeAreaView } from 'react-native';

import PinchPanContainer from '@/components/PinchPanContainer/PinchPanContainer';
import { FLOOR_PLANS } from '@/constants/floorPlans';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { IndoorBottomSheetComponent } from '@/components/BottomSheetComponent/IndoorBottomSheetComponent';

const Indoor = () => {
  const DEFAULT_FLOOR = FLOOR_PLANS.H8_FLOOR_PLAN;
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
