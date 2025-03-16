import { render } from '@testing-library/react-native';
import { FloorSelector } from '../FloorSelector';
import { handleFloorChange } from '../utills';

jest.mock('@/constants/floorPlans', () => ({
  FLOOR_PLANS: {
    'Building A': [
      {
        name: 'Floor 1',
        width: '1000',
        height: '500',
        SvgComponent: () => null,
      },
      {
        name: 'Floor 2',
        width: '1000',
        height: '500',
        SvgComponent: () => null,
      },
    ],
  },
}));

describe('FloorSelector Component', () => {
  it('renders without crashing', () => {
    const mockSelectFloor = jest.fn();

    const props = {
      floorPlan: {
        SvgComponent: () => null,
        name: 'Floor 1',
        width: '1000',
        height: '500',
      },
      selectFloor: mockSelectFloor,
      indoorBuilding: 'Building A',
    };

    const { getByTestId } = render(<FloorSelector {...props} />);
    expect(getByTestId('picker-container')).toBeTruthy();
  });
});

describe('handleFloorChange', () => {
  it('should call selectFloor with the correct floor plan', () => {
    const mockSelectFloor = jest.fn();

    handleFloorChange('Floor 2', 'Building A', mockSelectFloor);

    expect(mockSelectFloor).toHaveBeenCalledWith({
      name: 'Floor 2',
      width: '1000',
      height: '500',
      SvgComponent: expect.any(Function),
    });
  });

  it('should not call selectFloor if the building does not exist', () => {
    const mockSelectFloor = jest.fn();

    handleFloorChange('Floor 2', 'Nonexistent Building', mockSelectFloor);

    expect(mockSelectFloor).not.toHaveBeenCalled();
  });

  it('should not call selectFloor if floor name is not found', () => {
    const mockSelectFloor = jest.fn();

    handleFloorChange('Invalid Floor', 'Building A', mockSelectFloor);

    expect(mockSelectFloor).not.toHaveBeenCalled();
  });

  it('should not call selectFloor if indoorBuilding is null', () => {
    const mockSelectFloor = jest.fn();

    handleFloorChange('Floor 1', null, mockSelectFloor);

    expect(mockSelectFloor).not.toHaveBeenCalled();
  });
});
