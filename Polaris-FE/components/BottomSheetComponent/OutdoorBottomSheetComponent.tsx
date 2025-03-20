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
import { bottomSheetRef } from '@/utils/refs';
import { useNavigation } from '@/contexts/NavigationContext/NavigationContext';
import { inputRef } from '@/utils/refs';
import { BottomSheetComponent } from '@/components/BottomSheetComponent/BottomSheetComponent';
import NextClassCard from '@/components/NextClassComponent/NextClassCard';

interface OutdoorBottomSheetProps {
  animatedPosition: Animated.SharedValue<number>;
}

interface SearchResult {
  place_id: string;
  description: string;
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
                  handleLocationSelect(result.place_id, result.description)
                }
              >
                <Text style={styles.searchResultText}>
                  {result.description}
                </Text>
              </TouchableOpacity>

              {index < searchResults.length - 1 && (
                <View style={styles.separator} testID="separator" />
              )}
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
    paddingVertical: 12,
    paddingHorizontal: 5,
  },
  searchResultText: {
    width: '100%',
    color: 'white',
    fontSize: 16,
  },
  separator: {
    height: 1,
    backgroundColor: '#5E5F62',
    marginHorizontal: 5,
  },
});
