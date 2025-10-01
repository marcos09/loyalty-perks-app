import React, { useEffect, useRef } from 'react';
import { Animated, StyleProp, ViewStyle } from 'react-native';

type SkeletonProps = {
  width?: number | string;
  height?: number | string;
  radius?: number;
  style?: StyleProp<ViewStyle>;
};

export function Skeleton({ width = '100%', height = 16, radius = 8, style }: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.6, duration: 700, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius: radius,
          backgroundColor: 'rgba(0,0,0,0.08)',
          opacity,
        },
        style,
      ]}
    />
  );
}

type SkeletonTextProps = Omit<SkeletonProps, 'height'> & { lines?: number; lineHeight?: number };

export function SkeletonText({ width = '100%', lines = 2, lineHeight = 14, radius = 6, style }: SkeletonTextProps) {
  return (
    <>
      {Array.from({ length: lines }).map((_, idx) => (
        <Skeleton
          key={idx}
          width={idx === lines - 1 ? (typeof width === 'number' ? width * 0.7 : '70%') : width}
          height={lineHeight}
          radius={radius}
          style={[{ marginTop: idx === 0 ? 0 : 8 }, style]}
        />)
      )}
    </>
  );
}


