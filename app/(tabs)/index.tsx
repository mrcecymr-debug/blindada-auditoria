import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  StyleSheet, Text, View, ScrollView, Pressable, Modal,
  FlatList, TextInput, Platform, Image,
} from 'react-native';
import { supabase } from "@/lib/supabase";
import { clearSessionToken } from "@/lib/session-guard";
import { Button } from "react-native";

import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown, FadeIn, useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { useFocusEffect, useRouter } from 'expo-router';
import FlowNavHint from '@/components/FlowNavHint';
import Colors from '@/constants/colors';
import { useAudit } from '@/lib/audit-context';
import { QUESTIONS, CATEGORIES, getCategoryColor, AuditQuestion, calculateScore } from '@/lib/audit-data';

type GuideItem = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  highlight?: boolean;
};

type GuideSection = {
  sectionTitle: string;
  sectionIcon: keyof typeof Ionicons.glyphMap;
  sectionColor: string;
  items: GuideItem[];
};

const GUIDE_SECTIONS: GuideSection[] = [
  {
    sectionTitle: 'Fluxo da Auditoria',
    sectionIcon: 'navigate-outline',
    sectionColor: Colors.accent,
    items: [
      {
        icon: 'clipboard-outline',
        title: 'Passo 1 - Diagnostico',
        description: 'Responda as perguntas de cada categoria de seguranca. Toque na categoria para expandir e selecione a opcao que melhor descreve seu imovel. Quanto mais perguntas responder, mais precisa sera a analise.',
      },
      {
        icon: 'bar-chart-outline',
        title: 'Passo 2 - Painel',
        description: 'Acompanhe sua pontuacao geral e por categoria no painel. O grafico mostra os pontos fortes e fracos da seguranca do seu imovel em tempo real conforme voce responde.',
      },
      {
        icon: 'shield-checkmark-outline',
        title: 'Passo 3 - Acoes',
        description: 'Consulte as acoes recomendadas geradas automaticamente com base nas suas respostas. Cada acao inclui prioridade, produto sugerido, estimativa de investimento e tipo de instalacao.',
      },
      {
        icon: 'document-text-outline',
        title: 'Passo 4 - Relatorio',
        description: 'Salve o diagnostico para criar um relatorio completo. Voce pode baixar o PDF da auditoria ou do plano de acao, e compartilhar via WhatsApp ou outras plataformas.',
      },
    ],
  },
  {
    sectionTitle: 'Categorias de Seguranca',
    sectionIcon: 'layers-outline',
    sectionColor: '#4D96FF',
    items: [
      {
        icon: 'home-outline',
        title: 'Perimetro e Estrutura',
        description: 'Avalia muros, cercas, portoes, grades e a integridade fisica do imovel. Pontos de entrada e barreiras externas.',
      },
      {
        icon: 'sunny-outline',
        title: 'Iluminacao e Visibilidade',
        description: 'Verifica iluminacao externa, sensores de presenca, pontos cegos e visibilidade do imovel a partir da rua.',
      },
      {
        icon: 'key-outline',
        title: 'Controle de Acesso',
        description: 'Analisa fechaduras, portoes automatizados, controle de chaves e acesso de pessoas ao imovel.',
      },
      {
        icon: 'videocam-outline',
        title: 'Sistemas Eletronicos',
        description: 'Cameras, alarmes, sensores, central de monitoramento e integracao de sistemas de seguranca eletronicos.',
      },
      {
        icon: 'people-outline',
        title: 'Fatores Humanos e Automacao',
        description: 'Rotinas de seguranca, treinamento de moradores, automacao residencial e procedimentos de emergencia.',
      },
    ],
  },
  {
    sectionTitle: 'Painel e Pontuacao',
    sectionIcon: 'speedometer-outline',
    sectionColor: Colors.success,
    items: [
      {
        icon: 'pie-chart-outline',
        title: 'Pontuacao Geral',
        description: 'O medidor circular mostra a porcentagem de seguranca do imovel (0-100%). A cor muda de vermelho (critico) a verde (excelente) conforme a pontuacao.',
      },
      {
        icon: 'stats-chart-outline',
        title: 'Analise por Categoria',
        description: 'Barras de progresso horizontais mostram a saude de cada area. Identifique rapidamente quais categorias precisam de mais atencao.',
      },
      {
        icon: 'refresh-outline',
        title: 'Atualizacao em Tempo Real',
        description: 'O painel atualiza automaticamente conforme voce muda as respostas na aba Diagnostico. Nenhuma acao adicional necessaria.',
      },
    ],
  },
  {
    sectionTitle: 'Plano de Acao',
    sectionIcon: 'rocket-outline',
    sectionColor: Colors.warning,
    items: [
      {
        icon: 'alert-circle-outline',
        title: 'Prioridade 1 - Critico',
        description: 'Acoes urgentes que devem ser implementadas em ate 7 dias. Vulnerabilidades graves que representam risco imediato.',
      },
      {
        icon: 'warning-outline',
        title: 'Prioridade 2 - Importante',
        description: 'Melhorias importantes para implementar em ate 30 dias. Corrigem falhas significativas na seguranca.',
      },
      {
        icon: 'construct-outline',
        title: 'Prioridade 3 - Melhoria',
        description: 'Aprimoramentos para implementar em ate 90 dias. Elevam o nivel geral de protecao do imovel.',
      },
      {
        icon: 'pricetag-outline',
        title: 'Detalhes de Cada Acao',
        description: 'Cada acao recomendada inclui: produto sugerido, estimativa de investimento (R$), tipo de instalacao (DIY ou profissional) e impacto na pontuacao.',
      },
    ],
  },
  {
    sectionTitle: 'Relatorios e PDF',
    sectionIcon: 'folder-open-outline',
    sectionColor: '#9B59B6',
    items: [
      {
        icon: 'save-outline',
        title: 'Salvar Auditoria',
        description: 'Na aba Relatorio, toque em "Salvar Diagnostico Atual" para guardar o estado atual. De um nome unico para cada auditoria.',
      },
      {
        icon: 'document-attach-outline',
        title: 'Gerar PDF Profissional',
        description: 'Abra um relatorio salvo e toque no botao PDF no topo. O relatorio inclui resumo executivo, analise por categoria, vulnerabilidades, cronograma e plano de acao completo.',
      },
      {
        icon: 'share-social-outline',
        title: 'Compartilhar',
        description: 'Apos gerar o PDF, compartilhe diretamente via WhatsApp, e-mail ou qualquer outro aplicativo instalado no seu dispositivo.',
      },
      {
        icon: 'trending-up-outline',
        title: 'Evolucao do Lar',
        description: 'Com 2 ou mais auditorias salvas, um grafico de evolucao aparece mostrando como a pontuacao mudou ao longo do tempo. Acompanhe o progresso das melhorias.',
      },
      {
        icon: 'trash-outline',
        title: 'Gerenciar Relatorios',
        description: 'Na lista de relatorios salvos, deslize para a esquerda ou toque e segure para excluir um relatorio que nao precisa mais.',
      },
    ],
  },
  {
    sectionTitle: 'Observacoes e Conta',
    sectionIcon: 'settings-outline',
    sectionColor: Colors.textSecondary,
    items: [
      {
        icon: 'create-outline',
        title: 'Campo de Observacao',
        description: 'Cada pergunta do Diagnostico possui um campo de observacao. Use para anotar detalhes do imovel, medidas, fotos de referencia ou qualquer informacao extra.',
      },
      {
        icon: 'log-out-outline',
        title: 'Sair da Conta',
        description: 'O botao de sair fica no canto superior direito da tela de Diagnostico. Ao sair, seus dados locais sao preservados para o proximo acesso.',
      },
      {
        icon: 'phone-portrait-outline',
        title: 'Sessao Unica',
        description: 'Sua conta permite apenas uma sessao ativa por vez. Se voce fizer login em outro dispositivo, o anterior sera desconectado automaticamente.',
      },
    ],
  },
  {
    sectionTitle: 'Dica Importante',
    sectionIcon: 'bulb-outline',
    sectionColor: '#D4AF37',
    items: [
      {
        icon: 'bulb-outline',
        title: 'Dica',
        description: 'Voce pode alterar qualquer resposta a qualquer momento na aba Diagnostico. O painel e as acoes serao atualizados automaticamente, porem voce devera SALVAR um NOVO relatorio com um nome diferente para essas suas NOVAS alteracoes. Use o campo de observacao em cada pergunta do Diagnostico para anotar detalhes extras.',
        highlight: true,
      },
    ],
  },
];

function GuideModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={guideStyles.overlay}>
        <Animated.View entering={FadeIn.duration(300)} style={[guideStyles.container, { paddingBottom: Platform.OS === 'web' ? 34 : Math.max(insets.bottom, 20) }]}>
          <View style={guideStyles.handle} />
          <View style={guideStyles.header}>
            <View style={guideStyles.headerLeft}>
              <View style={guideStyles.headerIcon}>
                <Ionicons name="book-outline" size={20} color={Colors.accent} />
              </View>
              <View>
                <Text style={guideStyles.headerTitle}>Central de Ajuda</Text>
                <Text style={guideStyles.headerSubtitle}>Tudo sobre o Casa Blindada</Text>
              </View>
            </View>
            <Pressable onPress={onClose} hitSlop={12}>
              <Ionicons name="close" size={24} color={Colors.textSecondary} />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={guideStyles.scroll}>
            {GUIDE_SECTIONS.map((section, sIdx) => (
              <View key={sIdx} style={guideStyles.sectionWrap}>
                <Animated.View entering={FadeInDown.delay(sIdx * 60).duration(300)}>
                  <View style={guideStyles.sectionHeader}>
                    <View style={[guideStyles.sectionDot, { backgroundColor: section.sectionColor }]} />
                    <Ionicons name={section.sectionIcon} size={16} color={section.sectionColor} />
                    <Text style={[guideStyles.sectionTitle, { color: section.sectionColor }]}>{section.sectionTitle}</Text>
                  </View>
                </Animated.View>
                {section.items.map((item, iIdx) => (
                  <Animated.View key={iIdx} entering={FadeInDown.delay(sIdx * 60 + iIdx * 40).duration(300)}>
                    <View style={[
                      guideStyles.stepCard,
                      item.highlight && { borderColor: '#D4AF37' + '50', backgroundColor: '#D4AF37' + '08' },
                    ]}>
                      <View style={[
                        guideStyles.stepIcon,
                        item.highlight && { backgroundColor: '#D4AF37' + '20' },
                      ]}>
                        <Ionicons name={item.icon} size={20} color={item.highlight ? '#D4AF37' : Colors.text} />
                      </View>
                      <View style={guideStyles.stepContent}>
                        <Text style={[guideStyles.stepTitle, item.highlight && { color: '#D4AF37' }]}>{item.title}</Text>
                        <Text style={guideStyles.stepDesc}>{item.description}</Text>
                      </View>
                    </View>
                  </Animated.View>
                ))}
              </View>
            ))}

            <View style={guideStyles.versionWrap}>
              <Text style={guideStyles.versionText}>Casa Blindada Auditoria v3.0</Text>
              <Text style={guideStyles.versionText}>MR ENG - Seguranca Estrategica</Text>
            </View>
          </ScrollView>

          <Pressable
            onPress={() => { onClose(); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
            style={guideStyles.closeBtn}
          >
            <Ionicons name="checkmark" size={18} color="#fff" />
            <Text style={guideStyles.closeBtnText}>Entendi</Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}

const guideStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '90%',
    paddingHorizontal: 20,
  },
  handle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginBottom: 16,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerIcon: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: Colors.accent + '15',
    justifyContent: 'center', alignItems: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '700' as const, color: Colors.text },
  headerSubtitle: { fontSize: 11, color: Colors.textSecondary, marginTop: 1 },
  scroll: { marginBottom: 12 },
  sectionWrap: { marginBottom: 8 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
    marginTop: 8,
    paddingLeft: 2,
  },
  sectionDot: {
    width: 6, height: 6, borderRadius: 3,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800' as const,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  stepCard: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 10,
  },
  stepIcon: {
    width: 38, height: 38, borderRadius: 10,
    backgroundColor: Colors.surfaceLight,
    justifyContent: 'center', alignItems: 'center',
    flexShrink: 0,
  },
  stepContent: { flex: 1 },
  stepTitle: { fontSize: 13, fontWeight: '700' as const, color: Colors.accent, marginBottom: 3 },
  stepDesc: { fontSize: 12, color: Colors.textSecondary, lineHeight: 18 },
  versionWrap: {
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    marginTop: 8,
  },
  versionText: { fontSize: 10, color: Colors.textMuted, marginTop: 2 },
  closeBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.accent,
    borderRadius: 14,
    paddingVertical: 14,
    marginBottom: 4,
  },
  closeBtnText: { fontSize: 16, fontWeight: '600' as const, color: '#fff' },
});

