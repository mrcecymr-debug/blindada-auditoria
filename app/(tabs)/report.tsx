import React, { useState } from 'react';
import {
  StyleSheet, Text, View, ScrollView, Pressable, Platform,
  Modal, TextInput, FlatList, Image, Alert, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import Colors from '@/constants/colors';
import { useAudit, SavedAudit } from '@/lib/audit-context';
import { getStatusColor, getCategoryColor, calculateScore, QUESTIONS, generateActionItems, getTopVulnerabilities } from '@/lib/audit-data';
import { generateFullReportHTML } from '@/lib/pdf-report';
import HeaderActions from '@/components/HeaderActions';
import GuideModal from '@/components/GuideModal';

function SaveModal({ visible, onClose, onSave }: {
  visible: boolean; onClose: () => void; onSave: (name: string) => void;
}) {
  const [name, setName] = useState('');
  const insets = useSafeAreaInsets();

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      Alert.alert('Nome obrigatorio', 'Digite um nome para identificar este diagnostico.');
      return;
    }
    onSave(trimmed);
    setName('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable style={styles.saveModal}>
          <View style={styles.saveModalHandle} />
          <Text style={styles.saveModalTitle}>Salvar Diagnostico</Text>
          <Text style={styles.saveModalSubtitle}>
            Dê um nome para identificar esta auditoria
          </Text>
          <TextInput
            style={styles.saveInput}
            placeholder="Ex: Casa da Praia, Apartamento Centro..."
            placeholderTextColor={Colors.textMuted}
            value={name}
            onChangeText={setName}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={handleSave}
          />
          <View style={styles.saveModalButtons}>
            <Pressable
              onPress={onClose}
              style={[styles.saveModalBtn, styles.saveModalBtnCancel]}
            >
              <Text style={styles.saveModalBtnCancelText}>Cancelar</Text>
            </Pressable>
            <Pressable
              onPress={handleSave}
              style={[styles.saveModalBtn, styles.saveModalBtnSave]}
            >
              <Ionicons name="checkmark" size={18} color="#fff" />
              <Text style={styles.saveModalBtnSaveText}>Salvar</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function ReportDetail({ audit, onClose, allAudits }: { audit: SavedAudit; onClose: () => void; allAudits: SavedAudit[] }) {
  const insets = useSafeAreaInsets();
  const score = calculateScore(audit.answers);
  const date = new Date(audit.date);
  const dynamicActions = React.useMemo(() => generateActionItems(audit.answers), [audit.answers]);

  const vulnerabilities = React.useMemo(() => getTopVulnerabilities(audit.answers, 5), [audit.answers]);

  const evolutionData = React.useMemo(() => {
    return [...allAudits]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((a) => ({
        id: a.id,
        name: a.name,
        date: new Date(a.date),
        percentage: a.percentage,
        classification: a.classification,
        isCurrent: a.id === audit.id,
      }));
  }, [allAudits, audit.id]);

  const timeline = [
    { week: 'Semana 1', days: 'Dias 1-7', task: 'Fechaduras + sensores porta/janela' },
    { week: 'Semana 2', days: 'Dias 8-14', task: 'Iluminacao externa + camera entrada' },
    { week: 'Semana 3', days: 'Dias 15-21', task: 'Alarme monitorado (agendamento tecnico)' },
    { week: 'Semana 4', days: 'Dias 22-30', task: 'Reforcos estruturais + testes' },
  ];

  const answeredQuestions = QUESTIONS.filter(q => audit.answers[q.code]?.answer);

  const [generatingPDF, setGeneratingPDF] = useState(false);

  const handleGeneratePDF = async () => {
    try {
      setGeneratingPDF(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const isWeb = Platform.OS === 'web';
      const html = generateFullReportHTML(audit, allAudits, isWeb ? 'browser' : 'webkit');

      if (isWeb) {
        const blob = new Blob([html], { type: 'text/html' });
        const blobUrl = URL.createObjectURL(blob);
        const iframe = document.createElement('iframe');
        iframe.style.position = 'fixed';
        iframe.style.top = '-10000px';
        iframe.style.left = '-10000px';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = 'none';
        document.body.appendChild(iframe);
        iframe.src = blobUrl;
        iframe.onload = () => {
          setTimeout(() => {
            try {
              iframe.contentWindow?.print();
            } catch (e) {
              const link = document.createElement('a');
              link.href = blobUrl;
              link.download = `Relatorio_${audit.name.replace(/\s+/g, '_')}.html`;
              link.click();
            }
            setTimeout(() => {
              document.body.removeChild(iframe);
              URL.revokeObjectURL(blobUrl);
            }, 1000);
          }, 500);
        };
        setGeneratingPDF(false);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        const { uri } = await Print.printToFileAsync({
          html,
          base64: false,
        });
        setGeneratingPDF(false);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        const canShare = await Sharing.isAvailableAsync();
        if (canShare) {
          await Sharing.shareAsync(uri, {
            mimeType: 'application/pdf',
            dialogTitle: `Relatorio - ${audit.name}`,
            UTI: 'com.adobe.pdf',
          });
        } else {
          Alert.alert('PDF Gerado', 'O relatorio foi salvo com sucesso.');
        }
        setTimeout(() => onClose(), 500);
      }
    } catch (error) {
      setGeneratingPDF(false);
      Alert.alert('Erro', 'Nao foi possivel gerar o PDF. Tente novamente.');
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.primary, Colors.background]}
        style={[styles.header, { paddingTop: Platform.OS === 'web' ? 67 : insets.top }]}
      >
        <View style={styles.headerRow}>
          <Pressable onPress={onClose} style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color={Colors.text} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle} numberOfLines={1}>{audit.name}</Text>
            <Text style={styles.headerSubtitle}>
              {date.toLocaleDateString('pt-BR')} - {audit.answeredCount}/{audit.totalCount} respostas
            </Text>
          </View>
          <Pressable
            onPress={handleGeneratePDF}
            disabled={generatingPDF}
            style={styles.pdfButton}
          >
            {generatingPDF ? (
              <ActivityIndicator size="small" color={Colors.accent} />
            ) : (
              <Ionicons name="document-text-outline" size={20} color={Colors.accent} />
            )}
          </Pressable>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, {
          paddingBottom: Platform.OS === 'web' ? 34 + 84 : 100,
        }]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.duration(400)}>
          <LinearGradient
            colors={[Colors.primaryLight, Colors.surface]}
            style={styles.reportHeader}
          >
            <View style={styles.reportLogoContainer}>
              <Image
                source={require('@/assets/images/logo-casa-blindada.jpg')}
                style={styles.reportLogo}
                resizeMode="contain"
              />
            </View>
            <View style={styles.reportDivider} />

            <View style={styles.reportMeta}>
              <View style={styles.reportMetaItem}>
                <Text style={styles.reportMetaLabel}>Data</Text>
                <Text style={styles.reportMetaValue}>{date.toLocaleDateString('pt-BR')}</Text>
              </View>
              <View style={styles.reportMetaItem}>
                <Text style={styles.reportMetaLabel}>Codigo</Text>
                <Text style={styles.reportMetaValue}>AUD-{audit.id.slice(-6)}</Text>
              </View>
              <View style={styles.reportMetaItem}>
                <Text style={styles.reportMetaLabel}>Progresso</Text>
                <Text style={styles.reportMetaValue}>{audit.answeredCount}/{audit.totalCount}</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <View style={styles.section}>
            <Text style={styles.sectionNumber}>01</Text>
            <Text style={styles.sectionTitle}>Resumo Executivo</Text>
            <View style={styles.executiveSummary}>
              <View style={styles.executiveRow}>
                <Text style={styles.executiveLabel}>Pontuacao</Text>
                <Text style={[styles.executiveValue, {
                  color: getStatusColor(score.percentage >= 60 ? 'BOM' : score.percentage >= 40 ? 'ATENCAO' : 'CRITICO'),
                }]}>{score.percentage}/100</Text>
              </View>
              <View style={styles.executiveRow}>
                <Text style={styles.executiveLabel}>Classificacao</Text>
                <Text style={[styles.executiveValue, {
                  color: getStatusColor(score.percentage >= 60 ? 'BOM' : score.percentage >= 40 ? 'ATENCAO' : 'CRITICO'),
                  fontSize: 13,
                }]}>{score.classification}</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <View style={styles.section}>
            <Text style={styles.sectionNumber}>02</Text>
            <Text style={styles.sectionTitle}>Analise por Categoria</Text>
            {score.categories.map((cat) => {
              const color = getCategoryColor(cat.categoryKey);
              const statusColor = getStatusColor(cat.status);
              return (
                <View key={cat.categoryKey} style={styles.catRow}>
                  <View style={[styles.catDot, { backgroundColor: color }]} />
                  <Text style={styles.catName}>{cat.category}</Text>
                  <View style={[styles.catStatusBadge, { backgroundColor: statusColor + '20' }]}>
                    <Text style={[styles.catStatusText, { color: statusColor }]}>{cat.percentage}%</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(400)}>
          <View style={styles.section}>
            <Text style={styles.sectionNumber}>03</Text>
            <Text style={styles.sectionTitle}>Respostas Registradas</Text>
            {answeredQuestions.length === 0 ? (
              <Text style={styles.emptySmallText}>Nenhuma resposta registrada</Text>
            ) : (
              answeredQuestions.map((q) => {
                const a = audit.answers[q.code];
                return (
                  <View key={q.code} style={styles.answerRow}>
                    <View style={styles.answerCodeBadge}>
                      <Text style={styles.answerCode}>{q.code}</Text>
                    </View>
                    <View style={styles.answerInfo}>
                      <Text style={styles.answerQuestion} numberOfLines={1}>{q.question}</Text>
                      <Text style={styles.answerValue} numberOfLines={1}>{a.answer}</Text>
                      {!!a.observation && (
                        <Text style={styles.answerObs} numberOfLines={2}>{a.observation}</Text>
                      )}
                    </View>
                  </View>
                );
              })
            )}
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(400)}>
          <View style={styles.section}>
            <Text style={styles.sectionNumber}>04</Text>
            <Text style={styles.sectionTitle}>Top 5 Vulnerabilidades Criticas</Text>
            {vulnerabilities.length === 0 ? (
              <View style={{ padding: 20, alignItems: 'center' }}>
                <Ionicons name="checkmark-circle-outline" size={40} color={Colors.success} />
                <Text style={{ color: Colors.text, fontSize: 14, textAlign: 'center', marginTop: 10 }}>Nenhuma vulnerabilidade identificada. Responda o diagnostico para gerar a analise.</Text>
              </View>
            ) : (
              vulnerabilities.map((v, idx) => (
                <View key={idx} style={styles.vulnRow}>
                  <View style={styles.vulnNumber}>
                    <Text style={styles.vulnNumberText}>{idx + 1}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.vulnText}>{v.question}</Text>
                    <Text style={styles.vulnAnswer}>{v.answer}</Text>
                  </View>
                  <Text style={styles.vulnPoints}>-{v.lostPoints}</Text>
                </View>
              ))
            )}
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(500).duration(400)}>
          <View style={styles.section}>
            <Text style={styles.sectionNumber}>05</Text>
            <Text style={styles.sectionTitle}>Cronograma de Implementacao</Text>
            {timeline.map((item, idx) => (
              <View key={idx} style={styles.timelineRow}>
                <View style={styles.timelineLine}>
                  <View style={[styles.timelineDot, idx === 0 && { backgroundColor: Colors.accent }]} />
                  {idx < timeline.length - 1 && <View style={styles.timelineConnector} />}
                </View>
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineWeek}>{item.week}</Text>
                  <Text style={styles.timelineDays}>{item.days}</Text>
                  <Text style={styles.timelineTask}>{item.task}</Text>
                </View>
              </View>
            ))}
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(600).duration(400)}>
          <View style={styles.section}>
            <Text style={styles.sectionNumber}>06</Text>
            <Text style={styles.sectionTitle}>Plano de Acao</Text>
            {dynamicActions.length === 0 && (
              <View style={{ padding: 20, alignItems: 'center' }}>
                <Ionicons name="checkmark-circle-outline" size={40} color={Colors.success} />
                <Text style={{ color: Colors.text, fontSize: 14, textAlign: 'center', marginTop: 10 }}>Nenhuma vulnerabilidade critica identificada com base nas respostas do diagnostico.</Text>
              </View>
            )}
            {(() => {
              const p1 = dynamicActions.filter(i => i.priority === 1);
              const p2 = dynamicActions.filter(i => i.priority === 2);
              const p3 = dynamicActions.filter(i => i.priority === 3);
              let counter = 0;

              const renderGroup = (items: typeof dynamicActions, label: string, color: string, description: string) => {
                if (items.length === 0) return null;
                return (
                  <View key={label} style={{ marginTop: 12 }}>
                    <View style={styles.reportPriorityHeader}>
                      <View style={[styles.reportPriorityDot, { backgroundColor: color }]} />
                      <Text style={[styles.reportPriorityLabel, { color }]}>{label}</Text>
                      <Text style={styles.reportPriorityDesc}> - {description}</Text>
                      <View style={[styles.reportPriorityCount, { backgroundColor: color + '20' }]}>
                        <Text style={[styles.reportPriorityCountText, { color }]}>{items.length}</Text>
                      </View>
                    </View>
                    {items.map((item) => {
                      counter++;
                      const pColor = item.priority === 1 ? Colors.danger : item.priority === 2 ? Colors.warning : Colors.info;
                      const pLabel = item.priority === 1 ? 'CRITICO' : item.priority === 2 ? 'IMPORTANTE' : 'MELHORIA';
                      return (
                        <View key={`action-${counter}`} style={[styles.actionCard, { borderLeftColor: pColor }]}>
                          <View style={styles.actionCardHeader}>
                            <View style={styles.actionCardHeaderLeft}>
                              <View style={[styles.actionCardNum, { backgroundColor: pColor + '20' }]}>
                                <Text style={[styles.actionCardNumText, { color: pColor }]}>{counter}</Text>
                              </View>
                              <View style={[styles.actionCardBadge, { backgroundColor: pColor }]}>
                                <Text style={styles.actionCardBadgeText}>{pLabel}</Text>
                              </View>
                              <Text style={styles.actionCardCategory}>{item.category}</Text>
                            </View>
                            <Text style={styles.actionCardImpact}>{item.impact}</Text>
                          </View>
                          <Text style={styles.actionCardVuln}>{item.vulnerability}</Text>
                          {item.answerText && (
                            <View style={styles.actionCardAnswerRow}>
                              <Ionicons name="chatbubble-ellipses-outline" size={12} color={Colors.warning} />
                              <Text style={styles.actionCardAnswerLabel}>{item.questionLabel}:</Text>
                              <Text style={styles.actionCardAnswerValue}>{item.answerText}</Text>
                            </View>
                          )}
                          <Text style={styles.actionCardSolution}>{item.solution}</Text>
                          <View style={styles.actionCardDetails}>
                            <View style={styles.actionCardDetail}>
                              <Text style={styles.actionCardDetailLabel}>Produto</Text>
                              <Text style={styles.actionCardDetailValue}>{item.product}</Text>
                            </View>
                            <View style={styles.actionCardDetail}>
                              <Text style={styles.actionCardDetailLabel}>Investimento</Text>
                              <Text style={[styles.actionCardDetailValue, { color: Colors.accent }]}>{item.investment}</Text>
                            </View>
                            <View style={styles.actionCardDetail}>
                              <Text style={styles.actionCardDetailLabel}>Instalacao</Text>
                              <Text style={styles.actionCardDetailValue}>{item.installation}</Text>
                            </View>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                );
              };

              return (
                <>
                  {renderGroup(p1, 'Critico', Colors.danger, 'Implementar em 7 dias')}
                  {renderGroup(p2, 'Importante', Colors.warning, 'Implementar em 30 dias')}
                  {renderGroup(p3, 'Melhoria', Colors.info, 'Implementar em 90 dias')}
                </>
              );
            })()}
          </View>
        </Animated.View>

        {evolutionData.length >= 2 && (
          <Animated.View entering={FadeInDown.delay(700).duration(400)}>
            <View style={styles.section}>
              <Text style={styles.sectionNumber}>07</Text>
              <Text style={styles.sectionTitle}>Evolucao do Lar</Text>
              <Text style={styles.evolutionSubtitle}>
                Historico de pontuacoes de todas as auditorias salvas
              </Text>

              <View style={styles.evolutionChart}>
                {evolutionData.map((item, idx) => {
                  const barHeight = Math.max(8, (item.percentage / 100) * 120);
                  const barColor = item.percentage >= 80 ? Colors.riskColors.excelente
                    : item.percentage >= 60 ? Colors.riskColors.bom
                    : item.percentage >= 40 ? Colors.riskColors.moderado
                    : item.percentage >= 20 ? Colors.riskColors.atencao
                    : Colors.riskColors.critico;
                  return (
                    <View key={item.id} style={styles.evolutionBarContainer}>
                      <Text style={[styles.evolutionBarValue, { color: barColor }]}>
                        {item.percentage}
                      </Text>
                      <View style={styles.evolutionBarTrack}>
                        <View style={[
                          styles.evolutionBar,
                          {
                            height: barHeight,
                            backgroundColor: barColor,
                            opacity: item.isCurrent ? 1 : 0.6,
                          },
                        ]} />
                      </View>
                      <Text style={[
                        styles.evolutionBarDate,
                        item.isCurrent && { color: Colors.accent, fontWeight: '700' as const },
                      ]}>
                        {item.date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                      </Text>
                      {item.isCurrent && (
                        <View style={styles.evolutionCurrentDot} />
                      )}
                    </View>
                  );
                })}
              </View>

              <View style={styles.evolutionTimeline}>
                {evolutionData.map((item, idx) => {
                  const scoreColor = item.percentage >= 80 ? Colors.riskColors.excelente
                    : item.percentage >= 60 ? Colors.riskColors.bom
                    : item.percentage >= 40 ? Colors.riskColors.moderado
                    : item.percentage >= 20 ? Colors.riskColors.atencao
                    : Colors.riskColors.critico;
                  const prevPercentage = idx > 0 ? evolutionData[idx - 1].percentage : null;
                  const diff = prevPercentage !== null ? item.percentage - prevPercentage : null;
                  return (
                    <View key={item.id} style={[
                      styles.evolutionRow,
                      item.isCurrent && styles.evolutionRowCurrent,
                    ]}>
                      <View style={styles.evolutionTimelineLeft}>
                        <View style={[styles.evolutionDot, { backgroundColor: scoreColor }]} />
                        {idx < evolutionData.length - 1 && <View style={styles.evolutionConnector} />}
                      </View>
                      <View style={styles.evolutionContent}>
                        <View style={styles.evolutionRowHeader}>
                          <Text style={styles.evolutionDate}>
                            {item.date.toLocaleDateString('pt-BR')}
                          </Text>
                          <View style={styles.evolutionScoreRow}>
                            <Text style={[styles.evolutionScore, { color: scoreColor }]}>
                              {item.percentage}/100
                            </Text>
                            {diff !== null && (
                              <View style={[styles.evolutionDiffBadge, {
                                backgroundColor: diff > 0 ? Colors.success + '20' : diff < 0 ? Colors.danger + '20' : Colors.textMuted + '20',
                              }]}>
                                <Ionicons
                                  name={diff > 0 ? 'arrow-up' : diff < 0 ? 'arrow-down' : 'remove'}
                                  size={10}
                                  color={diff > 0 ? Colors.success : diff < 0 ? Colors.danger : Colors.textMuted}
                                />
                                <Text style={[styles.evolutionDiffText, {
                                  color: diff > 0 ? Colors.success : diff < 0 ? Colors.danger : Colors.textMuted,
                                }]}>
                                  {diff > 0 ? '+' : ''}{diff}
                                </Text>
                              </View>
                            )}
                          </View>
                        </View>
                        <Text style={styles.evolutionName} numberOfLines={1}>{item.name}</Text>
                        <Text style={[styles.evolutionClassification, { color: scoreColor }]}>
                          {item.classification}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          </Animated.View>
        )}

        <View style={styles.footer}>
          <Image
            source={require('@/assets/images/logo-casa-blindada.jpg')}
            style={styles.footerLogo}
            resizeMode="contain"
          />
          <Text style={styles.footerText}>Casa Blindada Auditoria v3.0</Text>
          <Text style={styles.footerText}>Marcelo Ribeiro</Text>
        </View>
      </ScrollView>
    </View>
  );
}

function ConfirmModal({ visible, title, message, confirmText, confirmColor, onConfirm, onCancel }: {
  visible: boolean; title: string; message: string; confirmText: string;
  confirmColor: string; onConfirm: () => void; onCancel: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.modalOverlay} onPress={onCancel}>
        <Pressable style={styles.confirmModal}>
          <Ionicons
            name={confirmColor === Colors.danger ? 'warning-outline' : 'information-circle-outline'}
            size={32}
            color={confirmColor}
          />
          <Text style={styles.confirmTitle}>{title}</Text>
          <Text style={styles.confirmMessage}>{message}</Text>
          <View style={styles.confirmButtons}>
            <Pressable onPress={onCancel} style={[styles.confirmBtn, styles.confirmBtnCancel]}>
              <Text style={styles.confirmBtnCancelText}>Cancelar</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                onConfirm();
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              }}
              style={[styles.confirmBtn, { backgroundColor: confirmColor }]}
            >
              <Text style={styles.confirmBtnActionText}>{confirmText}</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function SavedAuditCard({ audit, onView, onDelete, onLoad, index }: {
  audit: SavedAudit; onView: () => void; onDelete: () => void; onLoad: () => void; index: number;
}) {
  const date = new Date(audit.date);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showLoadConfirm, setShowLoadConfirm] = useState(false);
  const getScoreColor = (pct: number) => {
    if (pct >= 80) return Colors.riskColors.excelente;
    if (pct >= 60) return Colors.riskColors.bom;
    if (pct >= 40) return Colors.riskColors.moderado;
    if (pct >= 20) return Colors.riskColors.atencao;
    return Colors.riskColors.critico;
  };
  const scoreColor = getScoreColor(audit.percentage);

  return (
    <Animated.View entering={FadeInDown.delay(index * 60).duration(400)}>
      <View style={styles.auditCard}>
        <Pressable onPress={onView} style={styles.auditCardTop}>
          <View style={styles.auditCardLeft}>
            <View style={[styles.auditScoreCircle, { borderColor: scoreColor }]}>
              <Text style={[styles.auditScoreText, { color: scoreColor }]}>{audit.percentage}%</Text>
            </View>
            <View style={styles.auditCardInfo}>
              <Text style={styles.auditCardName} numberOfLines={1}>{audit.name}</Text>
              <Text style={styles.auditCardDate}>
                {date.toLocaleDateString('pt-BR')} {date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </Text>
              <View style={[styles.auditClassBadge, { backgroundColor: scoreColor + '20' }]}>
                <Text style={[styles.auditClassText, { color: scoreColor }]}>{audit.classification}</Text>
              </View>
            </View>
          </View>
          <View style={styles.auditCardMeta}>
            <Text style={styles.auditCardMetaText}>{audit.answeredCount}/{audit.totalCount}</Text>
            <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
          </View>
        </Pressable>
        <View style={styles.auditCardActions}>
          <Pressable onPress={() => setShowLoadConfirm(true)} style={styles.auditActionBtn}>
            <Ionicons name="download-outline" size={16} color={Colors.accent} />
            <Text style={[styles.auditActionText, { color: Colors.accent }]}>Carregar</Text>
          </Pressable>
          <Pressable onPress={() => setShowDeleteConfirm(true)} style={styles.auditActionBtn} testID="delete-audit">
            <Ionicons name="trash-outline" size={16} color={Colors.danger} />
            <Text style={[styles.auditActionText, { color: Colors.danger }]}>Excluir</Text>
          </Pressable>
        </View>
      </View>

      <ConfirmModal
        visible={showDeleteConfirm}
        title="Excluir Diagnostico"
        message={`Deseja excluir "${audit.name}"? Esta acao nao pode ser desfeita.`}
        confirmText="Excluir"
        confirmColor={Colors.danger}
        onConfirm={() => {
          setShowDeleteConfirm(false);
          onDelete();
        }}
        onCancel={() => setShowDeleteConfirm(false)}
      />
      <ConfirmModal
        visible={showLoadConfirm}
        title="Carregar Diagnostico"
        message={`Deseja carregar as respostas de "${audit.name}" no formulario atual? As respostas atuais serao substituidas.`}
        confirmText="Carregar"
        confirmColor={Colors.accent}
        onConfirm={() => {
          setShowLoadConfirm(false);
          onLoad();
        }}
        onCancel={() => setShowLoadConfirm(false)}
      />
    </Animated.View>
  );
}

export default function ReportScreen() {
  const insets = useSafeAreaInsets();
  const { answeredCount, totalCount, score, savedAudits, saveCurrentAudit, deleteSavedAudit, loadSavedAudit, clearAll } = useAudit();
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [viewingAudit, setViewingAudit] = useState<SavedAudit | null>(null);

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSave = (name: string) => {
    if (answeredCount === 0) {
      return;
    }
    saveCurrentAudit(name);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setShowSuccessModal(true);
    setTimeout(() => setShowSuccessModal(false), 1500);
  };

  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  if (viewingAudit) {
    return <ReportDetail audit={viewingAudit} onClose={() => setViewingAudit(null)} allAudits={savedAudits} />;
  }

  const trashButton = answeredCount > 0 ? (
    <Pressable onPress={() => setShowClearConfirm(true)} style={styles.clearButton}>
      <Ionicons name="trash-outline" size={20} color={Colors.warning} />
    </Pressable>
  ) : null;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.primary, Colors.background]}
        style={[styles.header, { paddingTop: Platform.OS === 'web' ? 44 : insets.top }]}
      >
        <View style={styles.headerRow}>
          <Image
            source={require('@/assets/images/logo-casa-blindada.jpg')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Relatorios</Text>
            <Text style={styles.headerSubtitle}>{savedAudits.length} diagnostico{savedAudits.length !== 1 ? 's' : ''} salvo{savedAudits.length !== 1 ? 's' : ''}</Text>
          </View>
          <HeaderActions onShowGuide={() => setShowGuide(true)} extraButtons={trashButton} />
        </View>
      </LinearGradient>
      <GuideModal visible={showGuide} onClose={() => setShowGuide(false)} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, {
          paddingBottom: Platform.OS === 'web' ? 34 + 84 : 100,
        }]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.duration(400)}>
          <Pressable
            onPress={() => {
              if (answeredCount === 0) {
                Alert.alert('Sem respostas', 'Responda pelo menos uma pergunta no diagnostico antes de salvar.');
                return;
              }
              setShowSaveModal(true);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }}
            style={styles.saveButton}
          >
            <LinearGradient
              colors={[Colors.accent, Colors.accentDark]}
              style={styles.saveButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Ionicons name="save-outline" size={22} color="#fff" />
              <View style={styles.saveButtonText}>
                <Text style={styles.saveButtonTitle}>Salvar Diagnostico Atual</Text>
                <Text style={styles.saveButtonSubtitle}>
                  {answeredCount} de {totalCount} perguntas respondidas - {score.percentage}%
                </Text>
              </View>
              <Ionicons name="add-circle-outline" size={24} color="rgba(255,255,255,0.7)" />
            </LinearGradient>
          </Pressable>
        </Animated.View>

        {savedAudits.length > 0 && (
          <View style={styles.listSection}>
            <View style={styles.listHeader}>
              <Ionicons name="folder-open-outline" size={18} color={Colors.textSecondary} />
              <Text style={styles.listTitle}>Diagnosticos Salvos</Text>
            </View>
            {savedAudits.map((audit, idx) => (
              <SavedAuditCard
                key={audit.id}
                audit={audit}
                index={idx}
                onView={() => setViewingAudit(audit)}
                onDelete={() => deleteSavedAudit(audit.id)}
                onLoad={() => loadSavedAudit(audit.id)}
              />
            ))}
          </View>
        )}

        {savedAudits.length === 0 && (
          <Animated.View entering={FadeIn.delay(200).duration(400)}>
            <View style={styles.emptyState}>
              <View style={styles.emptyIconContainer}>
                <Ionicons name="document-outline" size={48} color={Colors.textMuted} />
              </View>
              <Text style={styles.emptyTitle}>Nenhum diagnostico salvo</Text>
              <Text style={styles.emptySubtitle}>
                Preencha o formulario de diagnostico e salve para consultar depois
              </Text>
            </View>
          </Animated.View>
        )}
      </ScrollView>

      <SaveModal
        visible={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onSave={handleSave}
      />

      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View style={[styles.modalOverlay, { justifyContent: 'center' }]}>
          <View style={styles.successToast}>
            <Ionicons name="checkmark-circle" size={40} color={Colors.success} />
            <Text style={styles.successToastText}>Diagnostico salvo!</Text>
          </View>
        </View>
      </Modal>

      <ConfirmModal
        visible={showClearConfirm}
        title="Limpar Diagnostico Atual"
        message="Deseja apagar todas as respostas do formulario atual? Os diagnosticos salvos nao serao afetados."
        confirmText="Limpar"
        confirmColor={Colors.warning}
        onConfirm={() => {
          setShowClearConfirm(false);
          clearAll();
        }}
        onCancel={() => setShowClearConfirm(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  headerButtons: { flexDirection: 'row', gap: 8 },
  clearButton: {
    width: 38, height: 38, borderRadius: 10,
    backgroundColor: Colors.warning + '15',
    borderWidth: 1,
    borderColor: Colors.warning + '30',
    justifyContent: 'center', alignItems: 'center',
  },
  backButton: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: Colors.surfaceLight,
    justifyContent: 'center', alignItems: 'center',
    marginRight: 12,
  },
  pdfButton: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: Colors.accent + '18',
    justifyContent: 'center', alignItems: 'center',
    marginLeft: 10,
  },
  scrollView: { flex: 1 },
  scrollContent: { padding: 16, gap: 16 },
  saveButton: { borderRadius: 16, overflow: 'hidden' },
  saveButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    gap: 14,
  },
  saveButtonText: { flex: 1 },
  saveButtonTitle: { fontSize: 16, fontWeight: '700' as const, color: '#fff' },
  saveButtonSubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  listSection: { gap: 10 },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  listTitle: { fontSize: 16, fontWeight: '600' as const, color: Colors.textSecondary },
  auditCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  auditCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  auditCardLeft: { flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1 },
  auditScoreCircle: {
    width: 50, height: 50, borderRadius: 25,
    borderWidth: 3,
    justifyContent: 'center', alignItems: 'center',
    backgroundColor: Colors.card,
  },
  auditScoreText: { fontSize: 14, fontWeight: '800' as const },
  auditCardInfo: { flex: 1 },
  auditCardName: { fontSize: 16, fontWeight: '600' as const, color: Colors.text },
  auditCardDate: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  auditClassBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
  },
  auditClassText: { fontSize: 10, fontWeight: '700' as const },
  auditCardMeta: { alignItems: 'center', gap: 4 },
  auditCardMetaText: { fontSize: 11, color: Colors.textMuted },
  auditCardActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  auditActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
  },
  auditActionText: { fontSize: 13, fontWeight: '600' as const },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyIconContainer: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: Colors.surface,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 8,
  },
  emptyTitle: { fontSize: 18, fontWeight: '700' as const, color: Colors.textSecondary },
  emptySubtitle: { fontSize: 14, color: Colors.textMuted, textAlign: 'center', paddingHorizontal: 40 },
  emptySmallText: { fontSize: 13, color: Colors.textMuted, fontStyle: 'italic' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  saveModal: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  saveModalHandle: {
    width: 36, height: 4, borderRadius: 2,
    backgroundColor: Colors.border,
    marginBottom: 16,
  },
  saveModalTitle: { fontSize: 20, fontWeight: '700' as const, color: Colors.text },
  saveModalSubtitle: {
    fontSize: 14, color: Colors.textSecondary,
    textAlign: 'center', marginTop: 8, marginBottom: 20,
  },
  saveInput: {
    width: '100%',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 20,
  },
  saveModalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  saveModalBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    borderRadius: 12,
  },
  saveModalBtnCancel: {
    backgroundColor: Colors.card,
  },
  saveModalBtnCancelText: { fontSize: 15, fontWeight: '600' as const, color: Colors.textSecondary },
  saveModalBtnSave: {
    backgroundColor: Colors.accent,
  },
  saveModalBtnSaveText: { fontSize: 15, fontWeight: '600' as const, color: '#fff' },
  confirmModal: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
  },
  confirmTitle: { fontSize: 18, fontWeight: '700' as const, color: Colors.text, marginTop: 12 },
  confirmMessage: {
    fontSize: 14, color: Colors.textSecondary,
    textAlign: 'center', marginTop: 8, marginBottom: 20,
    lineHeight: 20,
  },
  confirmButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  confirmBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
  },
  confirmBtnCancel: {
    backgroundColor: Colors.card,
  },
  confirmBtnCancelText: { fontSize: 15, fontWeight: '600' as const, color: Colors.textSecondary },
  confirmBtnActionText: { fontSize: 15, fontWeight: '600' as const, color: '#fff' },
  successToast: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.success + '40',
  },
  successToastText: { fontSize: 16, fontWeight: '600' as const, color: Colors.text },
  reportHeader: {
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  reportLogoContainer: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  reportLogo: {
    width: 160,
    height: 160,
    borderRadius: 80,
  },
  reportDivider: {
    height: 1,
    backgroundColor: Colors.accent + '30',
    marginTop: 16,
    marginHorizontal: 20,
  },
  reportMeta: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 12,
  },
  reportMetaItem: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  reportMetaLabel: { fontSize: 10, color: Colors.textMuted },
  reportMetaValue: { fontSize: 13, fontWeight: '700' as const, color: Colors.text, marginTop: 4 },
  section: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionNumber: {
    fontSize: 12,
    fontWeight: '800' as const,
    color: Colors.accent,
    letterSpacing: 1,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 16,
  },
  executiveSummary: { gap: 12 },
  executiveRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  executiveLabel: { fontSize: 14, color: Colors.textSecondary },
  executiveValue: { fontSize: 20, fontWeight: '800' as const },
  catRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 10,
  },
  catDot: { width: 10, height: 10, borderRadius: 5 },
  catName: { fontSize: 13, color: Colors.text, flex: 1 },
  catStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  catStatusText: { fontSize: 12, fontWeight: '700' as const },
  answerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border + '40',
  },
  answerCodeBadge: {
    backgroundColor: Colors.surfaceLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 2,
  },
  answerCode: { fontSize: 11, fontWeight: '700' as const, color: Colors.textSecondary },
  answerInfo: { flex: 1 },
  answerQuestion: { fontSize: 12, color: Colors.textMuted },
  answerValue: { fontSize: 14, color: Colors.accent, fontWeight: '600' as const, marginTop: 2 },
  answerObs: { fontSize: 11, color: Colors.textMuted, fontStyle: 'italic', marginTop: 2 },
  vulnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
  },
  vulnNumber: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: Colors.danger + '20',
    justifyContent: 'center', alignItems: 'center',
  },
  vulnNumberText: { fontSize: 12, fontWeight: '700' as const, color: Colors.danger },
  vulnText: { fontSize: 13, color: Colors.text },
  vulnAnswer: { fontSize: 11, color: Colors.warning, marginTop: 2 },
  vulnPoints: { fontSize: 13, fontWeight: '700' as const, color: Colors.danger },
  timelineRow: {
    flexDirection: 'row',
    gap: 14,
  },
  timelineLine: {
    alignItems: 'center',
    width: 20,
  },
  timelineDot: {
    width: 12, height: 12, borderRadius: 6,
    backgroundColor: Colors.textMuted,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  timelineConnector: {
    width: 2,
    flex: 1,
    backgroundColor: Colors.border,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 20,
  },
  timelineWeek: { fontSize: 14, fontWeight: '700' as const, color: Colors.text },
  timelineDays: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  timelineTask: { fontSize: 13, color: Colors.textSecondary, marginTop: 4 },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 6,
  },
  footerLogo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginBottom: 4,
    opacity: 0.7,
  },
  footerText: { fontSize: 11, color: Colors.textMuted },
  actionCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  actionCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionCardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  actionCardNum: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionCardNumText: {
    fontSize: 12,
    fontWeight: '700' as const,
  },
  actionCardBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  actionCardBadgeText: {
    fontSize: 9,
    fontWeight: '700' as const,
    color: '#fff',
    letterSpacing: 0.5,
  },
  actionCardCategory: {
    fontSize: 10,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  actionCardImpact: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.success,
  },
  actionCardVuln: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.danger,
    marginBottom: 4,
  },
  actionCardAnswerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
    backgroundColor: Colors.warning + '10',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  actionCardAnswerLabel: { fontSize: 10, color: Colors.textMuted },
  actionCardAnswerValue: { fontSize: 11, color: Colors.warning, fontWeight: '600' as const, flex: 1 },
  actionCardSolution: {
    fontSize: 13,
    color: Colors.text,
    marginBottom: 8,
  },
  actionCardDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCardDetail: {
    gap: 2,
  },
  actionCardDetailLabel: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  actionCardDetailValue: {
    fontSize: 12,
    color: Colors.text,
    fontWeight: '500' as const,
  },
  reportPriorityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  reportPriorityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  reportPriorityLabel: {
    fontSize: 14,
    fontWeight: '700' as const,
  },
  reportPriorityDesc: {
    fontSize: 12,
    color: Colors.textMuted,
    flex: 1,
  },
  reportPriorityCount: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  reportPriorityCountText: {
    fontSize: 12,
    fontWeight: '700' as const,
  },
  evolutionSubtitle: {
    fontSize: 13,
    color: Colors.textMuted,
    marginBottom: 16,
  },
  evolutionChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 24,
    paddingHorizontal: 4,
    minHeight: 160,
  },
  evolutionBarContainer: {
    alignItems: 'center',
    flex: 1,
    maxWidth: 50,
  },
  evolutionBarValue: {
    fontSize: 11,
    fontWeight: '700' as const,
    marginBottom: 4,
  },
  evolutionBarTrack: {
    width: '100%',
    height: 120,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  evolutionBar: {
    width: '70%',
    borderRadius: 4,
    minHeight: 8,
  },
  evolutionBarDate: {
    fontSize: 9,
    color: Colors.textMuted,
    marginTop: 6,
    textAlign: 'center' as const,
  },
  evolutionCurrentDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.accent,
    marginTop: 4,
  },
  evolutionTimeline: {
    gap: 0,
  },
  evolutionRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  evolutionRowCurrent: {
    backgroundColor: Colors.accent + '10',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.accent + '30',
  },
  evolutionTimelineLeft: {
    width: 24,
    alignItems: 'center',
  },
  evolutionDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
  },
  evolutionConnector: {
    width: 2,
    flex: 1,
    backgroundColor: Colors.border,
    marginTop: 4,
  },
  evolutionContent: {
    flex: 1,
    marginLeft: 10,
  },
  evolutionRowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  evolutionDate: {
    fontSize: 13,
    color: Colors.text,
    fontWeight: '600' as const,
  },
  evolutionScoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  evolutionScore: {
    fontSize: 15,
    fontWeight: '700' as const,
  },
  evolutionDiffBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 2,
  },
  evolutionDiffText: {
    fontSize: 10,
    fontWeight: '700' as const,
  },
  evolutionName: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  evolutionClassification: {
    fontSize: 11,
    fontWeight: '600' as const,
    marginTop: 2,
  },
});
