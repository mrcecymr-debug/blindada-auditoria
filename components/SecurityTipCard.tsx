import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeOutUp, FadeIn, FadeOut } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { getDailyTip, SECURITY_TIPS } from '@/lib/security-content';

const CATEGORY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  Chegada: 'home-outline',
  Alerta: 'eye-outline',
  Golpe: 'warning-outline',
  Rotina: 'calendar-outline',
};

const CATEGORY_COLORS: Record<string, string> = {
  Chegada: Colors.accent,
  Alerta: '#FF9F43',
  Golpe: '#FF6B6B',
  Rotina: '#4D96FF',
};

function getDailyIndex(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  return dayOfYear % SECURITY_TIPS.length;
}

export default function SecurityTipCard() {
  const [dismissed, setDismissed] = useState(false);
  const [index, setIndex] = useState(getDailyIndex);
  const [animKey, setAnimKey] = useState(0);

  const tip = SECURITY_TIPS[index];
  const icon = CATEGORY_ICONS[tip.category] || 'bulb-outline';
  const color = CATEGORY_COLORS[tip.category] || Colors.accent;

  const handleNext = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIndex((prev) => (prev + 1) % SECURITY_TIPS.length);
    setAnimKey((k) => k + 1);
  }, []);

  const handlePrev = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIndex((prev) => (prev - 1 + SECURITY_TIPS.length) % SECURITY_TIPS.length);
    setAnimKey((k) => k + 1);
  }, []);

  const handleDismiss = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setDismissed(true);
  }, []);

  if (dismissed) return null;

  return (
    <Animated.View entering={FadeInDown.delay(200).duration(400)} exiting={FadeOutUp.duration(300)}>
      <View style={[styles.card, { borderLeftColor: color }]}>
        <View style={[styles.accentBar, { backgroundColor: color }]} />

        <View style={styles.inner}>
          <View style={styles.topRow}>
            <View style={[styles.iconBg, { backgroundColor: color + '20' }]}>
              <Ionicons name={icon} size={18} color={color} />
            </View>
            <View style={styles.labelGroup}>
              <Text style={styles.tipLabel}>DICA DE SEGURANCA</Text>
              <Text style={[styles.categoryLabel, { color }]}>{tip.category}</Text>
            </View>
            <View style={styles.counterBadge}>
              <Text style={styles.counterText}>{index + 1}/{SECURITY_TIPS.length}</Text>
            </View>
            <Pressable onPress={handleDismiss} hitSlop={12} style={styles.closeBtn}>
              <Ionicons name="close" size={16} color={Colors.textMuted} />
            </Pressable>
          </View>

          <Animated.Text key={animKey} entering={FadeIn.duration(280)} style={styles.tipText}>
            {tip.tip}
          </Animated.Text>

          <View style={styles.bottomRow}>
            <View style={styles.navBtns}>
              <Pressable onPress={handlePrev} style={styles.navBtn} hitSlop={8}>
                <Ionicons name="chevron-back" size={14} color={Colors.textSecondary} />
              </Pressable>
              <Pressable onPress={handleNext} style={[styles.nextBtn, { borderColor: color + '40', backgroundColor: color + '12' }]} hitSlop={8}>
                <Text style={[styles.nextBtnText, { color }]}>Próxima dica</Text>
                <Ionicons name="chevron-forward" size={13} color={color} />
              </Pressable>
            </View>
            <View style={styles.brand}>
              <Ionicons name="shield-checkmark-outline" size={11} color={Colors.textMuted} />
              <Text style={styles.brandText}>MR ENG</Text>
            </View>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 4,
  },
  accentBar: {
    width: 4,
  },
  inner: {
    flex: 1,
    padding: 14,
    gap: 10,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBg: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  labelGroup: {
    flex: 1,
  },
  tipLabel: {
    fontSize: 9,
    fontWeight: '800' as const,
    color: Colors.textMuted,
    letterSpacing: 1,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '700' as const,
    marginTop: 1,
  },
  counterBadge: {
    backgroundColor: Colors.card,
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  counterText: {
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: '600' as const,
  },
  closeBtn: {
    padding: 2,
  },
  tipText: {
    fontSize: 13,
    color: Colors.text,
    lineHeight: 20,
    fontWeight: '400' as const,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navBtns: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  navBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  nextBtnText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  brandText: {
    fontSize: 10,
    color: Colors.textMuted,
  },
});
