import React from 'react';
import { LatLng, Marker } from 'react-native-maps';
import { useNavigation } from '@/contexts/NavigationContext/NavigationContext';
import { FontAwesome6 } from '@expo/vector-icons';
import { TravelMode, ShuttleBusStop } from '@/constants/types';
import { StyleSheet, Text, View } from 'react-native';
import useTheme from '@/hooks/useTheme';

const Buses: React.FC<{
  busPoints: LatLng[] | undefined;
  navigationState: string;
  nextDeparture: string | null;
}> = ({ busPoints, navigationState, nextDeparture }) => {
  if (!busPoints || navigationState === 'default' || !nextDeparture) {
    return null;
  }

  return (
    <>
      {busPoints.map((point: LatLng) => (
        <Marker key={`${point.latitude}-${point.longitude}`} coordinate={point}>
          <FontAwesome6
            testID="shuttle-marker"
            name="van-shuttle"
            size={18}
            color="white"
          />
        </Marker>
      ))}
    </>
  );
};

const Stops = ({
  travelMode,
  nearestBusStop,
  otherBusStop,
}: {
  travelMode: TravelMode;
  nearestBusStop: ShuttleBusStop | null;
  otherBusStop: ShuttleBusStop | null;
}) => {
  if (travelMode === 'SHUTTLE' && nearestBusStop && otherBusStop) {
    return (
      <>
        <Marker testID="stop-marker" coordinate={nearestBusStop.location}>
          <View style={styles.stopView}>
            <Text style={styles.stopText}>{nearestBusStop.shortName}</Text>
          </View>
        </Marker>
        <Marker testID="stop-marker" coordinate={otherBusStop.location}>
          <View style={styles.stopView}>
            <Text style={styles.stopText}>{otherBusStop.shortName}</Text>
          </View>
        </Marker>
      </>
    );
  }
  return null;
};

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

  return (
    <>
      {(navigationState === 'planning' || navigationState === 'navigating') &&
        clippedPolyline &&
        snappedPoint &&
        destination && (
          <Marker
            testID="destination-marker"
            key={theme.colors.primary}
            coordinate={destination}
            pinColor={theme.colors.primary}
          />
        )}

      <Buses
        busPoints={shuttleData?.legTwo?.busPoints}
        navigationState={navigationState}
        nextDeparture={nextDeparture}
      />
      <Stops
        travelMode={travelMode}
        nearestBusStop={nearestBusStop}
        otherBusStop={otherBusStop}
      />
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
