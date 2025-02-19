import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { BottomSheetComponent } from '@/components/BottomSheetComponent';
import { SharedValue } from 'react-native-reanimated';

jest.mock('@/utils/refs', () => ({
  bottomSheetRef: {
    current: {
      snapToIndex: jest.fn(),
    },
  },
}));

jest.mock('@gorhom/bottom-sheet', () => {
  const React = require('react');
  const { View, TextInput } = require('react-native');
  const BottomSheet = (props: any) => (
    <View testID="bottom-sheet">{props.children}</View>
  );
  const BottomSheetTextInput = (props: any) => <TextInput {...props} />;
  const BottomSheetView = (props: any) => <View {...props} />;
  return {
    __esModule: true,
    default: BottomSheet,
    BottomSheetTextInput,
    BottomSheetView,
  };
});

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  return Reanimated;
});

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(message => {
    if (
      typeof message === 'string' &&
      message.includes('Function components cannot be given refs')
    ) {
      return;
    }
    console.error(message);
  });
});

afterAll(() => {
  (console.error as jest.Mock).mockRestore();
});

describe('BottomSheetComponent', () => {
  it('renders correctly and triggers snapToIndex on input focus', () => {
    const animatedPosition: SharedValue<number> = {
      value: 0,
      get: () => 0,
      set: (newValue: number) => {
        animatedPosition.value = newValue;
      },
      addListener: jest.fn(),
      removeListener: jest.fn(),
      modify: jest.fn(),
    };

    const { getByTestId } = render(
      <BottomSheetComponent animatedPosition={animatedPosition} />
    );

    const input = getByTestId('container-bottom-sheet-text-input');

    fireEvent(input, 'focus');

    const { bottomSheetRef } = require('@/utils/refs');

    expect(bottomSheetRef.current.snapToIndex).toHaveBeenCalledWith(3);
  });
});
