import { useEffect } from 'react';
import { LatLng } from 'react-native-maps';
import { lineString, point } from '@turf/helpers';
import nearestPointOnLine from '@turf/nearest-point-on-line';
import {
  computeRemainingTime,
  computeRemainingDistance,
  determineNextInstruction,
  clipPolylineFromSnappedPoint,
} from '@/utils/navigationUtils';
import { NavigationState, RouteData, TravelMode } from '@/constants/types';

export const useNavigationData = (
  location: LatLng | null,
  routeData: RouteData | null,
  navigationState: NavigationState,
  travelMode: TravelMode,
  setSnappedPoint: (snappedPoint: LatLng | null) => void,
  setRemainingTime: (remainingTime: number | null) => void,
  remainingDistance: number | null,
  setRemainingDistance: (remainingDistance: number | null) => void,
  setNextInstruction: (nextInstruction: string | null) => void,
  setClippedPolyline: (clippedPolyline: LatLng[] | null) => void,
  cancelNavigation: () => void
) => {
  useEffect(() => {
    if (location && routeData && travelMode !== 'SHUTTLE') {
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
    if (!remainingDistance || travelMode == 'SHUTTLE') return;
    const arrivalThreshold = 10;
    if (
      navigationState === 'navigating' &&
      remainingDistance <= arrivalThreshold
    ) {
      cancelNavigation();
    }
  }, [remainingDistance, navigationState]);
};
