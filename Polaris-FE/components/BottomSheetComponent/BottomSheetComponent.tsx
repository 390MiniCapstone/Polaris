import React from 'react';
import { StyleSheet } from 'react-native';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import Animated from 'react-native-reanimated';

interface BottomSheetComponentProps {
  bottomSheetRef: React.RefObject<BottomSheet>;
  animatedPosition: Animated.SharedValue<number>;
  children?: React.ReactNode;
}

export const BottomSheetComponent: React.FC<BottomSheetComponentProps> = ({
  bottomSheetRef,
  animatedPosition,
  children,
}) => {
  return (
    <BottomSheet
      index={1}
      ref={bottomSheetRef}
      snapPoints={['15%', '50%', '93%']}
      backgroundStyle={styles.bottomSheet}
      handleIndicatorStyle={styles.handleIndicator}
      animatedPosition={animatedPosition}
    >
      <BottomSheetScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 100,
        }}
      >
        {children}
      </BottomSheetScrollView>
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
});
