import React, { useRef } from 'react';
import { Pressable, View, StyleSheet } from 'react-native';
import { BottomSheetComponent } from '@/components/BottomSheetComponent/BottomSheetComponent';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSharedValue } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { FloorPlanObject } from '@/constants/floorPlans';
import { FloorSelector } from '@/components/FloorSelector/FloorSelector';

type FloorSelectorProps = {
  floorPlan: FloorPlanObject;
  selectFloor: (floorPlan: FloorPlanObject) => void;
};

export const IndoorBottomSheetComponent: React.FC<FloorSelectorProps> = ({
  floorPlan,
  selectFloor,
}) => {
  const bottomSheetRef = useRef<any>(null);
  const router = useRouter();
  const animatedPosition = useSharedValue(0);

  return (
    <BottomSheetComponent
      bottomSheetRef={bottomSheetRef}
      animatedPosition={animatedPosition}
    >
      <View style={styles.container}>
        <FloorSelector floorPlan={floorPlan} selectFloor={selectFloor} />
        <Pressable style={styles.icon} onPress={() => router.back()}>
          <Ionicons name="school-sharp" size={24} color="white" />
        </Pressable>
      </View>
    </BottomSheetComponent>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  icon: { paddingVertical: 20 },
});
