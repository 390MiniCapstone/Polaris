import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { bottomSheetRef, mapRef } from '@/utils/refs';
import React, { SetStateAction, useEffect, useState } from 'react';
import { TransportMode } from '@/components/Navigation/TransportMode';
import { Instructions } from './Instructions';
import { NavigationInfo } from '@/components/Navigation/NavigationInfo';
import { useMapLocation } from '@/hooks/useMapLocation';
import { lineString, point } from '@turf/helpers';
import nearestPointOnLine from '@turf/nearest-point-on-line';
import { handleCurrentLocation } from '@/utils/mapHandlers';
import {
  getGoogleMapsRoute,
  LatLng,
  RouteData,
} from '@/services/googleMapsRoutes';
import {
  clipPolylineFromSnappedPoint,
  computeRemainingDistance,
  computeRemainingTime,
  determineNextInstruction,
  startNavigation,
} from '@/utils/navigationUtils';

type NavigationState = 'default' | 'planning' | 'navigating';
type TransportMode = 'DRIVE' | 'WALK' | 'TRANSIT' | 'BICYCLE';

interface NavigationProps {
  navigationState: NavigationState;
  setNavigationState: React.Dispatch<SetStateAction<NavigationState>>;
  destination: { latitude: number; longitude: number };
  setDestination: React.Dispatch<SetStateAction<LatLng>>;
  transportMode: TransportMode;
  setTransportMode: React.Dispatch<SetStateAction<TransportMode>>;
  setSnappedPoint: React.Dispatch<SetStateAction<LatLng | null>>;
  clippedPolyline: LatLng[] | null;
  setClippedPolyline: React.Dispatch<SetStateAction<LatLng[] | null>>;
}

export const Navigation: React.FC<NavigationProps> = ({
  navigationState,
  setNavigationState,
  destination,
  setDestination,
  transportMode,
  setTransportMode,
  setSnappedPoint,
  clippedPolyline,
  setClippedPolyline,
}) => {
  const [is3d, setIs3d] = useState(true);
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [remainingDistance, setRemainingDistance] = useState<number>(0);
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [nextInstruction, setNextInstruction] = useState<string>('');

  const { location } = useMapLocation();

  useEffect(() => {
    (async () => {
      if (!location) return;
      if (navigationState === 'default') return;
      try {
        const data = await getGoogleMapsRoute(
          location,
          destination,
          transportMode
        );
        setRouteData(data);
        {
          navigationState === 'planning' &&
            mapRef.current?.fitToCoordinates(data.polyline, {
              edgePadding: {
                top: 80,
                right: 60,
                bottom: 80,
                left: 60,
              },
              animated: true,
            });
        }
      } catch (error) {
        console.error('Failed to fetch route data:', error);
      }
    })();
  }, [destination, transportMode]);

  useEffect(() => {
    if (location && routeData) {
      const turfLine = lineString(
        routeData.polyline.map(coord => [coord.longitude, coord.latitude])
      );
      const userPoint = point([location.longitude, location.latitude]);
      const snapped = nearestPointOnLine(turfLine, userPoint);
      if (snapped?.geometry?.coordinates) {
        const [lng, lat] = snapped.geometry.coordinates;
        const snappedLoc: LatLng = { latitude: lat, longitude: lng };
        setSnappedPoint(snappedLoc);

        const newRemainingTime = computeRemainingTime(
          routeData.steps,
          snappedLoc,
          routeData.totalDuration
        );
        const newRemainingDistance = computeRemainingDistance(
          routeData.steps,
          snappedLoc,
          routeData.totalDistance
        );
        setRemainingTime(newRemainingTime);
        setRemainingDistance(newRemainingDistance);

        const instruction = determineNextInstruction(
          routeData.steps,
          snappedLoc,
          transportMode
        );
        setNextInstruction(instruction);

        const clipped = clipPolylineFromSnappedPoint(
          routeData.polyline,
          snappedLoc
        );
        setClippedPolyline(clipped);
      }
    }
  }, [location, routeData, transportMode]);

  useEffect(() => {
    if (
      navigationState === 'navigating' &&
      is3d &&
      location &&
      clippedPolyline
    ) {
      startNavigation(location, clippedPolyline, mapRef);
    }
  }, [location, navigationState]);

  useEffect(() => {
    const arrivalThreshold = 10; // meters
    if (
      navigationState === 'navigating' &&
      remainingDistance <= arrivalThreshold
    ) {
      bottomSheetRef.current?.snapToIndex(1);
      handleCurrentLocation(mapRef, location);
      setNavigationState('default');
    }
  }, [remainingDistance, navigationState]);

  const handleStartNavigation = () => {
    if (!location || !clippedPolyline) return;
    setNavigationState('navigating');
    startNavigation(location, clippedPolyline, mapRef);
  };

  return (
    <>
      {navigationState === 'default' && (
        <TouchableOpacity
          style={styles.navigateButton}
          onPress={() => {
            bottomSheetRef.current?.close();
            setNavigationState('planning');
            // setDestination({
            //             //   latitude: 45.50748945490343,
            //             //   longitude: -73.5621201938624,
            //             // });
            setDestination({
              latitude: 37.39223512591287,
              longitude: -122.16990035825833,
            });
            // setDestination({
            //   latitude: 45.4808743,
            //   longitude: -73.6199895,
            // });
          }}
        >
          <Text style={styles.text}>Navigation Demo</Text>
        </TouchableOpacity>
      )}

      {navigationState === 'planning' && (
        <TransportMode
          selectedMode={transportMode}
          onModeSelect={setTransportMode}
        />
      )}

      {navigationState === 'navigating' && (
        <Instructions instruction={nextInstruction} />
      )}

      {(navigationState === 'planning' || navigationState === 'navigating') &&
        routeData && (
          <>
            <NavigationInfo
              duration={remainingTime}
              distance={remainingDistance}
              isNavigating={navigationState === 'navigating'}
              is3d={is3d}
              transportMode={transportMode}
              destination={destination}
              updateIs3d={setIs3d}
              onCancel={() => {
                bottomSheetRef.current?.snapToIndex(1);
                handleCurrentLocation(mapRef, location);
                setNavigationState('default');
              }}
              onStartNavigation={handleStartNavigation}
            />
          </>
        )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  navigateButton: {
    position: 'absolute',
    top: 70,
    left: 15,
    backgroundColor: 'rgba(34, 34, 34, 0.992)',
    borderRadius: 12,
    height: 36,
    width: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
  },
});
