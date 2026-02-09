import React from 'react';
import {
  StyleSheet, Text, View, ScrollView, Pressable, Alert, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { useAudit } from '@/lib/audit-context';
import { getStatusColor, getCategoryColor } from '@/lib/audit-data';

export default function ReportScreen() {
  const insets = useSafeAreaInsets();
  const { score, answeredCount, totalCount, clearAll } = useAudit();

  const handleClear = () => {
    Alert.alert(
      'Limpar Auditoria',
      'Tem certeza que deseja apagar todas as respostas? Esta acao nao pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar', style: 'destructive',
          onPress: () => {
            clearAll();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          },
        },
      ],
    );
  };

  const vulnerabilities = [
    { text: 'Ausencia de sistema de alarme monitorado', points: -15 },
    { text: 'Fechaduras comuns na porta principal', points: -10 },
    { text: 'Muro baixo ou inexistente', points: -15 },
    { text: 'Janelas acessiveis sem grades', points: -10 },
    { text: 'Iluminacao externa inadequada', points: -8 },
  ];

  const timeline = [
    { week: 'Semana 1', days: 'Dias 1-7', task: 'Fechaduras + sensores porta/janela' },
    { week: 'Semana 2', days: 'Dias 8-14', task: 'Iluminacao externa + camera entrada' },
    { week: 'Semana 3', days: 'Dias 15-21', task: 'Alarme monitorado (agendamento tecnico)' },
    { week: 'Semana 4', days: 'Dias 22-30', task: 'Reforcos estruturais + testes' },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.primary, Colors.background]}
        style={[styles.header, { paddingTop: Platform.OS === 'web' ? 67 : insets.top }]}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>Relatorio</Text>
            <Text style={styles.headerSubtitle}>Resumo executivo da auditoria</Text>
          </View>
          <Pressable onPress={handleClear} style={styles.clearButton}>
            <Ionicons name="trash-outline" size={20} color={Colors.danger} />
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
            <View style={styles.reportBrand}>
              <Ionicons name="shield-checkmark" size={28} color={Colors.accent} />
              <Text style={styles.reportBrandText}>CASA BLINDADA</Text>
            </View>
            <Text style={styles.reportSubbrand}>Auditoria de Seguranca Residencial 2026</Text>

            <View style={styles.reportMeta}>
              <View style={styles.reportMetaItem}>
                <Text style={styles.reportMetaLabel}>Data</Text>
                <Text style={styles.reportMetaValue}>{new Date().toLocaleDateString('pt-BR')}</Text>
              </View>
              <View style={styles.reportMetaItem}>
                <Text style={styles.reportMetaLabel}>Codigo</Text>
                <Text style={styles.reportMetaValue}>AUD-2026-{Math.floor(Math.random() * 9000 + 1000)}</Text>
              </View>
              <View style={styles.reportMetaItem}>
                <Text style={styles.reportMetaLabel}>Progresso</Text>
                <Text style={styles.reportMetaValue}>{answeredCount}/{totalCount}</Text>
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
            <Text style={styles.sectionTitle}>Top 5 Vulnerabilidades Criticas</Text>
            {vulnerabilities.map((v, idx) => (
              <View key={idx} style={styles.vulnRow}>
                <View style={styles.vulnNumber}>
                  <Text style={styles.vulnNumberText}>{idx + 1}</Text>
                </View>
                <Text style={styles.vulnText}>{v.text}</Text>
                <Text style={styles.vulnPoints}>{v.points}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(400)}>
          <View style={styles.section}>
            <Text style={styles.sectionNumber}>04</Text>
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

        <Animated.View entering={FadeInDown.delay(500).duration(400)}>
          <View style={styles.section}>
            <Text style={styles.sectionNumber}>05</Text>
            <Text style={styles.sectionTitle}>Orcamento Total</Text>
            <View style={styles.budgetContainer}>
              <View style={styles.budgetRow}>
                <Text style={styles.budgetLabel}>Investimento Imediato (P1)</Text>
                <Text style={styles.budgetValue}>R$ 500-1.000</Text>
              </View>
              <View style={styles.budgetRow}>
                <Text style={styles.budgetLabel}>Melhorias Graduais (P2-3)</Text>
                <Text style={styles.budgetValue}>R$ 8.800-9.500</Text>
              </View>
              <View style={[styles.budgetDivider]} />
              <View style={styles.budgetRow}>
                <Text style={[styles.budgetLabel, { color: Colors.accent, fontWeight: '700' as const }]}>Custo Total</Text>
                <Text style={[styles.budgetValue, { color: Colors.accent, fontSize: 18 }]}>R$ 9.300-10.500</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Casa Blindada Auditoria v3.0</Text>
          <Text style={styles.footerText}>Validade: 6 meses</Text>
        </View>
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  headerTitle: { fontSize: 28, fontWeight: '700' as const, color: Colors.text },
  headerSubtitle: { fontSize: 14, color: Colors.textSecondary, marginTop: 4 },
  clearButton: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: Colors.danger + '15',
    justifyContent: 'center', alignItems: 'center',
  },
  scrollView: { flex: 1 },
  scrollContent: { padding: 16, gap: 16 },
  reportHeader: {
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  reportBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  reportBrandText: {
    fontSize: 20,
    fontWeight: '800' as const,
    color: Colors.text,
    letterSpacing: 2,
  },
  reportSubbrand: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 6,
    marginLeft: 38,
  },
  reportMeta: {
    flexDirection: 'row',
    marginTop: 20,
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
  vulnText: { fontSize: 13, color: Colors.text, flex: 1 },
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
  budgetContainer: { gap: 10 },
  budgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  budgetLabel: { fontSize: 13, color: Colors.textSecondary },
  budgetValue: { fontSize: 15, fontWeight: '700' as const, color: Colors.text },
  budgetDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 4,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 16,
    gap: 4,
  },
  footerText: { fontSize: 11, color: Colors.textMuted },
});
