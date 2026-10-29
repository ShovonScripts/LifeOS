import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolate,
  runOnJS,
} from 'react-native-reanimated';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

type SwipeAction = {
  label: string;
  icon: React.ReactNode;
  color: string;
  onPress: () => void;
};

type SwipeableRowProps = {
  children: React.ReactNode;
  leftActions?: SwipeAction[];
  rightActions?: SwipeAction[];
  threshold?: number;
};

const ACTION_WIDTH = 80;
const ANIMATION_DURATION = 150;

export function SwipeableRow({
  children,
  leftActions = [],
  rightActions = [],
  threshold = 0.35,
}: SwipeableRowProps) {
  const translateX = useSharedValue(0);
  const isOpen = useSharedValue(false);
  const activeSide = useSharedValue<'left' | 'right' | null>(null);

  const totalLeftWidth = leftActions.length * ACTION_WIDTH;
  const totalRightWidth = rightActions.length * ACTION_WIDTH;

  const close = () => {
    isOpen.value = false;
    activeSide.value = null;
    translateX.value = withTiming(0, { duration: ANIMATION_DURATION });
  };

  const handleActionPress = (action: SwipeAction) => {
    runOnJS(() => {
      close();
      action.onPress();
    })();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const leftContainerStyle = useAnimatedStyle(() => {
    const width = interpolate(
      translateX.value,
      [0, totalLeftWidth],
      [0, totalLeftWidth],
      Extrapolate.CLAMP,
    );
    return {
      width,
      opacity: interpolate(translateX.value, [0, totalLeftWidth * 0.5], [0, 1], Extrapolate.CLAMP),
    };
  });

  const rightContainerStyle = useAnimatedStyle(() => {
    const width = interpolate(
      translateX.value,
      [-totalRightWidth, 0],
      [totalRightWidth, 0],
      Extrapolate.CLAMP,
    );
    return {
      width,
      opacity: interpolate(
        translateX.value,
        [-totalRightWidth * 0.5, 0],
        [1, 0],
        Extrapolate.CLAMP,
      ),
    };
  });

  const handleGestureEvent = (event: { nativeEvent: { translationX: number } }) => {
    'worklet';
    // eslint-disable-next-line react-hooks/immutability
    translateX.value = event.nativeEvent.translationX;
  };

  const handleStateChange = (event: { nativeEvent: { state: number; translationX: number } }) => {
    'worklet';
    if (event.nativeEvent.state === 3) {
      const tx = event.nativeEvent.translationX;
      const absTx = Math.abs(tx);
      const maxWidth = tx > 0 ? totalLeftWidth : totalRightWidth;

      if (absTx > maxWidth * threshold && maxWidth > 0) {
        isOpen.value = true;
        activeSide.value = tx > 0 ? 'left' : 'right';
        // eslint-disable-next-line react-hooks/immutability
        translateX.value = withTiming(tx > 0 ? totalLeftWidth : -totalRightWidth, {
          duration: ANIMATION_DURATION,
        });
      } else {
        close();
      }
    }
  };

  const renderActions = (actions: SwipeAction[], isLeft: boolean) => (
    <Animated.View
      style={[
        styles.actionsContainer,
        isLeft ? styles.leftActions : styles.rightActions,
        isLeft ? leftContainerStyle : rightContainerStyle,
      ]}
    >
      {actions.map((action, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.actionButton, { backgroundColor: action.color, width: ACTION_WIDTH }]}
          onPress={() => handleActionPress(action)}
        >
          <View style={styles.actionContent}>
            <View>{action.icon}</View>
            <Text style={styles.actionLabel}>{action.label}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </Animated.View>
  );

  return (
    <PanGestureHandler onGestureEvent={handleGestureEvent} onHandlerStateChange={handleStateChange}>
      <Animated.View style={[styles.container, animatedStyle]}>
        {leftActions.length > 0 && renderActions(leftActions, true)}
        <View style={styles.content} onTouchStart={close}>
          {children}
        </View>
        {rightActions.length > 0 && renderActions(rightActions, false)}
      </Animated.View>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    overflow: 'hidden',
  },
  content: {
    flex: 1,
  },
  actionsContainer: {
    flexDirection: 'row',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  leftActions: {
    flexDirection: 'row',
  },
  rightActions: {
    flexDirection: 'row-reverse',
  },
  actionButton: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  actionContent: {
    alignItems: 'center',
    gap: 4,
  },
  actionLabel: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
});
