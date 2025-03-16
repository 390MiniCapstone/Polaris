import React from 'react';
import { Marker } from 'react-native-maps';
import { Building, BUILDING_INFO } from '@/constants/buildingInfo';
import useTheme from '@/hooks/useTheme';

export const Buildings: React.FC = () => {
  const { theme } = useTheme();
  const pinTheme = theme.colors.secondary;
  return (
    <>
      {BUILDING_INFO.map((building: Building) => (
        <Marker
          key={`${building.Building}-${pinTheme}`}
          testID="concordia-building"
          coordinate={{
            latitude: parseFloat(building.Latitude),
            longitude: parseFloat(building.Longitude),
          }}
          title={building.Building_Name}
          description={`${building.Building_Long_Name} - ${building.Address}`}
          pinColor={pinTheme}
        />
      ))}
    </>
  );
};
