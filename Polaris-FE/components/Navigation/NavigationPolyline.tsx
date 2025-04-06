import React from 'react';
import { Polyline } from 'react-native-maps';
import { useNavigation } from '@/contexts/NavigationContext/NavigationContext';
import useTheme from '@/hooks/useTheme';

export const NavigationPolyline: React.FC = () => {
  const {
    travelMode,
    destination,
    snappedPoint,
    clippedPolyline,
    navigationState,
    shuttleData,
    nextDeparture,
  } = useNavigation();
  const { theme } = useTheme();

  if (
    !(navigationState === 'planning' || navigationState === 'navigating') ||
    !clippedPolyline ||
    !snappedPoint ||
    !destination
  ) {
    return null;
  }

  const polyline = () => {
    if (travelMode === 'WALK') {
      return (
        <Polyline
          coordinates={clippedPolyline}
          strokeWidth={4}
          strokeColor={theme.colors.primary}
          lineDashPattern={[5, 10]}
        />
      );
    } else if (travelMode === 'SHUTTLE') {
      if (
        nextDeparture &&
        shuttleData?.legOne &&
        shuttleData?.legTwo &&
        shuttleData?.legThree
      ) {
        return (
          <>
            <Polyline
              coordinates={shuttleData.legOne.polyline}
              strokeWidth={4}
              strokeColor={theme.colors.primary}
              lineDashPattern={[5, 10]}
            />
            <Polyline
              coordinates={shuttleData.legTwo.busData.polyline}
              strokeWidth={9}
              strokeColor={theme.colors.primary}
            />
            <Polyline
              coordinates={shuttleData.legTwo.busData.polyline}
              strokeWidth={6}
              strokeColor={theme.colors.secondary}
            />
            <Polyline
              coordinates={shuttleData.legThree.polyline}
              strokeWidth={4}
              strokeColor={theme.colors.primary}
              lineDashPattern={[5, 10]}
            />
          </>
        );
      } else {
        return null;
      }
    } else {
      return (
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
      );
    }
  };

  return <>{polyline()}</>;
};
