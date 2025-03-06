import Constants from 'expo-constants';
import React, { useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { useMapLocation } from '@/hooks/useMapLocation';
import { inputRef } from '@/utils/refs';

interface Prediction {
  place_id: string;
  description: string;
}

interface GooglePlacesInputProps {
  setSearchResults: (results: Prediction[]) => void;
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

  useEffect(() => {
    if (location && query.length > 0) {
      const params = new URLSearchParams({
        input: query,
        key: GOOGLE_MAPS_API_KEY,
        location: `${location.latitude},${location.longitude}`,
        radius: '5000',
      });

      fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?${params.toString()}`
      )
        .then(res => res.json())
        .then(data => {
          if (data.predictions) {
            setSearchResults(data.predictions);
          }
        })
        .catch(error => console.error(error));
    } else {
      setSearchResults([]);
    }
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
