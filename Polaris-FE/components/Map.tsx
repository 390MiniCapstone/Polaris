import React from 'react';
import MapView, { Geojson, Region } from 'react-native-maps';
import { StyleSheet, View } from 'react-native';
import { campusBuildings } from '@/constants/buildings';
import { Buildings } from '@/components/Buildings/Buildings';
import { Navigation } from '@/components/Navigation/Navigation';
import { mapRef } from '@/utils/refs';
import { NavigationPolyline } from '@/components/Navigation/NavigationPolyline';
import { useCurrentBuilding } from '@/hooks/useCurrentBuilding';
import { useNavigation } from '@/contexts/NavigationContext/NavigationContext';
import useTheme from '@/hooks/useTheme';

interface MapComponentProps {
  region: Region | undefined;
  setRegion: (region: Region) => void;
}

export const MapComponent: React.FC<MapComponentProps> = ({
  region,
  setRegion,
}) => {
  const { navigationState } = useNavigation();

  const currentBuilding = useCurrentBuilding();
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <MapView
        testID="map-view"
        ref={mapRef}
        style={styles.map}
        initialRegion={region}
        onRegionChangeComplete={setRegion}
        showsUserLocation
        compassOffset={{ x: -10, y: 90 }}
        showsPointsOfInterest={navigationState === 'default'}
        tintColor="#A83B4A"
        userLocationCalloutEnabled
        showsTraffic={navigationState === 'navigating'}
      >
        <Geojson
          geojson={campusBuildings as GeoJSON.FeatureCollection}
          fillColor={theme.colors.primary}
        />

        <NavigationPolyline />

        {currentBuilding && (
          <Geojson
            geojson={{
              type: 'FeatureCollection',
              features: [
                {
                  type: 'Feature',
                  geometry: {
                    type: 'Polygon',
                    coordinates: currentBuilding.geometry.coordinates,
                  },
                  properties: {},
                },
              ],
            }}
            fillColor={theme.colors.currentBuildingFillColor}
            strokeColor={theme.colors.currentBuildingStrokeColor}
            strokeWidth={3}
          />
        )}
        <Buildings />
      </MapView>
      <Navigation />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