function CategorySection({ categoryKey, label, icon, questions, categoryPercentage }: {
  categoryKey: string; label: string; icon: string; questions: AuditQuestion[]; categoryPercentage: number;
}) {
  const { answers, setAnswer, setObservation } = useAudit();
  const [expanded, setExpanded] = useState(false);
  const color = getCategoryColor(categoryKey);
  const answered = questions.filter(q => answers[q.code]?.answer).length;
  const isLowScore = answered > 0 && categoryPercentage < 40;

  return (
    <View style={styles.categoryContainer}>
      <Pressable
        onPress={() => {
          setExpanded(!expanded);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }}
        style={[
          styles.categoryHeader,
          { borderLeftColor: color },
          isLowScore && styles.categoryHeaderAlert,
        ]}
      >
        <View style={styles.categoryLeft}>
          <View style={[styles.categoryIcon, { backgroundColor: color + '20' }]}>
            <Ionicons name={icon as any} size={20} color={color} />
          </View>
          <View style={styles.categoryInfo}>
            <Text style={styles.categoryTitle}>{label}</Text>
            <Text style={styles.categoryCount}>{answered}/{questions.length} respondidas</Text>
          </View>
        </View>
        <View style={styles.categoryRight}>
          <Ionicons
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={Colors.textSecondary}
          />
        </View>
      </Pressable>
      {expanded && (
        <View style={styles.questionsContainer}>
          {questions.map((q, idx) => (
            <QuestionItem key={q.code} question={q} index={idx} />
          ))}
        </View>
      )}
    </View>
  );
}

