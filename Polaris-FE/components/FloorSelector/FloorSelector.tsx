import React from 'react';
import { FloorPlanObject } from '@/constants/floorPlans';
import { FLOOR_PLANS } from '@/constants/floorPlans';
import { Picker } from '@react-native-picker/picker';
import { StyleSheet, View } from 'react-native';

type FloorSelectorProps = {
  floorPlan: FloorPlanObject;
  selectFloor: (floorPlan: FloorPlanObject) => void;
  indoorBuilding: string | null;
};

export const FloorSelector: React.FC<FloorSelectorProps> = ({
  floorPlan,
  selectFloor,
  indoorBuilding,
}) => {
  const availableFloors = FLOOR_PLANS[indoorBuilding] || [];
  return (
    <View style={styles.pickerContainer} testID="picker-container">
      <Picker
        selectedValue={floorPlan.name}
        onValueChange={(itemValue: string) => {
          let selected: FloorPlanObject | undefined;

          for (const [building, floors] of Object.entries(FLOOR_PLANS)) {
            if (building === indoorBuilding) {
              selected = floors.find(
                (floor: FloorPlanObject) => floor.name === itemValue
              );
              break;
            }
          }

          if (selected) selectFloor(selected);
        }}
        style={styles.picker}
      >
        {availableFloors.map((floor: FloorPlanObject) => (
          <Picker.Item key={floor.name} label={floor.name} value={floor.name} />
        ))}
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  pickerContainer: {
    height: 125,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#222',
    marginBottom: 10,
    borderRadius: 10,
    width: 250,
    overflow: 'visible',
  },
  picker: {
    width: '80%',
    color: 'white',
  },
});
