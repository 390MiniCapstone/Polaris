import { useEffect } from 'react';
import { LatLng } from 'react-native-maps';
import { lineString, point } from '@turf/helpers';
import nearestPointOnLine from '@turf/nearest-point-on-line';
import {
  computeRemainingTime,
  computeRemainingDistance,
  determineNextInstruction,
  clipPolylineFromSnappedPoint,
  getDistanceBetweenPoints,
} from '@/utils/navigationUtils';
import {
  NavigationState,
  ShuttleData,
  ShuttleLeg,
  ShuttleBusStop,
  TravelMode,
} from '@/constants/types';

export const useShuttleData = (
  location: LatLng | null,
  shuttleData: ShuttleData | null,
  navigationState: NavigationState,
  travelMode: TravelMode,
  otherBusStop: ShuttleBusStop | null,
  currentLeg: ShuttleLeg,
  setCurrentLeg: (leg: ShuttleLeg) => void,
  setSnappedPoint: (snappedPoint: LatLng | null) => void,
  setRemainingTime: (remainingTime: number | null) => void,
  setRemainingDistance: (remainingDistance: number | null) => void,
  setNextInstruction: (nextInstruction: string | null) => void,
  setClippedPolyline: (clippedPolyline: LatLng[] | null) => void,
  cancelNavigation: () => void
) => {
  useEffect(() => {
    if (!location || !shuttleData || navigationState !== 'navigating') return;

    if (currentLeg === 'legOne' && shuttleData.legOne) {
      const turfLine = lineString(
        shuttleData.legOne.polyline.map(coord => [
          coord.longitude,
          coord.latitude,
        ])
      );
      const userPoint = point([location.longitude, location.latitude]);
      const snapped = nearestPointOnLine(turfLine, userPoint);

      if (snapped?.geometry?.coordinates) {
        const [lng, lat] = snapped.geometry.coordinates;
        const snappedLoc: LatLng = { latitude: lat, longitude: lng };
        setSnappedPoint(snappedLoc);

        const newRemainingTime = computeRemainingTime(
          shuttleData.legOne.steps,
          snappedLoc,
          shuttleData.legOne.totalDuration
        );
        const newRemainingDistance = computeRemainingDistance(
          shuttleData.legOne.steps,
          snappedLoc,
          shuttleData.legOne.totalDistance
        );
        setRemainingTime(newRemainingTime);
        setRemainingDistance(newRemainingDistance);

        const instruction = determineNextInstruction(
          shuttleData.legOne.steps,
          snappedLoc,
          'WALK'
        );
        setNextInstruction(instruction);

        const clipped = clipPolylineFromSnappedPoint(
          shuttleData.legOne.polyline,
          snappedLoc
        );
        setClippedPolyline(clipped);

        const arrivalThreshold = 10;
        if (newRemainingDistance <= arrivalThreshold) {
          setCurrentLeg('legTwo');
        }
      }
    } else if (currentLeg === 'legTwo' && otherBusStop) {
      const distanceToOtherStop = getDistanceBetweenPoints(
        location,
        otherBusStop.location
      );

      setNextInstruction(
        `Take the Concordia shuttle bus to ${otherBusStop.name}`
      );

      const arrivalThreshold = 20;
      if (distanceToOtherStop <= arrivalThreshold) {
        setCurrentLeg('legThree');
      }
    } else if (currentLeg === 'legThree' && shuttleData.legThree) {
      const turfLine = lineString(
        shuttleData.legThree.polyline.map(coord => [
          coord.longitude,
          coord.latitude,
        ])
      );
      const userPoint = point([location.longitude, location.latitude]);
      const snapped = nearestPointOnLine(turfLine, userPoint);

      if (snapped?.geometry?.coordinates) {
        const [lng, lat] = snapped.geometry.coordinates;
        const snappedLoc: LatLng = { latitude: lat, longitude: lng };
        setSnappedPoint(snappedLoc);

        const newRemainingTime = computeRemainingTime(
          shuttleData.legThree.steps,
          snappedLoc,
          shuttleData.legThree.totalDuration
        );
        const newRemainingDistance = computeRemainingDistance(
          shuttleData.legThree.steps,
          snappedLoc,
          shuttleData.legThree.totalDistance
        );
        setRemainingTime(newRemainingTime);
        setRemainingDistance(newRemainingDistance);

        const instruction = determineNextInstruction(
          shuttleData.legThree.steps,
          snappedLoc,
          'WALK'
        );
        setNextInstruction(instruction);

        const clipped = clipPolylineFromSnappedPoint(
          shuttleData.legThree.polyline,
          snappedLoc
        );
        setClippedPolyline(clipped);

        const arrivalThreshold = 10;
        if (newRemainingDistance <= arrivalThreshold) {
          cancelNavigation();
        }
      }
    }
  }, [location, shuttleData, navigationState, currentLeg, travelMode]);
};
