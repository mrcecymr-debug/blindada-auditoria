import React, { useState, useCallback } from 'react';
import {
  StyleSheet, Text, View, ScrollView, Pressable, Modal,
  FlatList, TextInput, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Colors from '@/constants/colors';
import { useAudit } from '@/lib/audit-context';
import { QUESTIONS, CATEGORIES, getCategoryColor, AuditQuestion } from '@/lib/audit-data';

function CategorySection({ categoryKey, label, icon, questions }: {
  categoryKey: string; label: string; icon: string; questions: AuditQuestion[];
}) {
  const { answers, setAnswer, setObservation } = useAudit();
  const [expanded, setExpanded] = useState(false);
  const color = getCategoryColor(categoryKey);
  const answered = questions.filter(q => answers[q.code]?.answer).length;

  return (
    <View style={styles.categoryContainer}>
      <Pressable
        onPress={() => {
          setExpanded(!expanded);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }}
        style={[styles.categoryHeader, { borderLeftColor: color }]}
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
          <View style={[styles.progressBar, { backgroundColor: Colors.border }]}>
            <View style={[styles.progressFill, {
              width: `${(answered / questions.length) * 100}%`,
              backgroundColor: color,
            }]} />
          </View>
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

export default function SurveyScreen() {
  const insets = useSafeAreaInsets();
  const { answeredCount, totalCount, score } = useAudit();
  const progress = totalCount > 0 ? answeredCount / totalCount : 0;

  const groupedQuestions = CATEGORIES.map(cat => ({
    ...cat,
    questions: QUESTIONS.filter(q => q.categoryKey === cat.key),
  }));

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.primary, Colors.background]}
        style={[styles.header, { paddingTop: Platform.OS === 'web' ? 67 : insets.top }]}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Levantamento</Text>
            <Text style={styles.headerSubtitle}>{answeredCount} de {totalCount} perguntas</Text>
          </View>
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreText}>{score.percentage}%</Text>
          </View>
        </View>
        <View style={styles.headerProgress}>
          <View style={[styles.headerProgressBar, { backgroundColor: Colors.border }]}>
            <View style={[styles.headerProgressFill, { width: `${progress * 100}%` }]} />
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
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  headerTitle: { fontSize: 28, fontWeight: '700' as const, color: Colors.text },
  headerSubtitle: { fontSize: 14, color: Colors.textSecondary, marginTop: 4 },
  scoreCircle: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: Colors.accent + '20',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: Colors.accent,
  },
  scoreText: { fontSize: 16, fontWeight: '700' as const, color: Colors.accent },
  headerProgress: { marginTop: 12 },
  headerProgressBar: { height: 4, borderRadius: 2 },
  headerProgressFill: {
    height: 4, borderRadius: 2,
    backgroundColor: Colors.accent,
  },
  scrollView: { flex: 1 },
  scrollContent: { padding: 16, gap: 12 },
  categoryContainer: { borderRadius: 16, overflow: 'hidden' },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 16,
    borderLeftWidth: 4,
  },
  categoryLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  categoryIcon: {
    width: 40, height: 40, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center',
  },
  categoryInfo: { marginLeft: 12, flex: 1 },
  categoryTitle: { fontSize: 15, fontWeight: '600' as const, color: Colors.text },
  categoryCount: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  categoryRight: { alignItems: 'flex-end', gap: 8 },
  progressBar: { width: 60, height: 4, borderRadius: 2 },
  progressFill: { height: 4, borderRadius: 2 },
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
