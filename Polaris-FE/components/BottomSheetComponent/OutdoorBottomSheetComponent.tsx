import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import { BottomSheetComponent } from '@/components/BottomSheetComponent/BottomSheetComponent';
import { Region } from 'react-native-maps';
import Constants from 'expo-constants';
import GooglePlacesInput from '@/components/GooglePlacesInput';
import Animated from 'react-native-reanimated';
import { useRouter } from 'expo-router';

interface OutdoorBottomSheetProps {
  onSearchClick: (region: Region) => void;
  onFocus: () => void;
  animatedPosition: Animated.SharedValue<number>;
}

interface SearchResult {
  place_id: string;
  description: string;
}

const GOOGLE_MAPS_API_KEY = Constants.expoConfig?.extra
  ?.googleMapsApiKey as string;

export const OutdoorBottomSheetComponent: React.FC<OutdoorBottomSheetProps> = ({
  onSearchClick,
  onFocus,
  animatedPosition,
}) => {
  const router = useRouter();
  const bottomSheetRef = useRef<any>(null);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  const handleLocationSelect = (placeId: string, description: string) => {
    Keyboard.dismiss();
    fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_MAPS_API_KEY}`
    )
      .then(res => res.json())
      .then(data => {
        if (data.result) {
          const region: Region = {
            latitude: data.result.geometry.location.lat,
            longitude: data.result.geometry.location.lng,
            latitudeDelta: 0.001,
            longitudeDelta: 0.001,
          };
          setSearchResults([]);
          onSearchClick(region);
          bottomSheetRef.current?.snapToIndex(1);
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
          onFocus={onFocus}
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
                <View style={styles.separator} />
              )}
            </View>
          ))}
        </View>
      </View>
    </BottomSheetComponent>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
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

export default OutdoorBottomSheetComponent;
