import Constants from 'expo-constants';
import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { useMapLocation } from '@/hooks/useMapLocation';

interface Prediction {
  place_id: string;
  description: string;
}

interface GooglePlacesInputProps {
  setSearchResults: (results: Prediction[]) => void;
  onFocus: () => void;
}

const GOOGLE_MAPS_API_KEY = Constants.expoConfig?.extra
  ?.googleMapsApiKey as string;

const GooglePlacesInput: React.FC<GooglePlacesInputProps> = ({
  setSearchResults,
  onFocus,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<React.ElementRef<typeof BottomSheetTextInput>>(null);
  const { location } = useMapLocation();

  useEffect(() => {
    if (location) {
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
  }, [query, location]);

  return (
    <View style={styles.container}>
      <BottomSheetTextInput
        testID="places-input"
        ref={inputRef}
        value={query}
        onChangeText={setQuery}
        placeholder="Search Polaris"
        placeholderTextColor="gray"
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
    lineHeight: 20,
    paddingVertical: 10,
    paddingHorizontal: 14,
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
