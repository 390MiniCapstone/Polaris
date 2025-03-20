import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome, FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import { useNavigation } from '@/contexts/NavigationContext/NavigationContext';

export const TravelModeToggle: React.FC = () => {
  const { travelMode, setTravelMode } = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.modeButton, travelMode === 'DRIVE' && styles.selected]}
        onPress={() => setTravelMode('DRIVE')}
        testID="transport-mode-button-DRIVE"
      >
        <FontAwesome6 name="car" size={22} color="white" />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.modeButton, travelMode === 'WALK' && styles.selected]}
        onPress={() => setTravelMode('WALK')}
        testID="transport-mode-button-WALK"
      >
        <FontAwesome5 name="walking" size={22} color="white" />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.modeButton, travelMode === 'TRANSIT' && styles.selected]}
        onPress={() => setTravelMode('TRANSIT')}
        testID="transport-mode-button-TRANSIT"
      >
        <FontAwesome6 name="bus-simple" size={22} color="white" />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.modeButton, travelMode === 'BICYCLE' && styles.selected]}
        onPress={() => setTravelMode('BICYCLE')}
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
