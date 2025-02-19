import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome, FontAwesome5, FontAwesome6 } from '@expo/vector-icons';

type TransportMode = 'DRIVE' | 'WALK' | 'TRANSIT' | 'BICYCLE';

interface TransportModeProps {
  selectedMode: TransportMode;
  onModeSelect: (mode: TransportMode) => void;
}

export const TransportMode: React.FC<TransportModeProps> = ({
  selectedMode,
  onModeSelect,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.modeButton, selectedMode === 'DRIVE' && styles.selected]}
        onPress={() => onModeSelect('DRIVE')}
        testID="transport-mode-button-DRIVE"
      >
        <FontAwesome6 name="car" size={22} color="white" />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.modeButton, selectedMode === 'WALK' && styles.selected]}
        onPress={() => onModeSelect('WALK')}
        testID="transport-mode-button-WALK"
      >
        <FontAwesome5 name="walking" size={22} color="white" />
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.modeButton,
          selectedMode === 'TRANSIT' && styles.selected,
        ]}
        onPress={() => onModeSelect('TRANSIT')}
        testID="transport-mode-button-TRANSIT"
      >
        <FontAwesome6 name="bus-simple" size={22} color="white" />
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.modeButton,
          selectedMode === 'BICYCLE' && styles.selected,
        ]}
        onPress={() => onModeSelect('BICYCLE')}
        testID="transport-mode-button-BICYCLE"
      >
        <FontAwesome name="bicycle" size={22} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    position: 'absolute',
    top: 76,
    left: 0,
    right: 0,
    justifyContent: 'center',
    gap: 14,
  },
  modeButton: {
    backgroundColor: 'rgba(34, 34, 34, 0.992)',
    borderRadius: 15,
    height: 40,
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selected: {
    backgroundColor: '#9A2E3F',
  },
});
