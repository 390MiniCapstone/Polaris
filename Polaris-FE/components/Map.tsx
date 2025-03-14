import React from 'react';
import MapView, {Geojson, Region} from 'react-native-maps';
import {StyleSheet, View} from 'react-native';
import {downtownBuildings, loyolaBuildings} from '@/constants/buildings';
import {Buildings} from './Buildings/Buildings';
import {colorBlindMapStyle} from '@/constants/colorBlindMapStyle';

interface MapComponentProps {
    mapRef: React.RefObject<MapView>;
    region: Region | undefined;
    setRegion: (region: Region) => void;
    colorblindTheme: string;
}

export const MapComponent: React.FC<MapComponentProps> = ({
                                                              mapRef,
                                                              region,
                                                              setRegion,
                                                              colorblindTheme,
                                                          }) => {
    return (
        <View style={styles.container}>
            <MapView
                testID="map-view"
                ref={mapRef}
                style={styles.map}
                initialRegion={region}
                onRegionChangeComplete={setRegion}
                showsUserLocation
                showsCompass
                customMapStyle={colorblindTheme && colorBlindMapStyle[colorblindTheme] ? colorBlindMapStyle[colorblindTheme] : []}
                tintColor="#A83B4A"
            >
                <Geojson
                    geojson={downtownBuildings as GeoJSON.FeatureCollection}
                    fillColor="rgba(143, 34, 54, 0.8)"
                />
                <Geojson
                    geojson={loyolaBuildings as GeoJSON.FeatureCollection}
                    fillColor="rgba(143, 34, 54, 0.8)"
                />
                <Buildings/>
            </MapView>
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
    buttonContainer: {
        position: 'absolute',
        top: 20,
        alignSelf: 'center',
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
        zIndex: 1,
    },
});
