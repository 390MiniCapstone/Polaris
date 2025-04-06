import React from 'react';
import { LatLng, Marker } from 'react-native-maps';
import { useNavigation } from '@/contexts/NavigationContext/NavigationContext';
import { FontAwesome6 } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import useTheme from '@/hooks/useTheme';

export const NavigationMarkers: React.FC = () => {
  const { theme } = useTheme();
  const {
    shuttleData,
    navigationState,
    nextDeparture,
    travelMode,
    nearestBusStop,
    otherBusStop,
    destination,
    clippedPolyline,
    snappedPoint,
  } = useNavigation();

  const Buses = () => {
    if (
      !shuttleData ||
      !shuttleData.legTwo ||
      !shuttleData.legTwo.busPoints ||
      navigationState === 'default' ||
      !nextDeparture
    ) {
      return null;
    }

    return (
      <>
        {shuttleData.legTwo.busPoints.map((point: LatLng, index: number) => (
          <Marker key={index} coordinate={point}>
            <FontAwesome6 name="van-shuttle" size={18} color="white" />
          </Marker>
        ))}
      </>
    );
  };

  const Stops = () => {
    if (travelMode === 'SHUTTLE' && nearestBusStop && otherBusStop) {
      return (
        <>
          <Marker coordinate={nearestBusStop.location}>
            <View style={styles.stopView}>
              <Text style={styles.stopText}>{nearestBusStop.shortName}</Text>
            </View>
          </Marker>
          <Marker coordinate={otherBusStop.location}>
            <View style={styles.stopView}>
              <Text style={styles.stopText}>{otherBusStop.shortName}</Text>
            </View>
          </Marker>
        </>
      );
    }
  };

  return (
    <>
      {(navigationState === 'planning' || navigationState === 'navigating') &&
        clippedPolyline &&
        snappedPoint &&
        destination && (
          <Marker
            key={theme.colors.primary}
            coordinate={destination}
            pinColor={theme.colors.primary}
          />
        )}

      {Buses()}
      {Stops()}
    </>
  );
};

const styles = StyleSheet.create({
  stopView: {
    backgroundColor: '#222',
    flex: 1,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  stopText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
  },
});
