import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import Animated from 'react-native-reanimated';
import GooglePlacesInput from '@/components/GooglePlacesInput';
import Constants from 'expo-constants';
import { bottomSheetRef, inputRef } from '@/utils/refs';
import { useNavigation } from '@/contexts/NavigationContext/NavigationContext';
import { BottomSheetComponent } from '@/components/BottomSheetComponent/BottomSheetComponent';
import NextClassCard from '@/components/NextClassComponent/NextClassCard';
import { MaterialIcons } from '@expo/vector-icons';

interface OutdoorBottomSheetProps {
  animatedPosition: Animated.SharedValue<number>;
}

export interface SearchResult {
  place_id: string;
  description: string;
  latitude: number;
  longitude: number;
  name?: string;
  vicinity?: string;
}

const GOOGLE_MAPS_API_KEY = Constants.expoConfig?.extra
  ?.googleMapsApiKey as string;

export const OutdoorBottomSheetComponent: React.FC<OutdoorBottomSheetProps> = ({
  animatedPosition,
}) => {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [query, setQuery] = useState('');
  const { startNavigationToDestination } = useNavigation();

  const handleLocationSelect = (placeId: string, description: string) => {
    Keyboard.dismiss();
    fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_MAPS_API_KEY}`
    )
      .then(res => res.json())
      .then(data => {
        if (data.result) {
          const location = {
            latitude: data.result.geometry.location.lat,
            longitude: data.result.geometry.location.lng,
          };

          setSearchResults([]);
          inputRef.current?.blur();
          setQuery('');
          startNavigationToDestination(location);
        }
      })
      .catch(error => console.error(error));
  };

  return (
    <BottomSheetComponent
      bottomSheetRef={bottomSheetRef}
      animatedPosition={animatedPosition}
    >
      <View style={styles.container}>
        <GooglePlacesInput
          setSearchResults={setSearchResults}
          onFocus={() => bottomSheetRef.current?.snapToIndex(3)}
          query={query}
          setQuery={setQuery}
        />

        <View style={styles.resultsContainer}>
          {searchResults.map((result, index) => (
            <View key={result.place_id}>
              <TouchableOpacity
                style={styles.searchResult}
                onPress={() =>
                  handleLocationSelect(
                    result.place_id,
                    result.description || result.name || 'Unknown Place'
                  )
                }
              >
                <View style={styles.resultContent}>
                  <MaterialIcons
                    name="place"
                    size={24}
                    color="#fff"
                    style={styles.poiIcon}
                  />
                  <View style={styles.textContainer}>
                    <Text style={styles.poiName}>
                      {result.name || result.description}
                    </Text>
                    {result.vicinity && (
                      <Text style={styles.poiVicinity}>{result.vicinity}</Text>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          ))}
        </View>
        <NextClassCard />
      </View>
    </BottomSheetComponent>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  resultsContainer: {
    width: '100%',
    marginTop: 10,
  },
  searchResult: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(151, 151, 151, 0.25)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    marginHorizontal: 12,
    shadowColor: 'rgba(49, 49, 49, 0.6)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 5,
  },
  resultContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  poiIcon: {
    marginRight: 16,
    opacity: 0.8,
  },
  textContainer: {
    flex: 1,
  },
  poiName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  poiVicinity: {
    fontSize: 14,
    color: '#A0A0A0',
    marginTop: 2,
    letterSpacing: 0.2,
  },
});
