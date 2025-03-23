import Constants from 'expo-constants';
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { useMapLocation } from '@/hooks/useMapLocation';
import { inputRef } from '@/utils/refs';
import { POIS } from '@/constants/mapConstants';
import { SearchResult } from './BottomSheetComponent/OutdoorBottomSheetComponent';

interface GooglePlacesInputProps {
  setSearchResults: (results: SearchResult[]) => void;
  onFocus: () => void;
  query: string;
  setQuery: (query: string) => void;
}

const GOOGLE_MAPS_API_KEY = Constants.expoConfig?.extra
  ?.googleMapsApiKey as string;

const GooglePlacesInput: React.FC<GooglePlacesInputProps> = ({
  setSearchResults,
  onFocus,
  query,
  setQuery,
}) => {
  const { location } = useMapLocation();
  console.log(location);

  const [isCategoryLoading, setIsCategoryLoading] = useState<string | null>(
    null
  );
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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
    }, 500); // Debounce API requests (500ms)
  }, [query]);

  return (
    <View style={styles.container}>
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
      {query.length > 0 && (
        <TouchableOpacity
          onPress={() => {
            setQuery('');
            inputRef.current?.blur();
          }}
          style={styles.clearButton}
        >
          <Text style={styles.clearButtonText}>✕</Text>
        </TouchableOpacity>
      )}

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
  },
  input: {
    width: '100%',
    marginRight: 0,
    marginBottom: 0,
    borderRadius: 10,
    fontSize: 16,
    paddingVertical: 10,
    paddingRight: 42,
    paddingLeft: 14,
    backgroundColor: 'rgba(151, 151, 151, 0.25)',
    color: 'white',
  },
  scrollWrapper: {
    width: '100%',
    paddingVertical: 10,
  },
  categoryContainer: {
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1,
    paddingRight: 20,
  },
  categoryButton: {
    backgroundColor: 'rgba(151, 151, 151, 0.25)',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 10,
    ...Platform.select({
      android: { elevation: 2 },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
    }),
  },
  categoryButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  clearButton: {
    position: 'absolute',
    right: 14,
    top: '55%',
    transform: [{ translateY: -12 }],
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(151, 151, 151, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: {
    color: 'white',
    fontSize: 12,
  },
});

export default GooglePlacesInput;
