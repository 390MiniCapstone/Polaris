import { Step } from '@/services/googleMapsRoutes';
import MapView, { LatLng } from 'react-native-maps';
import { Linking, Platform } from 'react-native';
import { MutableRefObject } from 'react';
import {
  calculateBearing,
  getDistanceFromLatLonInMeters,
} from '@/utils/mapHandlers';

export const getDistanceBetweenPoints = (p1: LatLng, p2: LatLng): number => {
  const R = 6371000;
  const dLat = ((p2.latitude - p1.latitude) * Math.PI) / 180;
  const dLng = ((p2.longitude - p1.longitude) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((p1.latitude * Math.PI) / 180) *
      Math.cos((p2.latitude * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const calculatePolylineDistance = (poly: LatLng[]): number => {
  let total = 0;
  for (let i = 1; i < poly.length; i++) {
    total += getDistanceBetweenPoints(poly[i - 1], poly[i]);
  }
  return total;
};

export const projectPointOnSegment = (
  p: LatLng,
  p1: LatLng,
  p2: LatLng
): { distanceAlongSegment: number; isOnSegment: boolean } => {
  const A = p.longitude - p1.longitude;
  const B = p.latitude - p1.latitude;
  const C = p2.longitude - p1.longitude;
  const D = p2.latitude - p1.latitude;
  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  let param = lenSq !== 0 ? dot / lenSq : 0;
  let isOnSegment = true;
  if (param < 0) {
    param = 0;
    isOnSegment = false;
  } else if (param > 1) {
    param = 1;
    isOnSegment = false;
  }
  const segmentDistance = getDistanceBetweenPoints(p1, p2);
  return { distanceAlongSegment: segmentDistance * param, isOnSegment };
};

export const computeStepFraction = (
  poly: LatLng[],
  snapped: LatLng
): number | undefined => {
  const total = calculatePolylineDistance(poly);
  if (total === 0) return 0;
  let traveled = 0;
  for (let i = 1; i < poly.length; i++) {
    const segmentStart = poly[i - 1];
    const segmentEnd = poly[i];
    const proj = projectPointOnSegment(snapped, segmentStart, segmentEnd);
    const approxPoint = {
      latitude:
        segmentStart.latitude +
        (segmentEnd.latitude - segmentStart.latitude) *
          (proj.distanceAlongSegment /
            getDistanceBetweenPoints(segmentStart, segmentEnd)),
      longitude:
        segmentStart.longitude +
        (segmentEnd.longitude - segmentStart.longitude) *
          (proj.distanceAlongSegment /
            getDistanceBetweenPoints(segmentStart, segmentEnd)),
    };
    const distanceToSegment = getDistanceBetweenPoints(snapped, approxPoint);
    if (distanceToSegment < 15) {
      traveled += proj.distanceAlongSegment;
      return traveled / total;
    }
    traveled += getDistanceBetweenPoints(segmentStart, segmentEnd);
  }
  return undefined;
};

export const computeRemainingTime = (
  steps: Step[],
  snapped: LatLng,
  totalDuration: number
): number => {
  let currentStepIndex = -1;
  let currentStepFraction = 0;

  const totalStepsDuration = steps.reduce(
    (sum, step) => sum + step.duration,
    0
  );
  const normalizationFactor = totalDuration / totalStepsDuration;

  for (let i = 0; i < steps.length; i++) {
    const fraction = computeStepFraction(steps[i].polyline, snapped);
    if (fraction !== undefined) {
      currentStepIndex = i;
      currentStepFraction = fraction;
      break;
    }
  }

  if (currentStepIndex === -1) {
    return totalDuration;
  }

  const completedStepsTime = steps
    .slice(0, currentStepIndex)
    .reduce((sum, step) => sum + step.duration * normalizationFactor, 0);
  const currentStep = steps[currentStepIndex];
  const currentStepTimeUsed =
    currentStep.duration * currentStepFraction * normalizationFactor;

  const remainingTime =
    totalDuration - (completedStepsTime + currentStepTimeUsed);

  return Math.max(remainingTime, 0);
};

export const computeRemainingDistance = (
  steps: Step[],
  snapped: LatLng,
  totalDistance: number
): number => {
  let distanceUsed = 0;
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    const fraction = computeStepFraction(step.polyline, snapped);
    if (fraction !== undefined) {
      distanceUsed += step.distance * fraction;
      break;
    } else {
      distanceUsed += step.distance;
    }
  }
  const remainingDistance = totalDistance - distanceUsed;
  return remainingDistance > 0 ? remainingDistance : 0;
};

export const determineNextInstruction = (
  steps: Step[],
  snapped: LatLng,
  transportMode: string
): string => {
  let currentStepIndex = -1;
  let currentFraction: number | undefined;
  for (let i = 0; i < steps.length; i++) {
    const fraction = computeStepFraction(steps[i].polyline, snapped);
    if (fraction !== undefined) {
      currentStepIndex = i;
      currentFraction = fraction;
      break;
    }
  }
  if (currentStepIndex === -1 || currentFraction === undefined) return '';

  const currentStep = steps[currentStepIndex];
  const remainingDistanceInStep = currentStep.distance * (1 - currentFraction);

  let baseThreshold = 1000; // default for driving
  if (transportMode === 'WALK') {
    baseThreshold = 200;
  } else if (transportMode === 'BICYCLE') {
    baseThreshold = 300;
  }
  const effectiveThreshold =
    currentStep.distance < baseThreshold ? currentStep.distance : baseThreshold;

  if (
    currentStep.distance >= effectiveThreshold &&
    remainingDistanceInStep <= effectiveThreshold
  ) {
    if (currentStepIndex < steps.length - 1) {
      return steps[currentStepIndex + 1].instruction;
    }
  }
  return currentStep.instruction;
};

export const clipPolylineFromSnappedPoint = (
  poly: LatLng[],
  snapped: LatLng
): LatLng[] => {
  let newPoly: LatLng[] = [];
  let found = false;
  for (let i = 1; i < poly.length; i++) {
    const proj = projectPointOnSegment(snapped, poly[i - 1], poly[i]);
    if (proj.isOnSegment) {
      newPoly.push(snapped);
      newPoly.push(...poly.slice(i));
      found = true;
      break;
    }
  }
  return found ? newPoly : poly;
};

export const openTransitInMaps = (
  origin: {
    latitude: number;
    longitude: number;
  },
  destination: {
    latitude: number;
    longitude: number;
  }
): void => {
  const originStr = `${origin.latitude},${origin.longitude}`;
  const destinationStr = `${destination.latitude},${destination.longitude}`;

  let url = '';

  if (Platform.OS === 'ios') {
    url = `http://maps.apple.com/?saddr=${encodeURIComponent(
      originStr
    )}&daddr=${encodeURIComponent(destinationStr)}&dirflg=r`;
  } else {
    url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
      originStr
    )}&destination=${encodeURIComponent(destinationStr)}&travelmode=transit`;
  }

  Linking.canOpenURL(url)
    .then(supported => {
      if (supported) {
        return Linking.openURL(url);
      } else {
        console.warn("Can't handle url: " + url);
      }
    })
    .catch(err => console.error('An error occurred', err));
};

export const startNavigation = (
  location: LatLng,
  clippedPolyline: LatLng[],
  mapRef: MutableRefObject<MapView | null>
): void => {
  if (!location || !clippedPolyline.length) return;

  const currentPosition: LatLng = {
    latitude: location.latitude,
    longitude: location.longitude,
  };

  const lookAheadDistance = 180; // meters
  let cumulativeDistance = 0;
  let centerPoint: LatLng = currentPosition;

  for (let i = 1; i < clippedPolyline.length; i++) {
    const prevPoint = clippedPolyline[i - 1];
    const currentPoint = clippedPolyline[i];
    const segmentDistance = getDistanceFromLatLonInMeters(
      prevPoint.latitude,
      prevPoint.longitude,
      currentPoint.latitude,
      currentPoint.longitude
    );

    if (cumulativeDistance + segmentDistance > lookAheadDistance) {
      const remainingDistance = lookAheadDistance - cumulativeDistance;
      const ratio = remainingDistance / segmentDistance;
      centerPoint = {
        latitude:
          prevPoint.latitude +
          (currentPoint.latitude - prevPoint.latitude) * ratio,
        longitude:
          prevPoint.longitude +
          (currentPoint.longitude - prevPoint.longitude) * ratio,
      };
      break;
    }

    cumulativeDistance += segmentDistance;
    centerPoint = currentPoint;
  }

  const bearing = calculateBearing(
    currentPosition.latitude,
    currentPosition.longitude,
    centerPoint.latitude,
    centerPoint.longitude
  );

  mapRef.current?.animateCamera(
    {
      heading: bearing,
      pitch: 60,
      altitude: 400,
      center: centerPoint,
    },
    { duration: 1000 }
  );
};
