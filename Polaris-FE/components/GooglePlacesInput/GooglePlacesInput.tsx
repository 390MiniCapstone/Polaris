import Constants from 'expo-constants';
import React, { useEffect, useRef } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { useMapLocation } from '@/hooks/useMapLocation';
import { inputRef } from '@/utils/refs';
import { SearchResult } from '../BottomSheetComponent/OutdoorBottomSheetComponent';
import { POIs } from '../POIs/POIs';
import { styles } from './GooglePlacesInput.styles';

interface GooglePlacesInputProps {
  searchResults: SearchResult[];
  setSearchResults: (results: SearchResult[]) => void;
  onFocus: () => void;
  query: string;
  setQuery: (query: string) => void;
}

const GOOGLE_MAPS_API_KEY = Constants.expoConfig?.extra
  ?.googleMapsApiKey as string;

const GooglePlacesInput: React.FC<GooglePlacesInputProps> = ({
  searchResults,
  setSearchResults,
  onFocus,
  query,
  setQuery,
}) => {
  const { location } = useMapLocation();

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!location || query.length === 0) {
      setSearchResults([]);
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      const params = new URLSearchParams({
        input: query,
        key: GOOGLE_MAPS_API_KEY,
        location: `${location.latitude},${location.longitude}`,
        radius: '50000',
        components: 'country:ca',
      });

      fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?${params.toString()}`
      )
        .then(res => res.json())
        .then(data => {
          setSearchResults(data.predictions || []);
        })
        .catch(error => console.error(error));
    }, 500);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [query, location]);

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <BottomSheetTextInput
          testID="places-input"
          ref={inputRef}
          value={query}
          onChangeText={setQuery}
          placeholder="Search Polaris"
          placeholderTextColor="gray"
          selectionColor="#9A2D3F"
          style={styles.input}
          onFocus={onFocus}
        />
        {searchResults.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              setQuery('');
              setSearchResults([]);
              inputRef.current?.blur();
            }}
            style={styles.clearButton}
          >
            <Text style={styles.clearButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
      <POIs setSearchResults={setSearchResults} />
    </View>
  );
};

export default GooglePlacesInput;
