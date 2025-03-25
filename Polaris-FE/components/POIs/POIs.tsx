import { POIS } from '@/constants/mapConstants';
import { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SearchResult } from '../BottomSheetComponent/OutdoorBottomSheetComponent';
import { useMapLocation } from '@/hooks/useMapLocation';
import Constants from 'expo-constants';
import { styles } from './POIs.styles';

interface POIs {
  setSearchResults: (results: SearchResult[]) => void;
}

const GOOGLE_MAPS_API_KEY = Constants.expoConfig?.extra
  ?.googleMapsApiKey as string;

export const POIs: React.FC<POIs> = ({ setSearchResults }) => {
  const [isCategoryLoading, setIsCategoryLoading] = useState<string | null>(
    null
  );
  const { location } = useMapLocation();

  const fetchPOIs = async (type: string) => {
    if (!location || isCategoryLoading) return;
    setIsCategoryLoading(type);
    const radius = 1000;
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.latitude},${location.longitude}&radius=${radius}&type=${type}&keyword=${type}&key=${GOOGLE_MAPS_API_KEY}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      setSearchResults(data.results || []);
    } catch (error) {
      console.error('Error fetching POIs:', error);
      setSearchResults([]);
    } finally {
      setIsCategoryLoading(null);
    }
  };

  return (
    <View style={styles.scrollWrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.categoryContainer}
      >
        {POIS.map(category => (
          <TouchableOpacity
            key={category}
            style={styles.categoryButton}
            onPress={() => fetchPOIs(category.toLowerCase())}
            disabled={isCategoryLoading !== null}
          >
            {isCategoryLoading === category.toLowerCase() ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.categoryButtonText}>{category}</Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};
