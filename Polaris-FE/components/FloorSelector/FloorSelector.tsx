import React from 'react';
import { FloorPlanObject } from '@/constants/floorPlans';
import { FLOOR_PLANS } from '@/constants/floorPlans';
import { Picker } from '@react-native-picker/picker';
import { StyleSheet, View } from 'react-native';

type FloorSelectorProps = {
  floorPlan: FloorPlanObject;
  selectFloor: (floorPlan: FloorPlanObject) => void;
};

export const FloorSelector: React.FC<FloorSelectorProps> = ({
  floorPlan,
  selectFloor,
}) => {
  return (
    <View style={styles.pickerContainer}>
      <Picker
        selectedValue={floorPlan.name}
        onValueChange={(itemValue: string) => {
          const selected = Object.values(FLOOR_PLANS).find(
            floor => floor.name === itemValue
          );
          if (selected) selectFloor(selected);
        }}
        style={styles.picker}
      >
        {Object.values(FLOOR_PLANS).map(floor => {
          const floorName = floor.name;
          return (
            <Picker.Item key={floorName} label={floorName} value={floorName} />
          );
        })}
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
