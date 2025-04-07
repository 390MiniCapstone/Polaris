import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { LatLng, Region } from 'react-native-maps';
import { LocationPermissionStatus } from '@/constants/types';

export const useMapLocation = () => {
  const [location, setLocation] = useState<LatLng | null>(null);
  const [region, setRegion] = useState<Region | undefined>(undefined);
  const [permissionStatus, setPermissionStatus] =
    useState<LocationPermissionStatus>('requesting');

  useEffect(() => {
    let subscriber: Location.LocationSubscription | null = null;

    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setPermissionStatus('denied');
          return;
        }

        setPermissionStatus('granted');

        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        setLocation({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });

        setRegion({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        });

        subscriber = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.BestForNavigation,
            timeInterval: 1000,
            distanceInterval: 1,
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
        console.error('Error getting location:', error);
        setPermissionStatus('error');
      }
    })();

    return () => {
      if (subscriber) {
        subscriber.remove();
      }
    };
  }, []);

  return { location, region, setRegion, permissionStatus };
};
