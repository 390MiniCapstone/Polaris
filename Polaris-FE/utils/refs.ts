import BottomSheet from '@gorhom/bottom-sheet';
import React from 'react';
import MapView from 'react-native-maps';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';

export const bottomSheetRef = React.createRef<BottomSheet>();
export const mapRef = React.createRef<MapView>();
export const inputRef =
  React.createRef<React.ElementRef<typeof BottomSheetTextInput>>();
