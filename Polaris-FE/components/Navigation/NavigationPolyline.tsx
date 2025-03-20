import React from 'react';
import { Marker, Polyline } from 'react-native-maps';
import { useNavigation } from '@/contexts/NavigationContext/NavigationContext';

export const NavigationPolyline: React.FC = () => {
  const {
    travelMode,
    destination,
    snappedPoint,
    clippedPolyline,
    navigationState,
  } = useNavigation();
  return (
    <React.Fragment>
      {(navigationState === 'planning' || navigationState === 'navigating') &&
        clippedPolyline &&
        snappedPoint && (
          <>
            <Marker coordinate={destination} pinColor="#9C2F40" />
            {travelMode === 'WALK' ? (
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
    </React.Fragment>
  );
};
