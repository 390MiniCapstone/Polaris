import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
} from 'react';
import { LatLng } from 'react-native-maps';
import { NavigationState, TravelMode, RouteData } from '@/constants/types';
import { useMapLocation } from '@/hooks/useMapLocation';
import { lineString, point } from '@turf/helpers';
import nearestPointOnLine from '@turf/nearest-point-on-line';
import { bottomSheetRef, mapRef } from '@/utils/refs';
import { handleCurrentLocation } from '@/utils/mapHandlers';
import {
  clipPolylineFromSnappedPoint,
  computeRemainingDistance,
  computeRemainingTime,
  determineCurrentStep,
  determineNextInstruction,
  animateNavCamera,
} from '@/utils/navigationUtils';
import { useGoogleMapsRoute } from '@/hooks/useGoogleMapsRoute';

interface NavigationContextType {
  navigationState: NavigationState;
  setNavigationState: (state: NavigationState) => void;
  destination: LatLng | null;
  setDestination: (dest: LatLng) => void;
  travelMode: TravelMode;
  setTravelMode: (mode: TravelMode) => void;
  is3d: boolean;
  setIs3d: (is3d: boolean) => void;
  routeData: RouteData | null;
  remainingDistance: number | null;
  remainingTime: number | null;
  nextInstruction: string | null;
  snappedPoint: LatLng | null;
  clippedPolyline: LatLng[] | null;
  handleStartNavigation: () => void;
  startNavigationToDestination: (dest: LatLng) => void;
  cancelNavigation: () => void;
  error: Error | null;
  loading: boolean;
}

const NavigationContext = createContext<NavigationContextType | undefined>(
  undefined
);

export const NavigationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [navigationState, setNavigationState] =
    useState<NavigationState>('default');
  const [destination, setDestination] = useState<LatLng | null>(null);
  const [travelMode, setTravelMode] = useState<TravelMode>('DRIVE');
  const [is3d, setIs3d] = useState(true);
  const [remainingDistance, setRemainingDistance] = useState<number | null>(
    null
  );
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const [nextInstruction, setNextInstruction] = useState<string | null>(null);
  const [snappedPoint, setSnappedPoint] = useState<LatLng | null>(null);
  const [clippedPolyline, setClippedPolyline] = useState<LatLng[] | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  const { location } = useMapLocation();
  const { routeData, setRouteData } = useGoogleMapsRoute(
    location,
    destination,
    travelMode,
    navigationState,
    setError,
    setLoading
  );

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
          travelMode
        );
        setNextInstruction(instruction);

        const clipped = clipPolylineFromSnappedPoint(
          routeData.polyline,
          snappedLoc
        );
        setClippedPolyline(clipped);
      }
    }
  }, [location, routeData, travelMode]);

  useEffect(() => {
    if (
      navigationState === 'navigating' &&
      is3d &&
      location &&
      clippedPolyline &&
      routeData &&
      snappedPoint
    ) {
      const currentStep = determineCurrentStep(routeData.steps, snappedPoint);
      if (currentStep)
        animateNavCamera(location, clippedPolyline, currentStep, mapRef);
    }
  }, [
    location,
    navigationState,
    is3d,
    clippedPolyline,
    routeData,
    snappedPoint,
  ]);

  useEffect(() => {
    if (!remainingDistance) return;
    const arrivalThreshold = 10;
    if (
      navigationState === 'navigating' &&
      remainingDistance <= arrivalThreshold
    ) {
      cancelNavigation();
    }
  }, [remainingDistance, navigationState]);

  const handleStartNavigation = () => {
    if (!location || !clippedPolyline || !routeData || !snappedPoint || error)
      return;
    setNavigationState('navigating');
    const currentStep = determineCurrentStep(routeData.steps, snappedPoint);
    if (currentStep)
      animateNavCamera(location, clippedPolyline, currentStep, mapRef);
  };

  const startNavigationToDestination = (dest: LatLng) => {
    setDestination(dest);
    bottomSheetRef.current?.close();
    setNavigationState('planning');
  };

  const setToDefault = () => {
    setNavigationState('default');
    setRouteData(null);
    setTravelMode('DRIVE');
    setIs3d(true);
    setRemainingDistance(null);
    setRemainingTime(null);
    setNextInstruction(null);
    setSnappedPoint(null);
    setClippedPolyline(null);
  };

  const cancelNavigation = () => {
    bottomSheetRef.current?.snapToIndex(1);
    handleCurrentLocation(mapRef, location);
    setToDefault();
  };

  const contextValue = useMemo(
    () => ({
      navigationState,
      setNavigationState,
      destination,
      setDestination,
      travelMode,
      setTravelMode,
      is3d,
      setIs3d,
      routeData,
      remainingDistance,
      remainingTime,
      nextInstruction,
      snappedPoint,
      clippedPolyline,
      handleStartNavigation,
      startNavigationToDestination,
      cancelNavigation,
      error,
      loading,
    }),
    [
      navigationState,
      destination,
      travelMode,
      is3d,
      routeData,
      remainingDistance,
      remainingTime,
      nextInstruction,
      snappedPoint,
      clippedPolyline,
      error,
      loading,
    ]
  );

  return (
    <NavigationContext.Provider value={contextValue}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};
