import React, { useEffect } from 'react';
import { StyleSheet, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  FadeIn,
} from 'react-native-reanimated';

type FlowNavHintProps = {
  nextTab: string;
  nextLabel: string;
  message?: string;
};

export default function FlowNavHint({ nextTab, nextLabel }: FlowNavHintProps) {
  const router = useRouter();
  const translateX = useSharedValue(0);

  useEffect(() => {
    translateX.value = withRepeat(
      withSequence(
        withTiming(6, { duration: 600 }),
        withTiming(0, { duration: 600 })
      ),
      -1,
      false
    );
  }, []);

  const arrowStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View entering={FadeIn.duration(400)} style={styles.wrapper}>
      <Pressable
        style={({ pressed }) => [styles.button, pressed && { opacity: 0.7 }]}
        onPress={() => router.push(nextTab as any)}
      >
        <Animated.View style={[styles.inner, arrowStyle]}>
          <Text style={styles.label}>{nextLabel}</Text>
          <Ionicons name="arrow-forward" size={16} color="#2ED573" />
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#2ED573' + '18',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#2ED573' + '30',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: '#2ED573',
  },
});
