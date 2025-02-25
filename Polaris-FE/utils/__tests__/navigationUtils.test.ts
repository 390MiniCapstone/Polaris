import {
  getDistanceBetweenPoints,
  calculatePolylineDistance,
  projectPointOnSegment,
  computeStepFraction,
  computeRemainingTime,
  computeRemainingDistance,
  determineNextInstruction,
  clipPolylineFromSnappedPoint,
  openTransitInMaps,
  startNavigation,
  determineCurrentStep,
} from '@/utils/navigationUtils';
import { Linking, Platform } from 'react-native';
import MapView from 'react-native-maps';
import {
  calculateBearing,
  getDistanceFromLatLonInMeters,
} from '@/utils/mapHandlers';

interface GeoPoint {
  latitude: number;
  longitude: number;
}

jest.mock('@/utils/mapHandlers', () => ({
  calculateBearing: jest.fn(),
  getDistanceFromLatLonInMeters: jest.fn(),
}));

describe('navigationUtils', () => {
  describe('getDistanceBetweenPoints', () => {
    it('should calculate the distance between two points correctly', () => {
      const p1 = { latitude: 0, longitude: 0 };
      const p2 = { latitude: 0, longitude: 1 };
      const distance = getDistanceBetweenPoints(p1, p2);
      expect(distance).toBeCloseTo(111195, -2);
    });
  });

  describe('calculatePolylineDistance', () => {
    it('should sum distances for a polyline', () => {
      const poly = [
        { latitude: 0, longitude: 0 },
        { latitude: 0, longitude: 1 },
        { latitude: 0, longitude: 2 },
      ];
      const total = calculatePolylineDistance(poly);
      expect(total).toBeCloseTo(222390, -2);
    });
  });

  describe('projectPointOnSegment', () => {
    it('should project a point onto a segment correctly when on the segment', () => {
      const p1 = { latitude: 0, longitude: 0 };
      const p2 = { latitude: 0, longitude: 1 };
      const p = { latitude: 0, longitude: 0.5 };
      const result = projectPointOnSegment(p, p1, p2);
      const expectedDistance = getDistanceBetweenPoints(p1, p);
      expect(result.isOnSegment).toBe(true);
      expect(result.distanceAlongSegment).toBeCloseTo(expectedDistance, 1);
    });

    it('should clamp projection when point is before the segment', () => {
      const p1 = { latitude: 0, longitude: 0 };
      const p2 = { latitude: 0, longitude: 1 };
      const p = { latitude: 0, longitude: -0.5 };
      const result = projectPointOnSegment(p, p1, p2);
      expect(result.isOnSegment).toBe(false);
      expect(result.distanceAlongSegment).toBe(0);
    });

    it('should clamp projection when point is after the segment', () => {
      const p1 = { latitude: 0, longitude: 0 };
      const p2 = { latitude: 0, longitude: 1 };
      const p = { latitude: 0, longitude: 1.5 };
      const result = projectPointOnSegment(p, p1, p2);
      const segmentDistance = getDistanceBetweenPoints(p1, p2);
      expect(result.isOnSegment).toBe(false);
      expect(result.distanceAlongSegment).toBeCloseTo(segmentDistance, 1);
    });
  });

  describe('computeStepFraction', () => {
    it('should return the correct fraction when snapped point is on the polyline', () => {
      const poly = [
        { latitude: 0, longitude: 0 },
        { latitude: 0, longitude: 1 },
      ];
      const snapped = { latitude: 0, longitude: 0.5 };
      const fraction = computeStepFraction(poly, snapped);
      expect(fraction).toBeCloseTo(0.5, 1);
    });

    it('should return undefined when snapped point is not near any segment', () => {
      const poly = [
        { latitude: 0, longitude: 0 },
        { latitude: 0, longitude: 1 },
      ];
      const snapped = { latitude: 10, longitude: 10 };
      const fraction = computeStepFraction(poly, snapped);
      expect(fraction).toBeUndefined();
    });

    it('should return 0 if the polyline total distance is 0', () => {
      const poly = [
        { latitude: 0, longitude: 0 },
        { latitude: 0, longitude: 0 },
      ];
      const snapped = { latitude: 0, longitude: 0 };
      const fraction = computeStepFraction(poly, snapped);
      expect(fraction).toBe(0);
    });
  });

  describe('computeRemainingTime', () => {
    it('should return totalDuration when no step matches the snapped point', () => {
      const step0 = {
        polyline: [
          { latitude: 0, longitude: 0 },
          { latitude: 0, longitude: 0.005 },
        ],
        duration: 60,
        distance: 556,
        instruction: 'turn left',
        startLocation: { latitude: 0, longitude: 0.005 },
        endLocation: { latitude: 0, longitude: 0.01 },
        cumulativeDistance: 1112,
      };
      const step1 = {
        polyline: [
          { latitude: 0, longitude: 0.005 },
          { latitude: 0, longitude: 0.01 },
        ],
        duration: 60,
        distance: 556,
        instruction: 'turn right',
        startLocation: { latitude: 0, longitude: 0.005 },
        endLocation: { latitude: 0, longitude: 0.01 },
        cumulativeDistance: 1112,
      };
      const steps = [step0, step1];

      const snapped = { latitude: 10, longitude: 10 };
      const remainingTime = computeRemainingTime(steps, snapped, 120);
      expect(remainingTime).toBe(120);
    });

    it('should compute remaining time correctly when snapped point is on a step', () => {
      const step0 = {
        polyline: [
          { latitude: 0, longitude: 0 },
          { latitude: 0, longitude: 0.005 },
        ],
        duration: 60,
        distance: 556,
        instruction: 'turn left',
        startLocation: { latitude: 0, longitude: 0.005 },
        endLocation: { latitude: 0, longitude: 0.01 },
        cumulativeDistance: 1112,
      };
      const step1 = {
        polyline: [
          { latitude: 0, longitude: 0.005 },
          { latitude: 0, longitude: 0.01 },
        ],
        duration: 60,
        distance: 556,
        instruction: 'turn right',
        startLocation: { latitude: 0, longitude: 0.005 },
        endLocation: { latitude: 0, longitude: 0.01 },
        cumulativeDistance: 1112,
      };
      const steps = [step0, step1];
      const snapped = { latitude: 0, longitude: 0.005 };
      const remainingTime = computeRemainingTime(steps, snapped, 120);
      expect(remainingTime).toBeCloseTo(60, 1);
    });
  });

  describe('computeRemainingDistance', () => {
    it('should return the correct remaining distance when snapped point is on a step', () => {
      const step0 = {
        polyline: [
          { latitude: 0, longitude: 0 },
          { latitude: 0, longitude: 0.005 },
        ],
        duration: 60,
        distance: 556,
        instruction: 'step1',
        startLocation: { latitude: 0, longitude: 0.005 },
        endLocation: { latitude: 0, longitude: 0.01 },
        cumulativeDistance: 1112,
      };
      const step1 = {
        polyline: [
          { latitude: 0, longitude: 0.005 },
          { latitude: 0, longitude: 0.01 },
        ],
        duration: 60,
        distance: 556,
        instruction: 'step2',
        startLocation: { latitude: 0, longitude: 0.005 },
        endLocation: { latitude: 0, longitude: 0.01 },
        cumulativeDistance: 1112,
      };
      const steps = [step0, step1];
      const snapped = { latitude: 0, longitude: 0.005 };
      const remainingDistance = computeRemainingDistance(steps, snapped, 1112);
      expect(remainingDistance).toBeCloseTo(556, 0);
    });

    it('should return 0 if computed remaining distance is negative', () => {
      const step = {
        polyline: [
          { latitude: 0, longitude: 0 },
          { latitude: 0, longitude: 0.005 },
        ],
        duration: 60,
        distance: 556,
        instruction: 'step',
        startLocation: { latitude: 0, longitude: 0.005 },
        endLocation: { latitude: 0, longitude: 0.01 },
        cumulativeDistance: 1112,
      };
      const steps = [step];
      const snapped = { latitude: 0, longitude: 0.005 };
      const remainingDistance = computeRemainingDistance(steps, snapped, 500);
      expect(remainingDistance).toBe(0);
    });
  });

  describe('determineNextInstruction', () => {
    it('should return the next step instruction when within threshold for driving', () => {
      const step0 = {
        polyline: [
          { latitude: 0, longitude: 0 },
          { latitude: 0, longitude: 0.01 },
        ],
        duration: 60,
        distance: 1112,
        instruction: 'first instruction',
        startLocation: { latitude: 0, longitude: 0.005 },
        endLocation: { latitude: 0, longitude: 0.01 },
        cumulativeDistance: 1112,
      };
      const step1 = {
        polyline: [
          { latitude: 0, longitude: 0.01 },
          { latitude: 0, longitude: 0.02 },
        ],
        duration: 60,
        distance: 1112,
        instruction: 'next instruction',
        startLocation: { latitude: 0, longitude: 0.005 },
        endLocation: { latitude: 0, longitude: 0.01 },
        cumulativeDistance: 1112,
      };
      const steps = [step0, step1];
      const snapped = { latitude: 0, longitude: 0.0095 };
      const instruction = determineNextInstruction(steps, snapped, 'DRIVE');
      expect(instruction).toBe('next instruction');
    });

    it('should return the current step instruction when conditions are not met', () => {
      const step0 = {
        polyline: [
          { latitude: 0, longitude: 0 },
          { latitude: 0, longitude: 0.01 },
        ],
        duration: 60,
        distance: 1112,
        instruction: 'first instruction',
        startLocation: { latitude: 0, longitude: 0.005 },
        endLocation: { latitude: 0, longitude: 0.01 },
        cumulativeDistance: 1112,
      };
      const steps = [step0];
      const snapped = { latitude: 0, longitude: 0.005 };
      const instruction = determineNextInstruction(steps, snapped, 'DRIVE');
      expect(instruction).toBe('first instruction');
    });
  });

  describe('clipPolylineFromSnappedPoint', () => {
    it('should clip the polyline correctly when the snapped point is on a segment', () => {
      const poly = [
        { latitude: 0, longitude: 0 },
        { latitude: 0, longitude: 1 },
        { latitude: 0, longitude: 2 },
      ];
      const snapped = { latitude: 0, longitude: 0.5 };
      const clipped = clipPolylineFromSnappedPoint(poly, snapped);
      expect(clipped[0]).toEqual(snapped);
      expect(clipped.length).toBe(3);
      expect(clipped[1]).toEqual(poly[1]);
    });

    it('should return the original polyline if the snapped point is not on any segment', () => {
      const poly = [
        { latitude: 0, longitude: 0 },
        { latitude: 0, longitude: 1 },
      ];
      const snapped = { latitude: 10, longitude: 10 };
      const clipped = clipPolylineFromSnappedPoint(poly, snapped);
      expect(clipped).toEqual(poly);
    });
  });

  describe('openTransitInMaps', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should open Apple Maps on iOS', async () => {
      Platform.OS = 'ios';
      const origin = { latitude: 1, longitude: 2 };
      const destination = { latitude: 3, longitude: 4 };
      const canOpenURLSpy = jest
        .spyOn(Linking, 'canOpenURL')
        .mockResolvedValue(true);
      const openURLSpy = jest
        .spyOn(Linking, 'openURL')
        .mockResolvedValue(undefined);
      openTransitInMaps(origin, destination);
      await Promise.resolve();

      const expectedUrl = `http://maps.apple.com/?saddr=${encodeURIComponent(
        '1,2'
      )}&daddr=${encodeURIComponent('3,4')}&dirflg=r`;
      expect(canOpenURLSpy).toHaveBeenCalledWith(expectedUrl);
      expect(openURLSpy).toHaveBeenCalledWith(expectedUrl);
    });

    it('should open Google Maps on Android', async () => {
      Platform.OS = 'android';
      const origin = { latitude: 1, longitude: 2 };
      const destination = { latitude: 3, longitude: 4 };
      const canOpenURLSpy = jest
        .spyOn(Linking, 'canOpenURL')
        .mockResolvedValue(true);
      const openURLSpy = jest
        .spyOn(Linking, 'openURL')
        .mockResolvedValue(undefined);
      openTransitInMaps(origin, destination);
      await Promise.resolve();

      const expectedUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
        '1,2'
      )}&destination=${encodeURIComponent('3,4')}&travelmode=transit`;
      expect(canOpenURLSpy).toHaveBeenCalledWith(expectedUrl);
      expect(openURLSpy).toHaveBeenCalledWith(expectedUrl);
    });
  });

  describe('startNavigation', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      (getDistanceFromLatLonInMeters as jest.Mock).mockImplementation(
        (lat1: number, lng1: number, lat2: number, lng2: number) => {
          const dx = lat2 - lat1;
          const dy = lng2 - lng1;
          return Math.sqrt(dx * dx + dy * dy) * 111000;
        }
      );
      (calculateBearing as jest.Mock).mockReturnValue(45);
    });

    it('should animate the camera with correct parameters', () => {
      const location = { latitude: 0, longitude: 0 };
      const currentStep = {
        startLocation: { latitude: 0, longitude: 0 },
        endLocation: { latitude: 0, longitude: 0.002 },
        distance: 200,
        duration: 60,
        instruction: 'instruction',
        polyline: [
          { latitude: 0, longitude: 0 },
          { latitude: 0, longitude: 0.001 },
          { latitude: 0, longitude: 0.002 },
        ],
        cumulativeDistance: 200,
      };
      const animateCameraMock = jest.fn();
      const mapRef = { current: { animateCamera: animateCameraMock } };

      startNavigation(
        location,
        currentStep.polyline,
        currentStep,
        mapRef as unknown as React.MutableRefObject<MapView | null>
      );

      const expectedCenter = {
        latitude: 0,
        longitude: 0.001 + (0.002 - 0.001) * ((180 - 111) / 111),
      };

      expect(animateCameraMock).toHaveBeenCalled();
      const callArgs = animateCameraMock.mock.calls[0][0];
      expect(callArgs.center.latitude).toBeCloseTo(expectedCenter.latitude, 3);
      expect(callArgs.center.longitude).toBeCloseTo(
        expectedCenter.longitude,
        3
      );
      expect(callArgs.heading).toBe(45);
      expect(callArgs.pitch).toBe(60);
      expect(callArgs.altitude).toBe(400);
    });

    it('should not animate the camera if location is missing or step polyline is empty', () => {
      const animateCameraMock = jest.fn();
      const mapRef = { current: { animateCamera: animateCameraMock } };
      startNavigation(
        null as unknown as GeoPoint,
        [] as any,
        { polyline: [] } as any,
        mapRef as unknown as React.MutableRefObject<MapView | null>
      );
      expect(animateCameraMock).not.toHaveBeenCalled();
    });
  });

  describe('determineCurrentStep', () => {
    it('should return the first step with a valid fraction', () => {
      const step1 = {
        polyline: [
          { latitude: 0, longitude: 0 },
          { latitude: 0, longitude: 0.01 },
        ],
        duration: 60,
        distance: 100,
        instruction: 'step1',
        startLocation: { latitude: 0, longitude: 0 },
        endLocation: { latitude: 0, longitude: 0.01 },
        cumulativeDistance: 100,
      };
      const step2 = {
        polyline: [
          { latitude: 0, longitude: 0.01 },
          { latitude: 0, longitude: 0.02 },
        ],
        duration: 60,
        distance: 100,
        instruction: 'step2',
        startLocation: { latitude: 0, longitude: 0.01 },
        endLocation: { latitude: 0, longitude: 0.02 },
        cumulativeDistance: 200,
      };
      const steps = [step1, step2];
      const snapped = { latitude: 0, longitude: 0.005 };
      const currentStep = determineCurrentStep(steps, snapped);
      expect(currentStep).toEqual(step1);
    });

    it('should return the next step if the snapped point is near the end of the current step', () => {
      const step1 = {
        polyline: [
          { latitude: 0, longitude: 0 },
          { latitude: 0, longitude: 0.01 },
        ],
        duration: 60,
        distance: 100,
        instruction: 'step1',
        startLocation: { latitude: 0, longitude: 0 },
        endLocation: { latitude: 0, longitude: 0.01 },
        cumulativeDistance: 100,
      };
      const step2 = {
        polyline: [
          { latitude: 0, longitude: 0.01 },
          { latitude: 0, longitude: 0.02 },
        ],
        duration: 60,
        distance: 100,
        instruction: 'step2',
        startLocation: { latitude: 0, longitude: 0.01 },
        endLocation: { latitude: 0, longitude: 0.02 },
        cumulativeDistance: 200,
      };
      const steps = [step1, step2];
      const snapped = { latitude: 0, longitude: 0.0098 };
      const currentStep = determineCurrentStep(steps, snapped);
      expect(currentStep).toEqual(step2);
    });

    it('should return undefined if no step contains the snapped point', () => {
      const step = {
        polyline: [
          { latitude: 0, longitude: 0 },
          { latitude: 0, longitude: 0.01 },
        ],
        duration: 60,
        distance: 100,
        instruction: 'step',
        startLocation: { latitude: 0, longitude: 0 },
        endLocation: { latitude: 0, longitude: 0.01 },
        cumulativeDistance: 100,
      };
      const steps = [step];
      const snapped = { latitude: 10, longitude: 10 };
      const currentStep = determineCurrentStep(steps, snapped);
      expect(currentStep).toBeUndefined();
    });
  });
});
