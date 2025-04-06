jest.mock('@/utils/navigationUtils', () => {
  const actualUtils = jest.requireActual('@/utils/navigationUtils');
  return {
    ...actualUtils,
    openTransitInMaps: jest.fn(),
  };
});

import {
  ShuttleBusStops,
  getNextDeparture,
  ETA,
  getDistanceBetweenPoints,
  calculatePolylineDistance,
  projectPointOnSegment,
  computeStepFraction,
  computeRemainingTime,
  computeRemainingDistance,
  determineNextInstruction,
  clipPolylineFromSnappedPoint,
  getNearestBusStop,
  getOtherBusStop,
  openTransitInMaps,
  animateNavCamera,
  determineCurrentStep,
  handleGoButton,
} from '@/utils/navigationUtils';

import { Linking, Platform } from 'react-native';
import { toast } from 'sonner-native';

jest.mock('@/utils/mapHandlers', () => ({
  calculateBearing: jest.fn(),
  getDistanceFromLatLonInMeters: jest.fn(),
}));

jest.mock('sonner-native', () => ({
  toast: {
    error: jest.fn(),
  },
}));

describe('navigationUtils', () => {
  describe('ShuttleBusStops', () => {
    it('should have LOY and SGW stops defined', () => {
      expect(ShuttleBusStops.LOY).toBeDefined();
      expect(ShuttleBusStops.SGW).toBeDefined();
    });
  });

  describe('getNextDeparture', () => {
    it('returns next available departure time', () => {
      jest.useFakeTimers().setSystemTime(new Date('2024-04-05T09:00:00'));
      const stop = ShuttleBusStops.LOY;
      const nextDeparture = getNextDeparture(stop, 0);
      expect(nextDeparture).toBeTruthy();
    });

    it('returns null if wrong day', () => {
      jest.useFakeTimers().setSystemTime(new Date('2024-04-07T09:00:00'));
      const stop = ShuttleBusStops.LOY;
      const nextDeparture = getNextDeparture(stop, 0);
      expect(nextDeparture).toBeNull();
    });

    it('returns null if no schedule', () => {
      const fakeStop = {
        ...ShuttleBusStops.LOY,
        schedule: { MonThu: [], Fri: [] },
      };
      jest.useFakeTimers().setSystemTime(new Date('2024-04-05T09:00:00'));
      const nextDeparture = getNextDeparture(fakeStop, 0);
      expect(nextDeparture).toBeNull();
    });

    it('returns null if no future departure', () => {
      const fakeStop = {
        ...ShuttleBusStops.LOY,
        schedule: { MonThu: ['08:00'], Fri: ['08:00'] },
      };
      jest.useFakeTimers().setSystemTime(new Date('2024-04-05T12:00:00'));
      const nextDeparture = getNextDeparture(fakeStop, 0);
      expect(nextDeparture).toBeNull();
    });
  });

  describe('ETA', () => {
    it('formats ETA correctly', () => {
      const eta = ETA(600);
      expect(typeof eta).toBe('string');
    });
  });

  describe('getDistanceBetweenPoints', () => {
    it('calculates correct distance', () => {
      const p1 = { latitude: 0, longitude: 0 };
      const p2 = { latitude: 0, longitude: 1 };
      const distance = getDistanceBetweenPoints(p1, p2);
      expect(distance).toBeGreaterThan(0);
    });
  });

  describe('calculatePolylineDistance', () => {
    it('calculates total distance', () => {
      const poly = [
        { latitude: 0, longitude: 0 },
        { latitude: 0, longitude: 1 },
      ];
      const dist = calculatePolylineDistance(poly);
      expect(dist).toBeGreaterThan(0);
    });
  });

  describe('projectPointOnSegment', () => {
    it('projects correctly onto a segment', () => {
      const p1 = { latitude: 0, longitude: 0 };
      const p2 = { latitude: 0, longitude: 1 };
      const p = { latitude: 0, longitude: 0.5 };
      const proj = projectPointOnSegment(p, p1, p2);
      expect(proj.isOnSegment).toBe(true);
    });
  });

  describe('computeStepFraction', () => {
    it('computes fraction', () => {
      const poly = [
        { latitude: 0, longitude: 0 },
        { latitude: 0, longitude: 1 },
      ];
      const snapped = { latitude: 0, longitude: 0.5 };
      const fraction = computeStepFraction(poly, snapped);
      expect(fraction).toBeCloseTo(0.5, 1);
    });

    it('returns undefined if far from polyline', () => {
      const poly = [
        { latitude: 0, longitude: 0 },
        { latitude: 0, longitude: 1 },
      ];
      const snapped = { latitude: 10, longitude: 10 };
      expect(computeStepFraction(poly, snapped)).toBeUndefined();
    });

    it('returns 0 if polyline length 0', () => {
      const poly = [
        { latitude: 0, longitude: 0 },
        { latitude: 0, longitude: 0 },
      ];
      const snapped = { latitude: 0, longitude: 0 };
      expect(computeStepFraction(poly, snapped)).toBe(0);
    });
  });

  describe('computeRemainingTime', () => {
    it('returns full if no match', () => {
      const steps = [
        {
          polyline: [
            { latitude: 0, longitude: 0 },
            { latitude: 0, longitude: 0.01 },
          ],
          duration: 100,
          distance: 100,
          instruction: '',
          startLocation: { latitude: 0, longitude: 0 },
          endLocation: { latitude: 0, longitude: 0.01 },
          cumulativeDistance: 100,
        },
      ];
      const snapped = { latitude: 10, longitude: 10 };
      expect(computeRemainingTime(steps, snapped, 100)).toBe(100);
    });

    it('returns 0 if remaining < 0', () => {
      const steps = [
        {
          polyline: [
            { latitude: 0, longitude: 0 },
            { latitude: 0, longitude: 0.01 },
          ],
          duration: 1,
          distance: 1,
          instruction: '',
          startLocation: { latitude: 0, longitude: 0 },
          endLocation: { latitude: 0, longitude: 0.01 },
          cumulativeDistance: 1,
        },
      ];
      const snapped = { latitude: 0, longitude: 0.02 };
      expect(computeRemainingTime(steps, snapped, 1)).toBeGreaterThanOrEqual(0);
    });
  });

  describe('computeRemainingDistance', () => {
    it('returns distance', () => {
      const steps = [
        {
          polyline: [
            { latitude: 0, longitude: 0 },
            { latitude: 0, longitude: 0.01 },
          ],
          duration: 100,
          distance: 100,
          instruction: '',
          startLocation: { latitude: 0, longitude: 0 },
          endLocation: { latitude: 0, longitude: 0.01 },
          cumulativeDistance: 100,
        },
      ];
      const snapped = { latitude: 10, longitude: 10 };
      expect(computeRemainingDistance(steps, snapped, 100)).toBeLessThanOrEqual(
        100
      );
    });
  });

  describe('determineCurrentStep', () => {
    it('returns next step if over 95%', () => {
      const steps = [
        {
          polyline: [
            { latitude: 0, longitude: 0 },
            { latitude: 0, longitude: 0.01 },
          ],
          duration: 100,
          distance: 100,
          instruction: '',
          startLocation: { latitude: 0, longitude: 0 },
          endLocation: { latitude: 0, longitude: 0.01 },
          cumulativeDistance: 100,
        },
        {
          polyline: [
            { latitude: 0, longitude: 0.01 },
            { latitude: 0, longitude: 0.02 },
          ],
          duration: 100,
          distance: 100,
          instruction: 'turn',
          startLocation: { latitude: 0, longitude: 0.01 },
          endLocation: { latitude: 0, longitude: 0.02 },
          cumulativeDistance: 200,
        },
      ];
      const snapped = { latitude: 0, longitude: 0.0099 };
      expect(determineCurrentStep(steps, snapped)?.instruction).toBe('turn');
    });
  });

  describe('determineNextInstruction', () => {
    it('returns WALK or BICYCLE correctly', () => {
      const steps = [
        {
          polyline: [
            { latitude: 0, longitude: 0 },
            { latitude: 0, longitude: 0.001 },
          ],
          duration: 100,
          distance: 10,
          instruction: 'cross',
          startLocation: { latitude: 0, longitude: 0 },
          endLocation: { latitude: 0, longitude: 0.001 },
          cumulativeDistance: 10,
        },
      ];
      const snapped = { latitude: 0, longitude: 0.00095 };
      expect(determineNextInstruction(steps, snapped, 'WALK')).toBe('cross');
      expect(determineNextInstruction(steps, snapped, 'BICYCLE')).toBe('cross');
    });
  });

  describe('clipPolylineFromSnappedPoint', () => {
    it('returns clipped', () => {
      const poly = [
        { latitude: 0, longitude: 0 },
        { latitude: 0, longitude: 1 },
      ];
      const snapped = { latitude: 0, longitude: 0.5 };
      expect(clipPolylineFromSnappedPoint(poly, snapped)[0]).toEqual(snapped);
    });
    it('returns original if no match', () => {
      const poly = [
        { latitude: 0, longitude: 0 },
        { latitude: 0, longitude: 1 },
      ];
      const snapped = { latitude: 10, longitude: 10 };
      expect(clipPolylineFromSnappedPoint(poly, snapped)).toEqual(poly);
    });
  });

  describe('getNearestBusStop and getOtherBusStop', () => {
    it('returns correct stops', () => {
      const loc = { latitude: 45.46, longitude: -73.64 };
      expect(getNearestBusStop(loc).shortName).toBe('LOY');
      expect(getOtherBusStop(loc).shortName).toBe('SGW');
    });
  });

  describe('openTransitInMaps', () => {
    it('warns if cannot open URL', async () => {
      jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(false);
      Platform.OS = 'ios';
      await openTransitInMaps(
        { latitude: 1, longitude: 2 },
        { latitude: 3, longitude: 4 }
      );
    });
  });

  describe('animateNavCamera', () => {
    it('animates camera', () => {
      const animateCamera = jest.fn();
      const mapRef = { current: { animateCamera } };
      animateNavCamera(
        { latitude: 0, longitude: 0 },
        [
          { latitude: 0, longitude: 0 },
          { latitude: 0, longitude: 0.01 },
        ],
        {
          startLocation: { latitude: 0, longitude: 0 },
          endLocation: { latitude: 0, longitude: 0.01 },
          distance: 10,
          duration: 10,
          instruction: '',
          cumulativeDistance: 10,
          polyline: [],
        },
        mapRef as any
      );
      expect(animateCamera).toHaveBeenCalled();
    });
  });

  describe('handleGoButton', () => {
    it('calls openTransitInMaps for transit', () => {
      handleGoButton({
        navigationState: 'planning',
        is3d: false,
        location: { latitude: 1, longitude: 2 },
        travelMode: 'TRANSIT',
        destination: { latitude: 3, longitude: 4 },
        setIs3d: jest.fn(),
        handleStartNavigation: jest.fn(),
        mapRef: { current: null },
        error: null,
        nextDeparture: '10:00am',
      });
      expect(openTransitInMaps).toHaveBeenCalled();
    });

    it('handles no shuttle available case', () => {
      handleGoButton({
        navigationState: 'planning',
        is3d: false,
        location: { latitude: 1, longitude: 2 },
        travelMode: 'SHUTTLE',
        destination: null,
        setIs3d: jest.fn(),
        handleStartNavigation: jest.fn(),
        mapRef: { current: null },
        error: null,
        nextDeparture: null,
      });
      expect(toast.error).toHaveBeenCalled();
    });
  });
});
