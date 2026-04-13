import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { getDailyTip, SECURITY_TIPS } from '@/lib/security-content';

const CATEGORY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  Acesso: 'key-outline',
  Iluminacao: 'bulb-outline',
  Eletronica: 'hardware-chip-outline',
  Perimetro: 'shield-outline',
  Humano: 'people-outline',
};

const CATEGORY_COLORS: Record<string, string> = {
  Acesso: '#4D96FF',
  Iluminacao: '#FFD93D',
  Eletronica: Colors.accent,
  Perimetro: '#6BCB77',
  Humano: '#FF9F43',
};

export default function SecurityTipCard() {
  const [dismissed, setDismissed] = useState(false);
  const tip = getDailyTip();
  const icon = CATEGORY_ICONS[tip.category] || 'bulb-outline';
  const color = CATEGORY_COLORS[tip.category] || Colors.accent;
  const tipNumber = ((tip.id - 1) % SECURITY_TIPS.length) + 1;

  if (dismissed) return null;

  const handleDismiss = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setDismissed(true);
  };

  return (
    <Animated.View entering={FadeInDown.delay(200).duration(400)} exiting={FadeOutUp.duration(300)}>
      <View style={styles.card}>
        <View style={[styles.accentBar, { backgroundColor: color }]} />

        <View style={styles.inner}>
          <View style={styles.topRow}>
            <View style={[styles.iconBg, { backgroundColor: color + '20' }]}>
              <Ionicons name={icon} size={18} color={color} />
            </View>
            <View style={styles.labelGroup}>
              <Text style={styles.tipLabel}>DICA DO DIA</Text>
              <Text style={[styles.categoryLabel, { color }]}>{tip.category}</Text>
            </View>
            <View style={styles.counterBadge}>
              <Text style={styles.counterText}>{tipNumber}/{SECURITY_TIPS.length}</Text>
            </View>
            <Pressable onPress={handleDismiss} hitSlop={12} style={styles.closeBtn}>
              <Ionicons name="close" size={16} color={Colors.textMuted} />
            </Pressable>
          </View>

          <Text style={styles.tipText}>{tip.tip}</Text>

          <View style={styles.footer}>
            <Ionicons name="shield-checkmark-outline" size={12} color={Colors.textMuted} />
            <Text style={styles.footerText}>MR ENG — Seguranca Estrategica</Text>
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
    borderRadius: 4,
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
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  footerText: {
    fontSize: 10,
    color: Colors.textMuted,
  },
});
