import { useState, useEffect } from 'react';
import { LatLng } from 'react-native-maps';
import { TravelMode, ShuttleData, ShuttleBusStop } from '@/constants/types';
import { getGoogleMapsRoute } from '@/services/googleMapsRoutes';
import { mapRef } from '@/utils/refs';
import { getShuttleBus } from '@/services/shuttleBus';
import {
  getNearestBusStop,
  getNextDeparture,
  getOtherBusStop,
} from '@/utils/navigationUtils';
import { toast } from 'sonner-native';

interface ShuttleBusProps {
  origin: LatLng | null;
  nearestBusStop: ShuttleBusStop | null;
  setNearestBusStop: (busStop: ShuttleBusStop | null) => void;
  otherBusStop: ShuttleBusStop | null;
  setOtherBusStop: (busStop: ShuttleBusStop | null) => void;
  destination: LatLng | null;
  travelMode: TravelMode;
  navigationState: string;
  setError: (error: Error | null) => void;
  setLoading: (loading: boolean) => void;
  setNextDeparture: (nextDeparture: string | null) => void;
}

export const useShuttleBus = ({
  origin,
  nearestBusStop,
  setNearestBusStop,
  otherBusStop,
  setOtherBusStop,
  destination,
  travelMode,
  navigationState,
  setError,
  setLoading,
  setNextDeparture,
}: ShuttleBusProps) => {
  const [shuttleData, setShuttleData] = useState<ShuttleData | null>(null);

  const getBusPoints = async () => {
    try {
      const response = await getShuttleBus();

      return (
        response.d.Points as {
          ID: string;
          Latitude: number;
          Longitude: number;
        }[]
      )
        .filter(point => point.ID.startsWith('BUS'))
        .map(point => ({
          latitude: point.Latitude,
          longitude: point.Longitude,
        }));
    } catch (error) {
      toast.error('Failed to fetch bus points', {
        description: `${error instanceof Error ? error.message : 'Unknown error'}`,
        duration: 2000,
      });
      return [];
    }
  };

  useEffect(() => {
    if (origin && travelMode === 'SHUTTLE') {
      setNearestBusStop(getNearestBusStop(origin));
      setOtherBusStop(getOtherBusStop(origin));
    }
  }, [travelMode, navigationState, destination]);

  useEffect(() => {
    setLoading(true);
    if (!nearestBusStop || !shuttleData) return;
    setNextDeparture(
      getNextDeparture(nearestBusStop, shuttleData.legOne.totalDuration)
    );
    setLoading(false);
  }, [travelMode, nearestBusStop]);

  useEffect(() => {
    (async () => {
      if (
        !origin ||
        navigationState === 'default' ||
        travelMode !== 'SHUTTLE' ||
        !destination
      ) {
        setLoading(false);
        return;
      }

      if (!nearestBusStop || !otherBusStop) {
        setLoading(false);
        return;
      }

      try {
        const legOne = await getGoogleMapsRoute(
          origin,
          nearestBusStop.location,
          travelMode
        );

        const legThree = await getGoogleMapsRoute(
          otherBusStop.location,
          destination,
          travelMode
        );

        const legTwo = await getGoogleMapsRoute(
          nearestBusStop.location,
          otherBusStop.location,
          'DRIVE'
        );

        const busPoints = await getBusPoints();

        setShuttleData({
          legOne: legOne,
          legTwo: {
            busData: legTwo,
            busPoints: busPoints,
          },
          legThree: legThree,
        });

        setError(null);

        if (navigationState === 'planning') {
          mapRef.current?.fitToCoordinates(
            [
              origin,
              nearestBusStop.location,
              otherBusStop.location,
              destination,
            ],
            {
              edgePadding: {
                top: 120,
                right: 60,
                bottom: 120,
                left: 60,
              },
              animated: true,
            }
          );
        }
      } catch (error) {
        console.log(error);

        if (error instanceof Error) {
          setError(error);
        } else {
          setError(new Error('An unknown error occurred.'));
        }
      }
    })();
  }, [destination, travelMode, navigationState, nearestBusStop, otherBusStop]);

  useEffect(() => {
    if (!nearestBusStop || !shuttleData) return;

    const departure = getNextDeparture(
      nearestBusStop,
      shuttleData.legOne.totalDuration
    );

    if (departure) {
      setNextDeparture(departure);
    } else {
      setError(new Error('No Shuttle Available'));
    }
    setLoading(false);
  }, [travelMode, nearestBusStop, shuttleData]);

  useEffect(() => {
    if (navigationState === 'default' || travelMode !== 'SHUTTLE') return;

    const intervalId = setInterval(async () => {
      const busPoints = await getBusPoints();

      setShuttleData(prevData =>
        prevData ? { ...prevData, busPoints } : prevData
      );
    }, 15000);

    return () => {
      clearInterval(intervalId);
    };
  }, [navigationState, travelMode]);

  return { shuttleData, setShuttleData };
};
