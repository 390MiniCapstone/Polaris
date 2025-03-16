import React from 'react';
import { LatLng, Marker, Polyline } from 'react-native-maps';
import useTheme from '@/hooks/useTheme';

interface NavigationPolylineProps {
  navigationState: string;
  destination: { latitude: number; longitude: number };
  travelMode: string;
  clippedPolyline: LatLng[] | null;
  snappedPoint: LatLng | null;
}

export const NavigationPolyline: React.FC<NavigationPolylineProps> = ({
  navigationState,
  destination,
  travelMode,
  clippedPolyline,
  snappedPoint,
}) => {
  const { theme } = useTheme();
  return (
    <>
      {(navigationState === 'planning' || navigationState === 'navigating') &&
        clippedPolyline &&
        snappedPoint && (
          <>
            <Marker
              key={theme.colors.primary}
              coordinate={destination}
              pinColor={theme.colors.primary}
            />
            {travelMode === 'WALK' ? (
              <Polyline
                coordinates={clippedPolyline}
                strokeWidth={4}
                strokeColor={theme.colors.secondary}
                lineDashPattern={[5, 10]}
              />
            ) : (
              <>
                <Polyline
                  coordinates={clippedPolyline}
                  strokeWidth={9}
                  strokeColor={theme.colors.primary}
                />
                <Polyline
                  coordinates={clippedPolyline}
                  strokeWidth={6}
                  strokeColor={theme.colors.secondary}
                />
              </>
            )}
          </>
        )}
    </>
  );
};