function QuestionItem({ question, index }: { question: AuditQuestion; index: number }) {
  const { answers, setAnswer, setObservation } = useAudit();
  const [showPicker, setShowPicker] = useState(false);
  const [showObs, setShowObs] = useState(false);
  const answer = answers[question.code];
  const hasAnswer = !!answer?.answer;

  return (
    <Animated.View entering={FadeInDown.delay(index * 40).duration(300)}>
      <View style={[styles.questionCard, hasAnswer && styles.questionCardAnswered]}>
        <View style={styles.questionHeader}>
          <View style={styles.questionCodeBadge}>
            <Text style={styles.questionCode}>{question.code}</Text>
          </View>
          <Text style={styles.questionWeight}>Peso: {question.weight}</Text>
        </View>
        <Text style={styles.questionText}>{question.question}</Text>

        <Pressable
          onPress={() => {
            setShowPicker(true);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
          style={[styles.answerButton, hasAnswer && styles.answerButtonFilled]}
        >
          <Text style={[styles.answerButtonText, hasAnswer && styles.answerButtonTextFilled]}
            numberOfLines={1}
          >
            {answer?.answer || 'Selecionar resposta'}
          </Text>
          <Ionicons
            name="chevron-down"
            size={16}
            color={hasAnswer ? Colors.accent : Colors.textSecondary}
          />
        </Pressable>

        <Pressable
          onPress={() => setShowObs(!showObs)}
          style={styles.obsToggle}
        >
          <Ionicons name="chatbubble-outline" size={14} color={Colors.textMuted} />
          <Text style={styles.obsToggleText}>
            {answer?.observation ? 'Editar observacao' : 'Adicionar observacao'}
          </Text>
        </Pressable>

        {showObs && (
          <TextInput
            style={styles.obsInput}
            placeholder="Digite sua observacao..."
            placeholderTextColor={Colors.textMuted}
            value={answer?.observation || ''}
            onChangeText={(text) => setObservation(question.code, text)}
            multiline
          />
        )}

        <Modal visible={showPicker} transparent animationType="slide">
          <Pressable style={styles.modalOverlay} onPress={() => setShowPicker(false)}>
            <Pressable style={styles.pickerContainer}>
              <View style={styles.pickerHeader}>
                <Text style={styles.pickerTitle}>{question.question}</Text>
                <Pressable onPress={() => setShowPicker(false)}>
                  <Ionicons name="close" size={24} color={Colors.text} />
                </Pressable>
              </View>
              <FlatList
                data={question.options}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => {
                      setAnswer(question.code, item);
                      setShowPicker(false);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    }}
                    style={[
                      styles.optionItem,
                      answer?.answer === item && styles.optionItemSelected,
                    ]}
                  >
                    <Text style={[
                      styles.optionText,
                      answer?.answer === item && styles.optionTextSelected,
                    ]}>{item}</Text>
                    {answer?.answer === item && (
                      <Ionicons name="checkmark-circle" size={20} color={Colors.accent} />
                    )}
                  </Pressable>
                )}
                style={styles.optionsList}
                showsVerticalScrollIndicator={false}
              />
            </Pressable>
          </Pressable>
        </Modal>
      </View>
    </Animated.View>
  );
}

