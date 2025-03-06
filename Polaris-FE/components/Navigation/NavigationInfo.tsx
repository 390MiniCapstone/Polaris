import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { handleCurrentLocation } from '@/utils/mapHandlers';
import { openTransitInMaps } from '@/utils/navigationUtils';
import { mapRef } from '@/utils/refs';
import { useMapLocation } from '@/hooks/useMapLocation';
import { useNavigation } from '@/contexts/NavigationContext/NavigationContext';

export const NavigationInfo: React.FC = () => {
  const { location } = useMapLocation();
  const {
    travelMode,
    is3d,
    setIs3d,
    remainingTime,
    remainingDistance,
    destination,
    cancelNavigation,
    handleStartNavigation,
    navigationState,
  } = useNavigation();

  const handlePress = () => {
    if (navigationState === 'navigating') {
      if (is3d) {
        handleCurrentLocation(mapRef, location);
        setIs3d(false);
      } else {
        handleStartNavigation();
        setIs3d(true);
      }
    } else {
      if (travelMode === 'TRANSIT' && location) {
        openTransitInMaps(location, destination);
      } else {
        handleStartNavigation();
      }
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        testID="cancel-button"
        style={styles.cancelButton}
        onPress={cancelNavigation}
      >
        <FontAwesome5 name="times" size={20} color="white" />
      </TouchableOpacity>

      <View style={styles.infoContainer}>
        <Text style={styles.timeText}>
          {Math.ceil(remainingTime / 60)} Minutes
        </Text>
        <Text style={styles.timeText}>·</Text>
        <Text style={styles.distanceText}>
          {(remainingDistance / 1000).toFixed(1)} km
        </Text>
      </View>

      <TouchableOpacity
        testID="action-button"
        style={
          navigationState === 'navigating'
            ? styles.currentButton
            : styles.goButton
        }
        onPress={handlePress}
      >
        {navigationState === 'navigating' ? (
          <FontAwesome5 name="location-arrow" size={16} color="white" />
        ) : (
          <Text style={styles.goButtonText}>GO</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 75,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'rgba(34, 34, 34, 0.992)',
    borderRadius: 12,
    height: 36,
    width: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    backgroundColor: 'rgba(34, 34, 34, 0.992)',
    paddingHorizontal: 20,
    borderRadius: 16,
    minWidth: 200,
    height: 46,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 5,
    alignItems: 'center',
  },
  timeText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  distanceText: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  currentButton: {
    backgroundColor: 'rgba(34, 34, 34, 0.992)',
    borderRadius: 12,
    height: 36,
    width: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goButton: {
    backgroundColor: '#9A2E3F',
    borderRadius: 12,
    height: 36,
    width: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
