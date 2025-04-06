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

    const handleLegOne = () => {
      if (!shuttleData.legOne) return;

      const turfLine = lineString(
        shuttleData.legOne.polyline.map(coord => [
          coord.longitude,
          coord.latitude,
        ])
      );
      const userPoint = point([location.longitude, location.latitude]);
      const snapped = nearestPointOnLine(turfLine, userPoint);

      if (!snapped?.geometry?.coordinates) return;

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
      setNextInstruction(
        determineNextInstruction(shuttleData.legOne.steps, snappedLoc, 'WALK')
      );
      setClippedPolyline(
        clipPolylineFromSnappedPoint(shuttleData.legOne.polyline, snappedLoc)
      );

      if (newRemainingDistance <= 10) {
        setCurrentLeg('legTwo');
      }
    };

    const handleLegTwo = () => {
      if (!otherBusStop) return;

      const distanceToOtherStop = getDistanceBetweenPoints(
        location,
        otherBusStop.location
      );
      setNextInstruction(
        `Take the Concordia shuttle bus to ${otherBusStop.name}`
      );

      if (distanceToOtherStop <= 20) {
        setCurrentLeg('legThree');
      }
    };

    const handleLegThree = () => {
      if (!shuttleData.legThree) return;

      const turfLine = lineString(
        shuttleData.legThree.polyline.map(coord => [
          coord.longitude,
          coord.latitude,
        ])
      );
      const userPoint = point([location.longitude, location.latitude]);
      const snapped = nearestPointOnLine(turfLine, userPoint);

      if (!snapped?.geometry?.coordinates) return;

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
      setNextInstruction(
        determineNextInstruction(shuttleData.legThree.steps, snappedLoc, 'WALK')
      );
      setClippedPolyline(
        clipPolylineFromSnappedPoint(shuttleData.legThree.polyline, snappedLoc)
      );

      if (newRemainingDistance <= 10) {
        cancelNavigation();
      }
    };

    // Choose what to handle based on currentLeg
    if (currentLeg === 'legOne') {
      handleLegOne();
    } else if (currentLeg === 'legTwo') {
      handleLegTwo();
    } else if (currentLeg === 'legThree') {
      handleLegThree();
    }
  }, [location, shuttleData, navigationState, currentLeg, travelMode]);
};
