import React from 'react';
import { Marker, Polyline } from 'react-native-maps';
import { useNavigation } from '@/contexts/NavigationContext/NavigationContext';
import useTheme from '@/hooks/useTheme';

export const NavigationPolyline: React.FC = () => {
  const {
    travelMode,
    destination,
    snappedPoint,
    clippedPolyline,
    navigationState,
  } = useNavigation();
  const { theme } = useTheme();

  return (
    <React.Fragment>
      {(navigationState === 'planning' || navigationState === 'navigating') &&
        clippedPolyline &&
        snappedPoint && (
          <React.Fragment>
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
              <React.Fragment>
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
              </React.Fragment>
            )}
          </React.Fragment>
        )}
    </React.Fragment>
  );
};
