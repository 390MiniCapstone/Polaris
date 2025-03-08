import { render } from '@testing-library/react-native';
import PinchPanContainer from '../PinchPanContainer';
import { useZoomAndPan } from '../useZoomAndPan';

jest.mock('react-native-reanimated', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    __esModule: true,
    default: {
      View: props => <View {...props} />,
    },
    useAnimatedStyle: jest.fn(() => ({ transform: [] })),
    Animated: {
      View: props => <View {...props} data-testid="animated-view" />,
    },
  };
});

jest.mock('react-native-gesture-handler', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    __esModule: true,
    GestureHandlerRootView: props => (
      <View {...props} data-testid="gesture-root-view" />
    ),
    GestureDetector: props => (
      <View {...props} data-testid="gesture-detector" />
    ),
  };
});

jest.mock('../useZoomAndPan', () => ({
  useZoomAndPan: jest.fn(() => ({
    zoomLevel: { value: 1 },
    panTranslateX: { value: 0 },
    panTranslateY: { value: 0 },
    gesture: { type: 'mockGesture' },
  })),
}));

describe('PinchPanContainer Component', () => {
  const MockSvgComponent = props => (
    <div data-testid="svg-component" {...props} />
  );

  const mockFloorPlan = {
    id: 'test-floor-plan',
    name: 'Test Floor Plan',
    width: 800,
    height: 600,
    SvgComponent: MockSvgComponent,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls useZoomAndPan with correct parameters', () => {
    render(<PinchPanContainer floorPlan={mockFloorPlan} />);
    expect(useZoomAndPan).toHaveBeenCalledWith(1, 3, 1.5);
  });
});
