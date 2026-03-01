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
import Colors from '@/constants/colors';

type FlowNavHintProps = {
  nextTab: string;
  nextLabel: string;
  message: string;
};

export default function FlowNavHint({ nextTab, nextLabel, message }: FlowNavHintProps) {
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
    <Animated.View entering={FadeIn.duration(400)}>
      <Pressable
        style={styles.container}
        onPress={() => router.push(nextTab as any)}
      >
        <Text style={styles.message}>{message}</Text>
        <Animated.View style={[styles.navRow, arrowStyle]}>
          <Text style={styles.navLabel}>{nextLabel}</Text>
          <Ionicons name="arrow-forward" size={18} color="#2ED573" />
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2ED573' + '10',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#2ED573' + '25',
    gap: 12,
  },
  message: {
    flex: 1,
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
    lineHeight: 17,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#2ED573' + '18',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  navLabel: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: '#2ED573',
  },
});
