import React from 'react';
import { Geojson, Marker } from 'react-native-maps';
import { handleCalloutPress } from './utils';
import { useRouter } from 'expo-router';
import { useBuildingContext } from '@/contexts/BuildingContext/BuildingContext';
import { campusBuildings } from '@/constants/buildings';
import { pointOnFeature } from '@turf/turf';

export const Buildings: React.FC = () => {
  const { setIndoorBuilding } = useBuildingContext();
  const router = useRouter();

  return (
    <>
      {campusBuildings.features.map(feature => {
        const geoFeature = feature as GeoJSON.Feature<
          GeoJSON.Polygon,
          {
            name: string;
            campus: string;
            building: string;
            shortName: string;
            address: string;
          }
        >;

        const point = pointOnFeature(geoFeature);
        const [longitude, latitude] = point.geometry.coordinates;

        return (
          <Marker
            key={`${feature.properties.building}`}
            testID="concordia-building"
            coordinate={{ latitude, longitude }}
            title={feature.properties.name}
            description={`${feature.properties.shortName} - ${feature.properties.address}`}
            onCalloutPress={() =>
              handleCalloutPress(
                feature.properties.shortName,
                router,
                setIndoorBuilding
              )
            }
          >
            <Geojson geojson={campusBuildings as GeoJSON.FeatureCollection} />
          </Marker>
        );
      })}
    </>
  );
};
