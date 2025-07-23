import React, { useEffect } from "react";
import Svg, { Circle } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from "react-native-reanimated";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface AnimatedCircularProgressProps {
  size?: number;
  color?: string;
  backgroundColor?: string;
  strokeWidth?: number;
  target: number;
  consumed: number;
}

const AnimatedCircularProgress = ({
  size = 50,
  color = "#FB923C",
  backgroundColor = "#E0E0E0",
  strokeWidth = 5,
  target,
  consumed,
}: AnimatedCircularProgressProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const animatedStroke = useSharedValue(0);

  useEffect(() => {
    const percent = target === 0 ? 0 : consumed / target;
    const progressLength = percent * circumference;

    animatedStroke.value = withTiming(progressLength, {
      duration: 1000,
      easing: Easing.out(Easing.exp),
    });
  }, [consumed, target]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference - animatedStroke.value,
  }));

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={backgroundColor}
        strokeWidth={strokeWidth}
        fill="none"
      />
      <AnimatedCircle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        animatedProps={animatedProps}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </Svg>
  );
};

export default AnimatedCircularProgress;
