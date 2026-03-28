import React from 'react';
import {
  Modal, View, Text, StyleSheet, Pressable, Image, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, ZoomIn, FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/constants/colors';
import { useAudit } from '@/lib/audit-context';
import { QUESTIONS } from '@/lib/audit-data';

const TOTAL = QUESTIONS.length;

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
}

function getScoreColor(pct: number) {
  if (pct >= 70) return Colors.success;
  if (pct >= 40) return Colors.warning;
  return Colors.danger;
}

export default function WelcomeModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const insets = useSafeAreaInsets();
  const { answeredCount, score, completedActions } = useAudit();

  const hasData = answeredCount > 0;
  const greeting = getGreeting();
  const progressPct = (answeredCount / TOTAL) * 100;
  const scoreColor = getScoreColor(score.percentage);
  const pb = Platform.OS === 'web' ? 24 : Math.max(insets.bottom, 16) + 8;

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" statusBarTranslucent>
      <View style={styles.overlay}>
        <Animated.View entering={FadeIn.duration(350)} style={[styles.sheet, { paddingBottom: pb }]}>

          <LinearGradient
            colors={hasData ? ['#D4AF3720', 'transparent'] : [Colors.accent + '22', 'transparent']}
            style={styles.sheetGradient}
          />

          <View style={styles.handle} />

          <Animated.View entering={FadeInDown.delay(80).duration(380)} style={styles.content}>

            <View style={styles.topRow}>
              <Image
                source={require('@/assets/images/logo-casa-blindada.jpg')}
                style={styles.logo}
                resizeMode="contain"
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.greetingLabel}>{greeting}!</Text>
                <Text style={styles.greetingTitle}>
                  {hasData ? 'Bem-vindo de volta' : 'Vamos comecar?'}
                </Text>
              </View>
              <Pressable onPress={handleClose} hitSlop={14} style={styles.closeX}>
                <Ionicons name="close" size={20} color={Colors.textMuted} />
              </Pressable>
            </View>

            {hasData ? (
              <>
                <Text style={styles.subtitle}>
                  Voce tem atividades em andamento. Continue de onde parou.
                </Text>

                <Animated.View entering={ZoomIn.delay(220).duration(380)} style={styles.statsCard}>

                  <View style={styles.scoreRow}>
                    <View style={[styles.scoreIconBg, { backgroundColor: '#D4AF3720', borderColor: '#D4AF3740' }]}>
                      <Ionicons name="shield-checkmark" size={22} color="#D4AF37" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.scoreLabel}>Nivel de Seguranca Atual</Text>
                      <Text style={[styles.scoreValue, { color: scoreColor }]}>
                        {score.percentage}% protegido
                      </Text>
                    </View>
                    <View style={[styles.scoreBadge, { borderColor: scoreColor }]}>
                      <Text style={[styles.scoreBadgeNum, { color: scoreColor }]}>
                        {score.percentage}
                      </Text>
                      <Text style={styles.scoreBadgeSign}>%</Text>
                    </View>
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.progressBlock}>
                    <View style={styles.progressLabelRow}>
                      <Ionicons name="clipboard-outline" size={14} color={Colors.textMuted} />
                      <Text style={styles.progressLabelText}>Perguntas respondidas</Text>
                      <Text style={styles.progressCount}>{answeredCount}/{TOTAL}</Text>
                    </View>
                    <View style={styles.progressTrack}>
                      <View
                        style={[
                          styles.progressFill,
                          {
                            width: `${progressPct}%` as any,
                            backgroundColor: progressPct === 100 ? Colors.success : Colors.accent,
                          },
                        ]}
                      />
                    </View>
                  </View>

                  {completedActions.size > 0 && (
                    <>
                      <View style={styles.divider} />
                      <View style={styles.actionStatusRow}>
                        <View style={styles.actionStatusIconBg}>
                          <Ionicons name="checkmark-done" size={15} color={Colors.success} />
                        </View>
                        <Text style={styles.actionStatusText}>
                          {completedActions.size}{' '}
                          {completedActions.size === 1
                            ? 'melhoria ja implementada'
                            : 'melhorias ja implementadas'}
                        </Text>
                      </View>
                    </>
                  )}
                </Animated.View>

                <Pressable
                  onPress={handleClose}
                  style={({ pressed }) => [styles.btnGold, pressed && { opacity: 0.85 }]}
                >
                  <Ionicons name="play-circle-outline" size={20} color="#000" />
                  <Text style={styles.btnText}>Continuar de onde parei</Text>
                </Pressable>
              </>
            ) : (
              <>
                <Text style={styles.subtitle}>
                  Responda 32 perguntas e receba um plano de acao personalizado para seu lar.
                </Text>

                <Animated.View entering={ZoomIn.delay(220).duration(380)} style={styles.startCard}>
                  <View style={styles.startIconWrap}>
                    <LinearGradient
                      colors={[Colors.accent + '30', Colors.accent + '10']}
                      style={styles.startIconGlow}
                    />
                    <View style={styles.startIconBg}>
                      <Ionicons name="home-outline" size={38} color={Colors.accent} />
                    </View>
                  </View>

                  <Text style={styles.startTitle}>Novo Projeto de Seguranca</Text>

                  <View style={styles.featureList}>
                    <View style={styles.featureItem}>
                      <View style={[styles.featureDot, { backgroundColor: Colors.accent }]} />
                      <Text style={styles.featureText}>
                        5 categorias de seguranca avaliadas com 32 perguntas
                      </Text>
                    </View>
                    <View style={styles.featureItem}>
                      <View style={[styles.featureDot, { backgroundColor: '#D4AF37' }]} />
                      <Text style={styles.featureText}>
                        Plano de acao com prioridades, produtos e custos estimados
                      </Text>
                    </View>
                    <View style={styles.featureItem}>
                      <View style={[styles.featureDot, { backgroundColor: Colors.success }]} />
                      <Text style={styles.featureText}>
                        Relatorio PDF profissional para compartilhar ou imprimir
                      </Text>
                    </View>
                  </View>
                </Animated.View>

                <Pressable
                  onPress={handleClose}
                  style={({ pressed }) => [styles.btnTeal, pressed && { opacity: 0.85 }]}
                >
                  <Ionicons name="clipboard-outline" size={20} color="#000" />
                  <Text style={styles.btnText}>Iniciar Diagnostico</Text>
                </Pressable>
              </>
            )}

            <Pressable onPress={handleClose} style={styles.skipBtn}>
              <Text style={styles.skipText}>Fechar</Text>
            </Pressable>
          </Animated.View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.72)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  sheetGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 160,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 4,
  },
  content: {
    paddingHorizontal: 22,
    paddingTop: 12,
    gap: 14,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.accent + '40',
  },
  greetingLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '500' as const,
    letterSpacing: 0.3,
  },
  greetingTitle: {
    fontSize: 20,
    fontWeight: '800' as const,
    color: Colors.text,
    marginTop: 1,
  },
  closeX: {
    padding: 4,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
  },

  statsCard: {
    backgroundColor: Colors.card,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#D4AF3730',
    gap: 12,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  scoreIconBg: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  scoreLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '500' as const,
  },
  scoreValue: {
    fontSize: 15,
    fontWeight: '700' as const,
    marginTop: 2,
  },
  scoreBadge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  scoreBadgeNum: {
    fontSize: 17,
    fontWeight: '800' as const,
  },
  scoreBadgeSign: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 5,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
  },
  progressBlock: {
    gap: 8,
  },
  progressLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  progressLabelText: {
    fontSize: 12,
    color: Colors.textSecondary,
    flex: 1,
  },
  progressCount: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  progressTrack: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  actionStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  actionStatusIconBg: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: Colors.success + '18',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionStatusText: {
    fontSize: 13,
    color: Colors.success,
    fontWeight: '600' as const,
  },

  startCard: {
    backgroundColor: Colors.card,
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.accent + '30',
    alignItems: 'center',
    gap: 14,
  },
  startIconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  startIconGlow: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  startIconBg: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: Colors.accent + '18',
    borderWidth: 1.5,
    borderColor: Colors.accent + '35',
    justifyContent: 'center',
    alignItems: 'center',
  },
  startTitle: {
    fontSize: 16,
    fontWeight: '800' as const,
    color: Colors.text,
    textAlign: 'center',
  },
  featureList: {
    width: '100%',
    gap: 10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  featureDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginTop: 5,
    flexShrink: 0,
  },
  featureText: {
    fontSize: 13,
    color: Colors.textSecondary,
    flex: 1,
    lineHeight: 19,
  },

  btnGold: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#D4AF37',
    borderRadius: 14,
    paddingVertical: 15,
  },
  btnTeal: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.accent,
    borderRadius: 14,
    paddingVertical: 15,
  },
  btnText: {
    fontSize: 15,
    fontWeight: '800' as const,
    color: '#000',
  },
  skipBtn: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  skipText: {
    fontSize: 13,
    color: Colors.textMuted,
  },
});
