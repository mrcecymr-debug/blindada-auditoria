import React, { useRef, useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, ScrollView, Platform, Pressable, Image, Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeIn, ZoomIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import Colors from '@/constants/colors';
import { generateActionItems, ActionItem } from '@/lib/audit-data';
import { useAudit, getActionKey } from '@/lib/audit-context';
import FlowNavHint from '@/components/FlowNavHint';
import HeaderActions from '@/components/HeaderActions';
import GuideModal from '@/components/GuideModal';

function PriorityBadge({ priority }: { priority: number }) {
  const colors = {
    1: { bg: Colors.danger + '20', text: Colors.danger, label: 'Critico' },
    2: { bg: Colors.warning + '20', text: Colors.warning, label: 'Importante' },
    3: { bg: Colors.info + '20', text: Colors.info, label: 'Melhoria' },
  };
  const config = colors[priority as keyof typeof colors] || colors[3];

  return (
    <View style={[styles.priorityBadge, { backgroundColor: config.bg }]}>
      <Text style={[styles.priorityText, { color: config.text }]}>{config.label}</Text>
    </View>
  );
}

function ActionCard({
  item,
  index,
  completed,
  onToggle,
}: {
  item: ActionItem;
  index: number;
  completed: boolean;
  onToggle: (questionCode?: string, targetAnswer?: string) => void;
}) {
  const getCategoryIcon = (cat: string) => {
    const icons: Record<string, string> = {
      ACESSO: 'key-outline',
      ELETRONICA: 'hardware-chip-outline',
      ILUMINACAO: 'bulb-outline',
      PERIMETRO: 'shield-outline',
      AUTOMACAO: 'settings-outline',
      HUMANO: 'people-outline',
    };
    return icons[cat] || 'construct-outline';
  };

  const handleToggle = () => {
    Haptics.impactAsync(
      completed ? Haptics.ImpactFeedbackStyle.Light : Haptics.ImpactFeedbackStyle.Medium
    );
    onToggle(item.questionCode, item.targetAnswer);
  };

  return (
    <Animated.View entering={FadeInDown.delay(index * 80).duration(400)}>
      <View style={[styles.actionCard, completed && styles.actionCardDone]}>
        {completed && (
          <View style={styles.doneBanner}>
            <Ionicons name="checkmark-circle" size={14} color={Colors.success} />
            <Text style={styles.doneBannerText}>Implementado</Text>
          </View>
        )}

        <View style={[styles.actionHeader, completed && { opacity: 0.5 }]}>
          <View style={styles.actionLeft}>
            <View style={[
              styles.actionIconContainer,
              completed && { backgroundColor: Colors.success + '20' },
            ]}>
              <Ionicons
                name={completed ? 'checkmark-done-outline' : getCategoryIcon(item.category) as any}
                size={20}
                color={completed ? Colors.success : Colors.accent}
              />
            </View>
            <View style={styles.actionTitleGroup}>
              <Text style={styles.actionCategory}>{item.category}</Text>
              <Text style={[
                styles.actionVulnerability,
                completed && styles.textStrikethrough,
              ]}>
                {item.vulnerability}
              </Text>
            </View>
          </View>
          {!completed && <PriorityBadge priority={item.priority} />}
        </View>

        {!completed && item.answerText && (
          <View style={styles.answerRow}>
            <Ionicons name="chatbubble-ellipses-outline" size={13} color={Colors.warning} />
            <Text style={styles.answerLabel}>{item.questionLabel}:</Text>
            <Text style={styles.answerValue}>{item.answerText}</Text>
          </View>
        )}

        {!completed && item.targetAnswer && (
          <View style={styles.targetRow}>
            <Ionicons name="arrow-up-circle-outline" size={13} color={Colors.accent} />
            <Text style={styles.targetLabel}>Meta no diagnostico:</Text>
            <Text style={styles.targetValue}>{item.targetAnswer}</Text>
          </View>
        )}

        {!completed && (
          <>
            <View style={styles.actionDivider} />
            <View style={styles.actionBody}>
              <View style={styles.actionRow}>
                <Ionicons name="construct-outline" size={14} color={Colors.textMuted} />
                <Text style={styles.actionRowLabel}>Solucao:</Text>
                <Text style={styles.actionRowValue}>{item.solution}</Text>
              </View>
              <View style={styles.actionRow}>
                <Ionicons name="cube-outline" size={14} color={Colors.textMuted} />
                <Text style={styles.actionRowLabel}>Produto:</Text>
                <Text style={styles.actionRowValue}>{item.product}</Text>
              </View>
            </View>

            <View style={styles.actionFooter}>
              <View style={styles.actionStat}>
                <Text style={styles.actionStatLabel}>Investimento</Text>
                <Text style={styles.actionStatValue}>{item.investment}</Text>
              </View>
              <View style={styles.actionStatDivider} />
              <View style={styles.actionStat}>
                <Text style={styles.actionStatLabel}>Instalacao</Text>
                <Text style={styles.actionStatValue}>{item.installation}</Text>
              </View>
              <View style={styles.actionStatDivider} />
              <View style={styles.actionStat}>
                <Text style={styles.actionStatLabel}>Impacto</Text>
                <Text style={[styles.actionStatValue, { color: Colors.success }]}>{item.impact}</Text>
              </View>
            </View>
          </>
        )}

        <Pressable
          onPress={handleToggle}
          style={({ pressed }) => [
            styles.toggleButton,
            completed ? styles.toggleButtonDone : styles.toggleButtonPending,
            pressed && { opacity: 0.7 },
          ]}
        >
          <Ionicons
            name={completed ? 'arrow-undo-outline' : 'checkmark-circle-outline'}
            size={16}
            color={completed ? Colors.textMuted : Colors.success}
          />
          <Text style={[
            styles.toggleButtonText,
            completed ? styles.toggleButtonTextDone : styles.toggleButtonTextPending,
          ]}>
            {completed ? 'Desfazer' : 'Marcar como feito'}
          </Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}

function CelebrationModal({
  visible,
  scorePercentage,
  totalActions,
  phaseNumber,
  onSave,
  onNewCycle,
  onClose,
}: {
  visible: boolean;
  scorePercentage: number;
  totalActions: number;
  phaseNumber: number;
  onSave: () => void;
  onNewCycle: () => void;
  onClose: () => void;
}) {
  const [step, setStep] = useState<'celebrate' | 'newcycle'>('celebrate');
  const [saved, setSaved] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (visible) {
      setStep('celebrate');
      setSaved(false);
    }
  }, [visible]);

  const handleSave = () => {
    onSave();
    setSaved(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleNext = () => {
    setStep('newcycle');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleNewCycle = () => {
    onNewCycle();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent statusBarTranslucent>
      <View style={celebStyles.overlay}>
        <View style={[celebStyles.sheet, { paddingBottom: insets.bottom + 16 }]}>

          {step === 'celebrate' ? (
            <Animated.View entering={FadeIn.duration(500)} style={celebStyles.content}>
              <View style={celebStyles.trophyContainer}>
                <LinearGradient
                  colors={['#D4AF3730', '#D4AF3710']}
                  style={celebStyles.trophyGlow}
                />
                <View style={celebStyles.trophyIconBg}>
                  <Ionicons name="trophy" size={52} color="#D4AF37" />
                </View>
                <View style={celebStyles.starRow}>
                  <Text style={celebStyles.star}>★</Text>
                  <Text style={[celebStyles.star, celebStyles.starLg]}>★</Text>
                  <Text style={celebStyles.star}>★</Text>
                </View>
              </View>

              <Text style={celebStyles.titleGold}>Missao Cumprida!</Text>
              <Text style={celebStyles.subtitle}>
                Voce implementou todas as {totalActions} melhorias recomendadas
                para o seu lar. Isso e um marco real de seguranca.
              </Text>

              <View style={celebStyles.scoreBadge}>
                <View style={celebStyles.scoreBadgeLeft}>
                  <Ionicons name="shield-checkmark" size={22} color={Colors.accent} />
                  <View>
                    <Text style={celebStyles.scoreBadgeLabel}>Nivel de Seguranca Atual</Text>
                    <Text style={celebStyles.scoreBadgeValue}>{scorePercentage}% protegido</Text>
                  </View>
                </View>
                <View style={[celebStyles.scoreCircle, {
                  borderColor: scorePercentage >= 80 ? Colors.success : scorePercentage >= 60 ? Colors.accent : Colors.warning,
                }]}>
                  <Text style={[celebStyles.scoreCircleNum, {
                    color: scorePercentage >= 80 ? Colors.success : scorePercentage >= 60 ? Colors.accent : Colors.warning,
                  }]}>{scorePercentage}</Text>
                  <Text style={celebStyles.scoreCircleSign}>%</Text>
                </View>
              </View>

              <View style={celebStyles.infoBox}>
                <Ionicons name="information-circle-outline" size={18} color={Colors.accent} />
                <Text style={celebStyles.infoText}>
                  Salve um registro desta fase antes de comecar uma nova avaliacao.
                  Assim voce acompanha sua evolucao ao longo do tempo.
                </Text>
              </View>

              {!saved ? (
                <Pressable
                  onPress={handleSave}
                  style={({ pressed }) => [celebStyles.btnPrimary, pressed && { opacity: 0.85 }]}
                >
                  <Ionicons name="save-outline" size={18} color="#000" />
                  <Text style={celebStyles.btnPrimaryText}>
                    Salvar Relatorio da Fase {phaseNumber}
                  </Text>
                </Pressable>
              ) : (
                <Animated.View entering={ZoomIn.duration(300)} style={celebStyles.savedConfirm}>
                  <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
                  <Text style={celebStyles.savedConfirmText}>Relatorio salvo com sucesso!</Text>
                </Animated.View>
              )}

              <Pressable
                onPress={handleNext}
                style={({ pressed }) => [celebStyles.btnSecondary, pressed && { opacity: 0.7 }]}
              >
                <Text style={celebStyles.btnSecondaryText}>
                  {saved ? 'O que vem a seguir' : 'Pular esta etapa'}
                </Text>
                <Ionicons name="arrow-forward-outline" size={16} color={Colors.accent} />
              </Pressable>

              <Pressable onPress={onClose} style={celebStyles.closeBtn}>
                <Text style={celebStyles.closeBtnText}>Fechar</Text>
              </Pressable>
            </Animated.View>
          ) : (
            <Animated.View entering={FadeIn.duration(400)} style={celebStyles.content}>
              <View style={celebStyles.trophyContainer}>
                <LinearGradient
                  colors={[Colors.accent + '30', Colors.accent + '10']}
                  style={celebStyles.trophyGlow}
                />
                <View style={[celebStyles.trophyIconBg, { backgroundColor: Colors.accent + '20' }]}>
                  <Ionicons name="refresh-circle" size={52} color={Colors.accent} />
                </View>
              </View>

              <Text style={celebStyles.titleTeal}>Hora de Evoluir!</Text>
              <Text style={celebStyles.subtitle}>
                Com todas as melhorias implementadas, suas respostas de diagnostico
                agora refletem um nivel muito mais alto de seguranca.
              </Text>

              <View style={celebStyles.stepsList}>
                <View style={celebStyles.stepsItem}>
                  <View style={[celebStyles.stepsDot, { backgroundColor: Colors.accent }]} />
                  <Text style={celebStyles.stepsText}>
                    Responda as 32 perguntas novamente com a realidade atual
                  </Text>
                </View>
                <View style={celebStyles.stepsItem}>
                  <View style={[celebStyles.stepsDot, { backgroundColor: '#D4AF37' }]} />
                  <Text style={celebStyles.stepsText}>
                    O sistema ira revelar um novo conjunto de melhorias mais refinadas
                  </Text>
                </View>
                <View style={celebStyles.stepsItem}>
                  <View style={[celebStyles.stepsDot, { backgroundColor: Colors.success }]} />
                  <Text style={celebStyles.stepsText}>
                    Cada ciclo aproxima seu lar do nivel maximo de protecao
                  </Text>
                </View>
              </View>

              <View style={celebStyles.warningBox}>
                <Ionicons name="warning-outline" size={17} color={Colors.warning} />
                <Text style={celebStyles.warningText}>
                  O diagnostico atual e as acoes marcadas serao apagados.
                  {!saved ? ' Salve o relatorio antes se desejar guardar o historico.' : ' O relatorio ja foi salvo.'}
                </Text>
              </View>

              <Pressable
                onPress={handleNewCycle}
                style={({ pressed }) => [celebStyles.btnAccent, pressed && { opacity: 0.85 }]}
              >
                <Ionicons name="play-circle-outline" size={18} color="#000" />
                <Text style={celebStyles.btnPrimaryText}>Iniciar Nova Avaliacao</Text>
              </Pressable>

              <Pressable
                onPress={onClose}
                style={({ pressed }) => [celebStyles.btnSecondary, pressed && { opacity: 0.7 }]}
              >
                <Ionicons name="close-outline" size={16} color={Colors.textMuted} />
                <Text style={[celebStyles.btnSecondaryText, { color: Colors.textMuted }]}>
                  Fechar sem iniciar nova fase
                </Text>
              </Pressable>
            </Animated.View>
          )}
        </View>
      </View>
    </Modal>
  );
}

export default function ActionsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const {
    answers, answeredCount, completedActions, toggleAction,
    score, savedAudits, saveCurrentAudit, clearAll,
  } = useAudit();
  const scrollRef = useRef<ScrollView>(null);
  const sectionPositions = useRef<Record<string, number>>({});
  const [showGuide, setShowGuide] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const scrollToSection = (key: string) => {
    const y = sectionPositions.current[key];
    if (y !== undefined && scrollRef.current) {
      scrollRef.current.scrollTo({ y, animated: true });
    }
  };

  const handleSectionLayout = (key: string, event: any) => {
    sectionPositions.current[key] = event.nativeEvent.layout.y;
  };

  const actionItems = React.useMemo(() => generateActionItems(answers), [answers]);

  const priority1 = actionItems.filter(i => i.priority === 1);
  const priority2 = actionItems.filter(i => i.priority === 2);
  const priority3 = actionItems.filter(i => i.priority === 3);

  const hasActions = actionItems.length > 0;

  const completedCount = actionItems.filter(
    i => completedActions.has(getActionKey(i.category, i.vulnerability))
  ).length;
  const progressPct = actionItems.length > 0 ? (completedCount / actionItems.length) * 100 : 0;
  const allDone = actionItems.length > 0 && completedCount === actionItems.length;

  const prevCompletedRef = useRef(completedCount);
  useEffect(() => {
    const prev = prevCompletedRef.current;
    prevCompletedRef.current = completedCount;
    if (actionItems.length > 0 && completedCount === actionItems.length && prev < actionItems.length) {
      setTimeout(() => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setShowCelebration(true);
      }, 700);
    }
  }, [completedCount, actionItems.length]);

  const phaseNumber = savedAudits.length + 1;
  const phaseSaveName = `Fase ${phaseNumber} — ${score.percentage}% — Todas implementadas`;

  const handleSavePhase = () => {
    saveCurrentAudit(phaseSaveName);
  };

  const handleNewCycle = () => {
    setShowCelebration(false);
    clearAll();
    setTimeout(() => {
      router.replace('/(tabs)');
    }, 300);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.primary, Colors.background]}
        style={[styles.header, { paddingTop: Platform.OS === 'web' ? 20 : insets.top }]}
      >
        <View style={styles.logoRow}>
          <Image
            source={require('@/assets/images/logo-casa-blindada.jpg')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Plano de Acao</Text>
            <Text style={styles.headerSubtitle}>
              {hasActions
                ? `${actionItems.length} acoes identificadas no diagnostico`
                : 'Recomendacoes baseadas no seu diagnostico'}
            </Text>
          </View>
          <HeaderActions onShowGuide={() => setShowGuide(true)} />
        </View>
      </LinearGradient>
      <GuideModal visible={showGuide} onClose={() => setShowGuide(false)} />

      <CelebrationModal
        visible={showCelebration}
        scorePercentage={score.percentage}
        totalActions={actionItems.length}
        phaseNumber={phaseNumber}
        onSave={handleSavePhase}
        onNewCycle={handleNewCycle}
        onClose={() => setShowCelebration(false)}
      />

      <ScrollView
        ref={scrollRef}
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, {
          paddingBottom: Platform.OS === 'web' ? 70 : 100,
        }]}
        showsVerticalScrollIndicator={false}
      >
        {!hasActions && (
          <Animated.View entering={FadeInDown.duration(400)}>
            <View style={styles.emptyState}>
              <View style={styles.emptyIconContainer}>
                <Ionicons name={answeredCount === 0 ? 'clipboard-outline' : 'checkmark-circle-outline'} size={48} color={answeredCount === 0 ? Colors.textMuted : Colors.success} />
              </View>
              <Text style={styles.emptyTitle}>
                {answeredCount === 0
                  ? 'Nenhum diagnostico realizado'
                  : 'Nenhuma vulnerabilidade critica encontrada'}
              </Text>
              <Text style={styles.emptySubtitle}>
                {answeredCount === 0
                  ? 'Responda as perguntas na aba "Diagnostico" para receber recomendacoes personalizadas de seguranca.'
                  : 'Com base nas suas respostas, sua residencia esta com boa seguranca. Continue monitorando regularmente.'}
              </Text>
            </View>
          </Animated.View>
        )}

        {hasActions && (
          <Animated.View entering={FadeInDown.duration(400)}>
            <View style={styles.investmentCard}>
              <View style={styles.progressHeader}>
                <Text style={styles.investmentTitle}>Resumo de Acoes</Text>
                <View style={styles.progressBadge}>
                  <Text style={styles.progressBadgeText}>
                    {completedCount}/{actionItems.length} concluidas
                  </Text>
                </View>
              </View>

              {actionItems.length > 0 && (
                <View style={styles.progressBarTrack}>
                  <Animated.View
                    style={[
                      styles.progressBarFill,
                      {
                        width: `${progressPct}%` as any,
                        backgroundColor: progressPct === 100 ? Colors.success : Colors.accent,
                      },
                    ]}
                  />
                </View>
              )}

              {allDone && (
                <Animated.View entering={FadeIn.duration(400)}>
                  <Pressable
                    onPress={() => setShowCelebration(true)}
                    style={({ pressed }) => [styles.allDoneBanner, pressed && { opacity: 0.8 }]}
                  >
                    <Ionicons name="trophy" size={18} color="#D4AF37" />
                    <Text style={styles.allDoneText}>Todas as acoes implementadas!</Text>
                    <Ionicons name="chevron-forward" size={14} color="#D4AF37" />
                  </Pressable>
                </Animated.View>
              )}

              <Pressable
                style={({ pressed }) => [styles.investmentRow, styles.investmentRowBtn, pressed && { opacity: 0.6 }]}
                onPress={() => scrollToSection('p1')}
                disabled={priority1.length === 0}
              >
                <View style={[styles.investmentDot, { backgroundColor: Colors.danger }]} />
                <Text style={styles.investmentLabel}>Critico - Implementar em 7 dias</Text>
                <Text style={styles.investmentValue}>{priority1.length} {priority1.length === 1 ? 'acao' : 'acoes'}</Text>
                <Ionicons name="chevron-forward" size={14} color={Colors.textMuted} />
              </Pressable>
              <Pressable
                style={({ pressed }) => [styles.investmentRow, styles.investmentRowBtn, pressed && { opacity: 0.6 }]}
                onPress={() => scrollToSection('p2')}
                disabled={priority2.length === 0}
              >
                <View style={[styles.investmentDot, { backgroundColor: Colors.warning }]} />
                <Text style={styles.investmentLabel}>Importante - Implementar em 30 dias</Text>
                <Text style={styles.investmentValue}>{priority2.length} {priority2.length === 1 ? 'acao' : 'acoes'}</Text>
                <Ionicons name="chevron-forward" size={14} color={Colors.textMuted} />
              </Pressable>
              <Pressable
                style={({ pressed }) => [styles.investmentRow, styles.investmentRowBtn, pressed && { opacity: 0.6 }]}
                onPress={() => scrollToSection('p3')}
                disabled={priority3.length === 0}
              >
                <View style={[styles.investmentDot, { backgroundColor: Colors.info }]} />
                <Text style={styles.investmentLabel}>Melhoria - Implementar em 90 dias</Text>
                <Text style={styles.investmentValue}>{priority3.length} {priority3.length === 1 ? 'acao' : 'acoes'}</Text>
                <Ionicons name="chevron-forward" size={14} color={Colors.textMuted} />
              </Pressable>
              <View style={styles.investmentDivider} />
              <View style={styles.investmentRow}>
                <Ionicons name="list-outline" size={16} color={Colors.accent} />
                <Text style={[styles.investmentLabel, { color: Colors.accent, fontWeight: '700' as const }]}>Total de Acoes</Text>
                <Text style={[styles.investmentValue, { color: Colors.accent }]}>{actionItems.length}</Text>
              </View>
            </View>
          </Animated.View>
        )}

        {priority1.length > 0 && (
          <View
            style={styles.prioritySection}
            onLayout={(e) => handleSectionLayout('p1', e)}
          >
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionDot, { backgroundColor: Colors.danger }]} />
              <Text style={styles.sectionTitle}>Prioridade 1 - Implementar em 7 dias</Text>
            </View>
            {priority1.map((item, idx) => {
              const key = getActionKey(item.category, item.vulnerability);
              return (
                <ActionCard
                  key={`p1-${idx}`}
                  item={item}
                  index={idx}
                  completed={completedActions.has(key)}
                  onToggle={(qCode, tAnswer) => toggleAction(key, qCode, tAnswer)}
                />
              );
            })}
          </View>
        )}

        {priority2.length > 0 && (
          <View
            style={styles.prioritySection}
            onLayout={(e) => handleSectionLayout('p2', e)}
          >
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionDot, { backgroundColor: Colors.warning }]} />
              <Text style={styles.sectionTitle}>Prioridade 2 - Implementar em 30 dias</Text>
            </View>
            {priority2.map((item, idx) => {
              const key = getActionKey(item.category, item.vulnerability);
              return (
                <ActionCard
                  key={`p2-${idx}`}
                  item={item}
                  index={idx + priority1.length}
                  completed={completedActions.has(key)}
                  onToggle={(qCode, tAnswer) => toggleAction(key, qCode, tAnswer)}
                />
              );
            })}
          </View>
        )}

        {priority3.length > 0 && (
          <View
            style={styles.prioritySection}
            onLayout={(e) => handleSectionLayout('p3', e)}
          >
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionDot, { backgroundColor: Colors.info }]} />
              <Text style={styles.sectionTitle}>Prioridade 3 - Implementar em 90 dias</Text>
            </View>
            {priority3.map((item, idx) => {
              const key = getActionKey(item.category, item.vulnerability);
              return (
                <ActionCard
                  key={`p3-${idx}`}
                  item={item}
                  index={idx + priority1.length + priority2.length}
                  completed={completedActions.has(key)}
                  onToggle={(qCode, tAnswer) => toggleAction(key, qCode, tAnswer)}
                />
              );
            })}
          </View>
        )}

        {hasActions && (
          <FlowNavHint
            nextTab="/report"
            nextLabel="Relatório"
            message="Gere seu relatório profissional completo."
          />
        )}
      </ScrollView>
    </View>
  );
}

const celebStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: Colors.border,
    maxHeight: '92%',
  },
  content: {
    padding: 24,
    gap: 16,
    alignItems: 'center',
  },
  trophyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  trophyGlow: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  trophyIconBg: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#D4AF3720',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#D4AF3740',
  },
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
  },
  star: {
    fontSize: 16,
    color: '#D4AF37',
    opacity: 0.8,
  },
  starLg: {
    fontSize: 22,
    opacity: 1,
  },
  titleGold: {
    fontSize: 26,
    fontWeight: '800' as const,
    color: '#D4AF37',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  titleTeal: {
    fontSize: 26,
    fontWeight: '800' as const,
    color: Colors.accent,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 8,
  },
  scoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.accent + '12',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.accent + '30',
    padding: 14,
    width: '100%',
    gap: 12,
  },
  scoreBadgeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  scoreBadgeLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '500' as const,
  },
  scoreBadgeValue: {
    fontSize: 15,
    color: Colors.accent,
    fontWeight: '700' as const,
    marginTop: 2,
  },
  scoreCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  scoreCircleNum: {
    fontSize: 18,
    fontWeight: '800' as const,
  },
  scoreCircleSign: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 4,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: Colors.accent + '10',
    borderRadius: 12,
    padding: 12,
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.accent + '20',
  },
  infoText: {
    fontSize: 13,
    color: Colors.textSecondary,
    flex: 1,
    lineHeight: 20,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: Colors.warning + '10',
    borderRadius: 12,
    padding: 12,
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.warning + '25',
  },
  warningText: {
    fontSize: 13,
    color: Colors.textSecondary,
    flex: 1,
    lineHeight: 20,
  },
  stepsList: {
    width: '100%',
    gap: 12,
  },
  stepsItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  stepsDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
    flexShrink: 0,
  },
  stepsText: {
    fontSize: 14,
    color: Colors.text,
    flex: 1,
    lineHeight: 21,
  },
  savedConfirm: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.success + '15',
    borderRadius: 12,
    padding: 14,
    width: '100%',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.success + '35',
  },
  savedConfirmText: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.success,
  },
  btnPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#D4AF37',
    borderRadius: 14,
    paddingVertical: 15,
    width: '100%',
  },
  btnAccent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.accent,
    borderRadius: 14,
    paddingVertical: 15,
    width: '100%',
  },
  btnPrimaryText: {
    fontSize: 15,
    fontWeight: '800' as const,
    color: '#000',
  },
  btnSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    width: '100%',
  },
  btnSecondaryText: {
    fontSize: 14,
    color: Colors.accent,
    fontWeight: '600' as const,
  },
  closeBtn: {
    paddingVertical: 8,
  },
  closeBtnText: {
    fontSize: 13,
    color: Colors.textMuted,
  },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 6,
  },
  logoImage: {
    width: 38,
    height: 38,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.accent + '40',
  },
  headerTitle: { fontSize: 22, fontWeight: '700' as const, color: Colors.text },
  headerSubtitle: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  scrollView: { flex: 1 },
  scrollContent: { padding: 16, gap: 16 },
  emptyState: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 32,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    gap: 12,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  investmentCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  investmentTitle: { fontSize: 16, fontWeight: '700' as const, color: Colors.text },
  progressBadge: {
    backgroundColor: Colors.accent + '18',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  progressBadgeText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: Colors.accent,
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  allDoneBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#D4AF3715',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#D4AF3730',
  },
  allDoneText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: '#D4AF37',
    flex: 1,
  },
  investmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  investmentRowBtn: {
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRadius: 8,
  },
  investmentDot: { width: 8, height: 8, borderRadius: 4 },
  investmentLabel: { fontSize: 13, color: Colors.textSecondary, flex: 1 },
  investmentValue: { fontSize: 14, fontWeight: '600' as const, color: Colors.text },
  investmentDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 4,
  },
  prioritySection: { gap: 10 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  sectionDot: { width: 10, height: 10, borderRadius: 5 },
  sectionTitle: { fontSize: 14, fontWeight: '600' as const, color: Colors.textSecondary },
  actionCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 0,
  },
  actionCardDone: {
    borderColor: Colors.success + '40',
    backgroundColor: Colors.success + '08',
  },
  doneBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
    backgroundColor: Colors.success + '15',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignSelf: 'flex-start',
  },
  doneBannerText: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: Colors.success,
    letterSpacing: 0.5,
  },
  actionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  actionLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  actionIconContainer: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: Colors.accent + '15',
    justifyContent: 'center', alignItems: 'center',
  },
  actionTitleGroup: { flex: 1 },
  actionCategory: { fontSize: 11, color: Colors.textMuted, fontWeight: '600' as const },
  actionVulnerability: { fontSize: 15, fontWeight: '600' as const, color: Colors.text, marginTop: 2 },
  textStrikethrough: {
    textDecorationLine: 'line-through',
    color: Colors.textMuted,
  },
  answerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    backgroundColor: Colors.warning + '10',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  answerLabel: { fontSize: 11, color: Colors.textMuted, fontWeight: '500' as const },
  answerValue: { fontSize: 12, color: Colors.warning, fontWeight: '600' as const, flex: 1 },
  targetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
    backgroundColor: Colors.accent + '10',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  targetLabel: { fontSize: 11, color: Colors.textMuted, fontWeight: '500' as const },
  targetValue: { fontSize: 12, color: Colors.accent, fontWeight: '700' as const, flex: 1 },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priorityText: { fontSize: 11, fontWeight: '700' as const },
  actionDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 14,
  },
  actionBody: { gap: 8 },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionRowLabel: { fontSize: 12, color: Colors.textMuted, width: 60 },
  actionRowValue: { fontSize: 13, color: Colors.text, flex: 1 },
  actionFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 12,
  },
  actionStat: { flex: 1, alignItems: 'center' },
  actionStatDivider: {
    width: 1,
    height: 30,
    backgroundColor: Colors.border,
  },
  actionStatLabel: { fontSize: 10, color: Colors.textMuted, marginBottom: 4 },
  actionStatValue: { fontSize: 13, fontWeight: '700' as const, color: Colors.text },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  toggleButtonPending: {
    backgroundColor: Colors.success + '12',
    borderColor: Colors.success + '40',
  },
  toggleButtonDone: {
    backgroundColor: Colors.card,
    borderColor: Colors.border,
  },
  toggleButtonText: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
  toggleButtonTextPending: {
    color: Colors.success,
  },
  toggleButtonTextDone: {
    color: Colors.textMuted,
  },
});
