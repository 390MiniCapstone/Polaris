import React from 'react';
import { render } from '@testing-library/react-native';
import { IndoorBottomSheetComponent } from '@/components/BottomSheetComponent/IndoorBottomSheetComponent';
import { useRouter } from 'expo-router';
import { View } from 'react-native';

jest.mock('expo-router', () => ({
  useRouter: jest.fn(() => ({
    back: jest.fn(),
  })),
}));

jest.mock('@gorhom/bottom-sheet', () => {
  const { View } = require('react-native');

  return {
    __esModule: true,
    BottomSheet: jest
      .fn()
      .mockImplementation(({ children }) => (
        <View testID="bottom-sheet-container">{children}</View>
      )),
    BottomSheetView: jest
      .fn()
      .mockImplementation(({ children }) => <View>{children}</View>),
  };
});

jest.mock('@/components/FloorSelector/FloorSelector', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    FloorSelector: () => <View testID="floor-selector" />,
  };
});

jest.mock('@/components/BottomSheetComponent/BottomSheetComponent', () => {
  const { View } = require('react-native');

  return {
    __esModule: true,
    BottomSheetComponent: ({ children }: { children: React.ReactNode }) => (
      <View testID="bottom-sheet-mock">{children}</View>
    ),
  };
});

describe('IndoorBottomSheetComponent', () => {
  it('renders without crashing', () => {
    const mockSelectFloor = jest.fn();
    const mockRouter = useRouter();

    const props = {
      floorPlan: {
        name: 'Floor 1',
        width: '1000',
        height: '500',
        SvgComponent: () => null,
      },
      selectFloor: mockSelectFloor,
      indoorBuilding: 'Building A',
    };

    const { getByTestId } = render(
      <View>
        <IndoorBottomSheetComponent {...props} />
      </View>
    );

    expect(getByTestId('floor-selector')).toBeTruthy();
  });
});
