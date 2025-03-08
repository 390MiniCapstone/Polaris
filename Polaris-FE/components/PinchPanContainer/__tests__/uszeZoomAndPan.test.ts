import { renderHook } from '@testing-library/react-hooks';
import { useZoomAndPan } from '../useZoomAndPan';
import { useSharedValue } from 'react-native-reanimated';
import { Gesture } from 'react-native-gesture-handler';

jest.mock('react-native-reanimated', () => ({
  useSharedValue: jest.fn(initialValue => ({
    value: initialValue,
  })),
}));

jest.mock('react-native-gesture-handler', () => {
  const mockGesture = {
    onStart: jest.fn().mockReturnThis(),
    onUpdate: jest.fn().mockReturnThis(),
    onEnd: jest.fn().mockReturnThis(),
  };

  return {
    Gesture: {
      Pinch: jest.fn(() => mockGesture),
      Pan: jest.fn(() => mockGesture),
      Simultaneous: jest.fn((...gestures) => ({
        gestures,
        mockGestureType: 'Simultaneous',
      })),
    },
  };
});

describe('useZoomAndPan', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should initialize with default values', () => {
    const { result } = renderHook(() => useZoomAndPan());

    expect(useSharedValue).toHaveBeenCalledWith(1);
    expect(useSharedValue).toHaveBeenCalledWith(0);

    expect(result.current.zoomLevel.value).toBe(1);
    expect(result.current.panTranslateX.value).toBe(0);
    expect(result.current.panTranslateY.value).toBe(0);
    expect(result.current.gesture).toBeDefined();
  });

  test('should initialize with custom values', () => {
    const { result } = renderHook(() => useZoomAndPan(0.5, 5, 1.5));

    expect(useSharedValue).toHaveBeenCalledWith(0.5);

    expect(result.current.zoomLevel.value).toBe(0.5);
  });

  test('should configure pinch gesture correctly', () => {
    renderHook(() => useZoomAndPan());

    expect(Gesture.Pinch).toHaveBeenCalled();

    const pinchMock = Gesture.Pinch();

    expect(pinchMock.onStart).toHaveBeenCalled();
    expect(pinchMock.onUpdate).toHaveBeenCalled();
    expect(pinchMock.onEnd).toHaveBeenCalled();
  });

  test('should configure pan gesture correctly', () => {
    renderHook(() => useZoomAndPan());

    expect(Gesture.Pan).toHaveBeenCalled();

    const panMock = Gesture.Pan();

    expect(panMock.onStart).toHaveBeenCalled();
    expect(panMock.onUpdate).toHaveBeenCalled();
  });

  test('should combine gestures with Simultaneous', () => {
    renderHook(() => useZoomAndPan());

    expect(Gesture.Simultaneous).toHaveBeenCalled();
  });
});
