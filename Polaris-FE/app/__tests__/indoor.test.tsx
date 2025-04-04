import { render } from '@testing-library/react-native';
import Indoor from '../indoor';
import { useBuildingContext } from '@/contexts/BuildingContext/BuildingContext';
import { FLOOR_PLANS } from '@/constants/floorPlans';

jest.mock('@/contexts/BuildingContext/BuildingContext', () => ({
  useBuildingContext: jest.fn(),
}));

jest.mock('@/components/PinchPanContainer/PinchPanContainer', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: () => <View testID="pinch-pan-container" />,
  };
});

jest.mock(
  '@/components/BottomSheetComponent/IndoorBottomSheetComponent',
  () => {
    const React = require('react');
    const { View } = require('react-native');
    return {
      __esModule: true,
      IndoorBottomSheetComponent: () => <View testID="indoor-bottom-sheet" />,
    };
  }
);

describe('Indoor Component', () => {
  it('renders without crashing', () => {
    (useBuildingContext as jest.Mock).mockReturnValue({
      indoorBuilding: Object.keys(FLOOR_PLANS)[0],
    });

    const { getByTestId } = render(<Indoor />);

    expect(getByTestId('pinch-pan-container')).toBeTruthy();

    expect(getByTestId('indoor-bottom-sheet')).toBeTruthy();
  });
});
