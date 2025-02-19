import React from 'react';
import { LatLng, Marker, Polyline } from 'react-native-maps';

interface NavigationPolylineProps {
  navigationState: string;
  destination: { latitude: number; longitude: number };
  transportMode: string;
  clippedPolyline: LatLng[] | null;
  snappedPoint: LatLng | null;
}

export const NavigationPolyline: React.FC<NavigationPolylineProps> = ({
  navigationState,
  destination,
  transportMode,
  clippedPolyline,
  snappedPoint,
}) => {
  return (
    <>
      {(navigationState === 'planning' || navigationState === 'navigating') &&
        clippedPolyline &&
        snappedPoint && (
          <>
            <Marker coordinate={destination} pinColor="#9C2F40" />
            {transportMode === 'WALK' ? (
              <Polyline
                coordinates={clippedPolyline}
                strokeWidth={4}
                strokeColor="#9A2D3F"
                lineDashPattern={[5, 10]}
              />
            ) : (
              <>
                <Polyline
                  coordinates={clippedPolyline}
                  strokeWidth={9}
                  strokeColor="#BE505B"
                />
                <Polyline
                  coordinates={clippedPolyline}
                  strokeWidth={6}
                  strokeColor="#9A2D3F"
                />
              </>
            )}
          </>
        )}
    </>
  );
};
