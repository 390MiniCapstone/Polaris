import React from 'react';
import { Marker } from 'react-native-maps';
import { BUILDING_INFO, Building } from '@/constants/buildingInfo';
import { handleCalloutPress } from './utils';
import { useRouter } from 'expo-router';
import { useBuildingContext } from '@/app/BuildingContext';

export const Buildings: React.FC = () => {
  const { setIndoorBuilding } = useBuildingContext();
  const router = useRouter();

  return (
    <>
      {BUILDING_INFO.map((building: Building) => (
        <Marker
          key={building.Building}
          testID="concordia-building"
          coordinate={{
            latitude: parseFloat(building.Latitude),
            longitude: parseFloat(building.Longitude),
          }}
          title={building.Building_Name}
          description={`${building.Building_Long_Name} - ${building.Address}`}
          onCalloutPress={() =>
            handleCalloutPress(
              building.Building_Name,
              router,
              setIndoorBuilding
            )
          } // To Do: only make the enter available for the buldings witht he floor plans
        />
      ))}
    </>
  );
};
