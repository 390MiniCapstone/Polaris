import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
} from 'react';
import { LatLng } from 'react-native-maps';
import {
  NavigationState,
  TravelMode,
  RouteData,
  ShuttleLeg,
  ShuttleBusStop,
  ShuttleData,
} from '@/constants/types';
import { useMapLocation } from '@/hooks/useMapLocation';
import { bottomSheetRef, mapRef } from '@/utils/refs';
import { handleCurrentLocation } from '@/utils/mapHandlers';
import {
  determineCurrentStep,
  animateNavCamera,
} from '@/utils/navigationUtils';
import { useGoogleMapsRoute } from '@/hooks/useGoogleMapsRoute';
import { useNavigationData } from '@/hooks/useNavigationData';
import { useShuttleBus } from '@/hooks/useShuttleBus';
import { useShuttleData } from '@/hooks/useShuttleData';

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
  setToDefault: () => void;
  cancelNavigation: () => void;
  shuttleData: ShuttleData | null;
  error: Error | null;
  loading: boolean;
  nearestBusStop: ShuttleBusStop | null;
  otherBusStop: ShuttleBusStop | null;
  nextDeparture: string | null;
  currentLeg: ShuttleLeg;
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
  const [nearestBusStop, setNearestBusStop] = useState<ShuttleBusStop | null>(
    null
  );
  const [otherBusStop, setOtherBusStop] = useState<ShuttleBusStop | null>(null);
  const [currentLeg, setCurrentLeg] = useState<ShuttleLeg>('legOne');
  const [nextDeparture, setNextDeparture] = useState<string | null>(null);

  const handleStartNavigation = () => {
    if (!location || !clippedPolyline || !routeData || !snappedPoint || error)
      return;
    setNavigationState('navigating');
    if (travelMode === 'SHUTTLE' && shuttleData && shuttleData.legOne) {
      const currentStep = determineCurrentStep(
        shuttleData.legOne.steps,
        snappedPoint
      );
      if (currentStep)
        animateNavCamera(location, clippedPolyline, currentStep, mapRef);
    } else {
      const currentStep = determineCurrentStep(routeData.steps, snappedPoint);
      if (currentStep)
        animateNavCamera(location, clippedPolyline, currentStep, mapRef);
    }
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
    setShuttleData(null);
    setNearestBusStop(null);
    setNextDeparture(null);
  };

  const cancelNavigation = () => {
    bottomSheetRef.current?.snapToIndex(1);
    handleCurrentLocation(mapRef, location);
    setToDefault();
  };

  const { location } = useMapLocation();

  const { routeData, setRouteData } = useGoogleMapsRoute(
    location,
    destination,
    travelMode,
    navigationState,
    setError,
    setLoading
  );

  const { shuttleData, setShuttleData } = useShuttleBus(
    location,
    nearestBusStop,
    setNearestBusStop,
    otherBusStop,
    setOtherBusStop,
    destination,
    travelMode,
    navigationState,
    setError,
    setLoading,
    setNextDeparture
  );

  useNavigationData(
    location,
    routeData,
    navigationState,
    travelMode,
    setSnappedPoint,
    setRemainingTime,
    remainingDistance,
    setRemainingDistance,
    setNextInstruction,
    setClippedPolyline,
    cancelNavigation
  );

  useShuttleData(
    location,
    shuttleData,
    navigationState,
    travelMode,
    otherBusStop,
    currentLeg,
    setCurrentLeg,
    setSnappedPoint,
    setRemainingTime,
    setRemainingDistance,
    setNextInstruction,
    setClippedPolyline,
    cancelNavigation
  );

  useEffect(() => {
    if (
      navigationState === 'navigating' &&
      is3d &&
      location &&
      clippedPolyline &&
      routeData &&
      snappedPoint &&
      currentLeg !== 'legTwo'
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
      setToDefault,
      cancelNavigation,
      shuttleData,
      error,
      loading,
      nearestBusStop,
      otherBusStop,
      nextDeparture,
      currentLeg,
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
      shuttleData,
      error,
      loading,
      nearestBusStop,
      otherBusStop,
      nextDeparture,
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
