import React from 'react';
import MapView, { Geojson, LatLng, Region } from 'react-native-maps';
import { StyleSheet, View } from 'react-native';
import { downtownBuildings, loyolaBuildings } from '@/constants/buildings';
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
  const fillColor = theme.colors.primary;
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
          geojson={downtownBuildings as GeoJSON.FeatureCollection}
          fillColor={fillColor}
        />
        <Geojson
          geojson={loyolaBuildings as GeoJSON.FeatureCollection}
          fillColor={fillColor}
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
            fillColor="rgba(0, 0, 255, 0.5)"
            strokeColor="rgba(0, 0, 255, 1)"
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
