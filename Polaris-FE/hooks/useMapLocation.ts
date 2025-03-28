import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { Region } from 'react-native-maps';
import { LocationPermissionStatus } from '@/constants/types';

export const useMapLocation = () => {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [region, setRegion] = useState<Region | undefined>(undefined);
  const [permissionStatus, setPermissionStatus] =
    useState<LocationPermissionStatus>('requesting');

  useEffect(() => {
    let subscriber: Location.LocationSubscription | null = null;
    let intervalId: NodeJS.Timeout | null = null;

    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setPermissionStatus('denied');
          return;
        }

        setPermissionStatus('granted');
        subscriber = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.BestForNavigation,
            timeInterval: 0,
            distanceInterval: 0,
          },
          newLocation => {
            const { latitude, longitude } = newLocation.coords;
            setLocation({ latitude, longitude });

            setRegion({
              latitude,
              longitude,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            });
          }
        );
      } catch (error) {
        setPermissionStatus('error');
      }
    })();

    return () => {
      if (subscriber) {
        subscriber.remove();
      }
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

  return { location, region, setRegion, permissionStatus };
};
