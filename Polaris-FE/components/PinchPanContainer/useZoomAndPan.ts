import { useSharedValue } from 'react-native-reanimated';
import { Gesture } from 'react-native-gesture-handler';

export const useZoomAndPan = (
  minZoom = 1,
  maxZoom = 3,
  panSpeedMultiplier = 0.5
) => {
  const zoomLevel = useSharedValue(minZoom);
  const previousZoomLevel = useSharedValue(1);

  const panTranslateX = useSharedValue(0);
  const previousPanTranslateX = useSharedValue(0);
  const panTranslateY = useSharedValue(0);
  const previousPanTranslateY = useSharedValue(0);

  const pinchGesture = Gesture.Pinch()
    .onStart(() => {
      previousZoomLevel.value = zoomLevel.value;
    })
    .onUpdate(event => {
      zoomLevel.value = previousZoomLevel.value * event.scale;
    })
    .onEnd(() => {
      zoomLevel.value = Math.max(minZoom, Math.min(zoomLevel.value, maxZoom));
    });

  const panGesture = Gesture.Pan()
    .onStart(() => {
      previousPanTranslateX.value = panTranslateX.value;
      previousPanTranslateY.value = panTranslateY.value;
    })
    .onUpdate(event => {
      panTranslateX.value =
        previousPanTranslateX.value + event.translationX * panSpeedMultiplier;
      panTranslateY.value =
        previousPanTranslateY.value + event.translationY * panSpeedMultiplier;
    });

  const gesture = Gesture.Simultaneous(pinchGesture, panGesture);

  return { zoomLevel, panTranslateX, panTranslateY, gesture };
};
