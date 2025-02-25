import React, { useMemo, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import Animated from 'react-native-reanimated';
import GooglePlacesInput from '@/components/GooglePlacesInput';
import { Region } from 'react-native-maps';
import Constants from 'expo-constants';
import { Keyboard } from 'react-native';
import { bottomSheetRef } from '@/utils/refs';

interface BottomSheetComponentProps {
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

export const BottomSheetComponent: React.FC<BottomSheetComponentProps> = ({
  onSearchClick,
  onFocus,
  animatedPosition,
}) => {
  const snapPoints = useMemo(() => ['15%', '50%', '93%'], []);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  const handleLocationSelect = (placeId: string, description: string) => {
    Keyboard.dismiss();
    fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_MAPS_API_KEY}`
    )
      .then(res => res.json())
      .then(data => {
        if (data.result) {
          const location = {
            name: description,
            latitude: data.result.geometry.location.lat.toString(),
            longitude: data.result.geometry.location.lng.toString(),
          };

          const region: Region = {
            latitude: parseFloat(location.latitude),
            longitude: parseFloat(location.longitude),
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
    <BottomSheet
      index={1}
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      backgroundStyle={styles.bottomSheet}
      handleIndicatorStyle={styles.handleIndicator}
      animatedPosition={animatedPosition}
    >
      <BottomSheetView style={styles.content}>
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
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  bottomSheet: {
    backgroundColor: '#222',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  handleIndicator: {
    backgroundColor: '#5E5F62',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 0,
  },
  resultsContainer: {
    marginTop: 0,
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

export default BottomSheetComponent;
