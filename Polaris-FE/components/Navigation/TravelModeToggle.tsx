import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome, FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import { useNavigation } from '@/contexts/NavigationContext/NavigationContext';

export const TravelModeToggle: React.FC = () => {
  const { travelMode, setTravelMode } = useNavigation();

  const ModeButton: React.FC<{
    mode: typeof travelMode;
    travelMode: typeof travelMode;
    setTravelMode: (mode: typeof travelMode) => void;
    icon: React.ReactNode;
  }> = ({ mode, travelMode, setTravelMode, icon }) => (
    <TouchableOpacity
      style={[styles.modeButton, travelMode === mode && styles.selected]}
      onPress={() => setTravelMode(mode)}
      testID={`transport-mode-button-${mode}`}
    >
      {icon}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ModeButton
        mode="DRIVE"
        travelMode={travelMode}
        setTravelMode={setTravelMode}
        icon={<FontAwesome6 name="car" size={22} color="white" />}
      />
      <ModeButton
        mode="WALK"
        travelMode={travelMode}
        setTravelMode={setTravelMode}
        icon={<FontAwesome5 name="walking" size={22} color="white" />}
      />
      <ModeButton
        mode="TRANSIT"
        travelMode={travelMode}
        setTravelMode={setTravelMode}
        icon={<FontAwesome6 name="bus-simple" size={22} color="white" />}
      />
      <ModeButton
        mode="BICYCLE"
        travelMode={travelMode}
        setTravelMode={setTravelMode}
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