function getProgressColor(progress: number): string {
  if (progress >= 1) return Colors.accent;
  if (progress >= 0.75) return Colors.success;
  if (progress >= 0.5) return '#FFD93D';
  if (progress >= 0.25) return Colors.warning;
  return Colors.danger;
}

function getProgressGradient(progress: number): [string, string] {
  if (progress >= 1) return ['#00C6AE', '#2ED573'];
  if (progress >= 0.75) return ['#2ED573', '#00C6AE'];
  if (progress >= 0.5) return ['#FFD93D', '#2ED573'];
  if (progress >= 0.25) return ['#FF9F43', '#FFD93D'];
  return ['#FF4757', '#FF9F43'];
}

function getProgressLabel(progress: number): string {
  if (progress >= 1) return 'Completo';
  if (progress >= 0.75) return 'Quase la';
  if (progress >= 0.5) return 'Bom andamento';
  if (progress >= 0.25) return 'Em progresso';
  if (progress > 0) return 'Iniciado';
  return 'Nao iniciado';
}

function getScoreColor(percentage: number): string {
  if (percentage >= 80) return Colors.riskColors?.excelente || '#2ED573';
  if (percentage >= 60) return Colors.riskColors?.bom || '#00C6AE';
  if (percentage >= 40) return '#FFD93D';
  if (percentage >= 20) return Colors.warning || '#FF9F43';
  return Colors.danger || '#FF4757';
}


  export default function SurveyScreen() {
    const insets = useSafeAreaInsets();

    const handleLogout = async () => {
      await clearSessionToken();
      await supabase.auth.signOut();
    };


  const router = useRouter();
  const { answeredCount, totalCount, score } = useAudit();
  const [showGuide, setShowGuide] = useState(false);
  const progress = totalCount > 0 ? answeredCount / totalCount : 0;

  const hasLeftTab = useRef(false);
  const [returnedAfterComplete, setReturnedAfterComplete] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (hasLeftTab.current && progress >= 1) {
        setReturnedAfterComplete(true);
      }
      return () => {
        if (progress >= 1) {
          hasLeftTab.current = true;
        }
      };
    }, [progress])
  );

  const arrowOpacity = useSharedValue(1);
  useEffect(() => {
    if (progress >= 1 && !returnedAfterComplete) {
      arrowOpacity.value = withRepeat(
        withSequence(
          withTiming(0.2, { duration: 500 }),
          withTiming(1, { duration: 500 })
        ),
        -1,
        false
      );
    }
  }, [progress, returnedAfterComplete]);
  const arrowAnimStyle = useAnimatedStyle(() => ({
    opacity: arrowOpacity.value,
  }));

  const categoryScoreMap = React.useMemo(() => {
    const map: Record<string, number> = {};
    for (const cat of score.categories) {
      map[cat.categoryKey] = cat.percentage;
    }
    return map;
  }, [score.categories]);

  const groupedQuestions = CATEGORIES.map(cat => ({
    ...cat,
    questions: QUESTIONS.filter(q => q.categoryKey === cat.key),
  }));

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.primary, Colors.background]}
        style={[styles.header, { paddingTop: Platform.OS === 'web' ? 44 : insets.top }]}
      >
        <View style={styles.logoRow}>
          <View style={styles.logoContainer}>
            <Image
              source={require('@/assets/images/logo-casa-blindada.jpg')}
              style={styles.logoImage}
              resizeMode="contain"
            />
            <View>
              <Text style={styles.logoTitle}>Casa Blindada</Text>
              <Text style={styles.logoSubtitle}>Segurança é estratégia</Text>
            </View>
          </View>

          <View style={styles.headerActions}>
            <Pressable
              onPress={() => {
                setShowGuide(true);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              style={({ pressed }) => [styles.headerIconBtn, styles.helpIconBtn, pressed && { opacity: 0.7 }]}
            >
              <Ionicons name="help-circle" size={20} color={Colors.accent} />
            </Pressable>

            <Pressable
              onPress={handleLogout}
              style={({ pressed }) => [styles.headerIconBtn, styles.logoutIconBtn, pressed && { opacity: 0.7 }]}
            >
              <Ionicons name="log-out-outline" size={20} color="#FF6B6B" />
            </Pressable>
          </View>
        </View>

        <View style={styles.headerContent}>
          <View style={styles.headerTitleRow}>
            <Text style={styles.headerTitle}>Diagnostico</Text>
            <View style={styles.progressInline}>
              <View style={styles.progressTrackInline}>
                <LinearGradient
                  colors={getProgressGradient(progress)}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.progressFillInline, { width: `${Math.max(progress * 100, 1)}%` }]}
                />
              </View>
              <Text style={[styles.progressInlineText, { color: getProgressColor(progress) }]}>
                {answeredCount}/{totalCount}
              </Text>
            </View>
          </View>
          <View style={styles.scoreRow}>
            <View style={styles.scoreCard}>
              <Text style={styles.scoreLabel}>Nota de Seguranca</Text>
              <Text style={[styles.scoreBigText, { color: getScoreColor(score.percentage) }]}>{score.percentage}%</Text>
            </View>
            <View style={[styles.scoreClassBadge, { backgroundColor: getScoreColor(score.percentage) + '20', borderColor: getScoreColor(score.percentage) + '40' }]}>
              <Text style={[styles.scoreClassText, { color: getScoreColor(score.percentage) }]}>{score.classification}</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, {
          paddingBottom: Platform.OS === 'web' ? 34 + 84 : 100,
        }]}
        showsVerticalScrollIndicator={false}
      >
        {groupedQuestions.map((cat) => (
          <CategorySection
            key={cat.key}
            categoryKey={cat.key}
            label={cat.label}
            icon={cat.icon}
            questions={cat.questions}
            categoryPercentage={categoryScoreMap[cat.key] || 0}
          />
        ))}
        {progress >= 1 && !returnedAfterComplete && (
          <Animated.View entering={FadeInDown.duration(400)} style={styles.completeBannerWrap}>
            <Pressable style={styles.nextStepBanner} onPress={() => router.push('/dashboard' as any)}>
              <Animated.View style={arrowAnimStyle}>
                <Ionicons name="arrow-forward-circle" size={24} color="#2ED573" />
              </Animated.View>
              <Text style={styles.nextStepText}>Diagnóstico completo! Veja o Painel de Risco e as Ações recomendadas.</Text>
            </Pressable>
          </Animated.View>
        )}
        {progress >= 1 && returnedAfterComplete && (
          <View style={styles.completeBannerWrap}>
            <View style={styles.editHintBanner}>
              <Ionicons name="create-outline" size={20} color={Colors.accent} />
              <Text style={styles.editHintText}>Se você preencheu algo errado, não se preocupe, altere agora e o sistema faz o resto.</Text>
            </View>
            <View style={{ marginTop: 10 }}>
              <FlowNavHint
                nextTab="/dashboard"
                nextLabel="Painel"
                message="Veja seus resultados no Painel de Risco."
              />
            </View>
          </View>
        )}
        {progress > 0 && progress < 1 && (
          <View style={styles.completeBannerWrap}>
            <FlowNavHint
              nextTab="/dashboard"
              nextLabel="Painel"
              message="Acompanhe seus resultados parciais no Painel de Risco."
            />
          </View>
        )}
      </ScrollView>
      <GuideModal visible={showGuide} onClose={() => setShowGuide(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 14,
  },
  logoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoImage: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.accent + '40',
  },
  logoTitle: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.text,
    letterSpacing: 0.3,
  },
  logoSubtitle: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  helpIconBtn: {
    backgroundColor: Colors.accent + '15',
    borderWidth: 1,
    borderColor: Colors.accent + '30',
  },
  logoutIconBtn: {
    backgroundColor: '#FF6B6B15',
    borderWidth: 1,
    borderColor: '#FF6B6B30',
  },
  headerContent: {
    marginTop: 12,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  headerTitle: { fontSize: 24, fontWeight: '700' as const, color: Colors.text },
  progressInline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressTrackInline: {
    width: 70,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.border,
    overflow: 'hidden',
  },
  progressFillInline: {
    height: 7,
    borderRadius: 4,
  },
  progressInlineText: {
    fontSize: 12,
    fontWeight: '700' as const,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  scoreCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  scoreLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
  },
  scoreBigText: {
    fontSize: 26,
    fontWeight: '800' as const,
  },
  scoreClassBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  scoreClassText: {
    fontSize: 11,
    fontWeight: '700' as const,
    textTransform: 'uppercase',
  },
  scrollView: { flex: 1 },
  scrollContent: { padding: 12, gap: 10 },
  completeBannerWrap: {
    marginTop: 16,
  },
  nextStepBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#2ED573' + '15',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#2ED573' + '40',
  },
  nextStepText: {
    flex: 1,
    fontSize: 13,
    color: '#2ED573',
    fontWeight: '600' as const,
  },
  editHintBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.accent + '12',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.accent + '30',
  },
  editHintText: {
    flex: 1,
    fontSize: 13,
    color: Colors.accent,
    fontWeight: '500' as const,
  },
  categoryContainer: { borderRadius: 14, overflow: 'hidden' },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 14,
    borderRadius: 14,
    borderLeftWidth: 4,
  },
  categoryHeaderAlert: {
    borderWidth: 1,
    borderColor: '#FF475740',
    backgroundColor: Colors.surface,
  },
  categoryLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  categoryIcon: {
    width: 36, height: 36, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center',
  },
  categoryInfo: { marginLeft: 10, flex: 1 },
  categoryTitle: { fontSize: 14, fontWeight: '600' as const, color: Colors.text },
  categoryCount: { fontSize: 11, color: Colors.textSecondary, marginTop: 1 },
  categoryRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  categoryScoreBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryScoreText: {
    fontSize: 13,
    fontWeight: '700' as const,
  },
  categoryPendingText: {
    fontSize: 13,
    color: Colors.textMuted,
    fontWeight: '600' as const,
  },
  questionsContainer: { paddingHorizontal: 8, paddingTop: 8, gap: 8 },
  questionCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  questionCardAnswered: { borderColor: Colors.accent + '40' },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  questionCodeBadge: {
    backgroundColor: Colors.surfaceLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  questionCode: { fontSize: 11, fontWeight: '700' as const, color: Colors.textSecondary },
  questionWeight: { fontSize: 11, color: Colors.textMuted },
  questionText: { fontSize: 15, color: Colors.text, fontWeight: '500' as const, marginBottom: 12 },
  answerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surfaceLight,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  answerButtonFilled: { borderColor: Colors.accent + '60', backgroundColor: Colors.accent + '10' },
  answerButtonText: { fontSize: 14, color: Colors.textSecondary, flex: 1, marginRight: 8 },
  answerButtonTextFilled: { color: Colors.accent },
  obsToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
  },
  obsToggleText: { fontSize: 12, color: Colors.textMuted },
  obsInput: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
    fontSize: 13,
    color: Colors.text,
    minHeight: 60,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  pickerContainer: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
    paddingBottom: 34,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  pickerTitle: { fontSize: 16, fontWeight: '600' as const, color: Colors.text, flex: 1, marginRight: 16 },
  optionsList: { paddingHorizontal: 12 },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginVertical: 2,
  },
  optionItemSelected: { backgroundColor: Colors.accent + '15' },
  optionText: { fontSize: 15, color: Colors.text },
  optionTextSelected: { color: Colors.accent, fontWeight: '600' as const },
});
