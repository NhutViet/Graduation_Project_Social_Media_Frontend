import React, {useEffect} from 'react';
import {View, Text, Image, StyleSheet, Dimensions} from 'react-native';
import Svg, {Circle} from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
} from 'react-native-reanimated';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import {Colors} from '../assets/color/Colors';

const {width, height} = Dimensions.get('window');

const SIZE = 50;
const STROKE = 4;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const PADDING = 20;
const MODAL_WIDTH = width * 0.3;
const MODAL_HEIGHT = height * 0.25;

type Props = {
  visible: boolean;
  thumbnailUri: string;
  progress: number;
};

type ContextType = {
  offsetX: number;
  offsetY: number;
};

export const UploadProgressModal = ({
  visible,
  thumbnailUri,
  progress,
}: Props) => {
  const initialX = width - MODAL_WIDTH - PADDING;
  const initialY = height - MODAL_HEIGHT - PADDING;

  const translateX = useSharedValue(initialX);
  const translateY = useSharedValue(initialY);

  useEffect(() => {
    if (visible) {
      translateX.value = initialX;
      translateY.value = initialY;
    }
  }, [visible]);

  const onGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    ContextType
  >({
    onStart: (_, ctx) => {
      ctx.offsetX = translateX.value;
      ctx.offsetY = translateY.value;
    },
    onActive: (event, ctx) => {
      translateX.value = ctx.offsetX + event.translationX;
      translateY.value = ctx.offsetY + event.translationY;
    },
    onEnd: () => {
      const positions = [
        {x: PADDING, y: PADDING},
        {x: width - MODAL_WIDTH - PADDING, y: PADDING},
        {x: PADDING, y: height - MODAL_HEIGHT - PADDING},
        {x: width - MODAL_WIDTH - PADDING, y: height - MODAL_HEIGHT - PADDING},
      ];

      const currentX = translateX.value;
      const currentY = translateY.value;

      const distances = positions.map(pos => {
        const dx = currentX - pos.x;
        const dy = currentY - pos.y;
        return dx * dx + dy * dy;
      });

      const minIndex = distances.indexOf(Math.min(...distances));
      const target = positions[minIndex];

      translateX.value = withSpring(target.x, {
        damping: 20,
        stiffness: 180,
      });
      translateY.value = withSpring(target.y, {
        damping: 20,
        stiffness: 180,
      });
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{translateX: translateX.value}, {translateY: translateY.value}],
  }));

  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);

  if (!visible) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <PanGestureHandler onGestureEvent={onGestureEvent}>
        <Animated.View style={[styles.modal, animatedStyle]}>
          <View style={styles.imageContainer}>
            <Image
              source={{uri: thumbnailUri}}
              style={styles.thumbnail}
              resizeMode="cover"
            />
            <View style={styles.imageOverlay} />
            <View style={styles.progressCircle}>
              <Svg width={SIZE} height={SIZE}>
                <Circle
                  cx={SIZE / 2}
                  cy={SIZE / 2}
                  r={RADIUS}
                  stroke={Colors.black}
                  strokeWidth={STROKE}
                  fill="none"
                />
                <Circle
                  cx={SIZE / 2}
                  cy={SIZE / 2}
                  r={RADIUS}
                  stroke={Colors.white}
                  strokeWidth={STROKE}
                  fill="none"
                  strokeDasharray={CIRCUMFERENCE}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  rotation={-90}
                  origin={`${SIZE / 2}, ${SIZE / 2}`}
                />
              </Svg>
              <Text style={styles.percentText}>
                {Math.floor(progress * 100)}%
              </Text>
            </View>
          </View>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  modal: {
    position: 'absolute',
    width: MODAL_WIDTH,
    height: MODAL_HEIGHT,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  imageContainer: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  progressCircle: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentText: {
    position: 'absolute',
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 12,
  },
});
