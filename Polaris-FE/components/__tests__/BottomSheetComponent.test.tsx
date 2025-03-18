import React from 'react';
import { render } from '@testing-library/react-native';
import { BottomSheetComponent } from '../BottomSheetComponent/BottomSheetComponent';
import BottomSheet from '@gorhom/bottom-sheet';
import { useSharedValue } from 'react-native-reanimated';
import { View } from 'react-native';

describe('BottomSheetComponent', () => {
  it('renders without crashing', () => {
    const mockBottomSheetRef = {
      current: null,
    } as React.RefObject<BottomSheet>;
    const animatedPosition = useSharedValue(0);

    const { getByTestId } = render(
      <BottomSheetComponent
        bottomSheetRef={mockBottomSheetRef}
        animatedPosition={animatedPosition}
      >
        <View testID="bottom-sheet-container">Test Child</View>
      </BottomSheetComponent>
    );

    expect(getByTestId('bottom-sheet-container')).toBeTruthy();
  });
});
