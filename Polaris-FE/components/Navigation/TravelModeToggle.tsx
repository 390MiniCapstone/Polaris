import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome, FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import { TravelMode } from '@/constants/types';

interface TravelModeToggleProps {
  selectedMode: TravelMode;
  onModeSelect: (mode: TravelMode) => void;
}

const ModeButton: React.FC<{
  mode: TravelMode;
  selectedMode: TravelMode;
  onModeSelect: (mode: TravelMode) => void;
  icon: React.ReactNode;
}> = ({ mode, selectedMode, onModeSelect, icon }) => (
  <TouchableOpacity
    style={[styles.modeButton, selectedMode === mode && styles.selected]}
    onPress={() => onModeSelect(mode)}
    testID={`transport-mode-button-${mode}`}
  >
    {icon}
  </TouchableOpacity>
);

export const TravelModeToggle: React.FC<TravelModeToggleProps> = ({
  selectedMode,
  onModeSelect,
}) => {
  return (
    <View style={styles.container}>
      <ModeButton
        mode="DRIVE"
        selectedMode={selectedMode}
        onModeSelect={onModeSelect}
        icon={<FontAwesome6 name="car" size={22} color="white" />}
      />
      <ModeButton
        mode="WALK"
        selectedMode={selectedMode}
        onModeSelect={onModeSelect}
        icon={<FontAwesome5 name="walking" size={22} color="white" />}
      />
      <ModeButton
        mode="TRANSIT"
        selectedMode={selectedMode}
        onModeSelect={onModeSelect}
        icon={<FontAwesome6 name="bus-simple" size={22} color="white" />}
      />
      <ModeButton
        mode="BICYCLE"
        selectedMode={selectedMode}
        onModeSelect={onModeSelect}
        icon={<FontAwesome name="bicycle" size={22} color="white" />}
      />
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
