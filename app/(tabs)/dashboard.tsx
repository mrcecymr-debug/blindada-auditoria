import React from 'react';
import {
  StyleSheet, Text, View, ScrollView, Platform, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import Colors from '@/constants/colors';
import { useAudit } from '@/lib/audit-context';
import { CATEGORIES, getStatusColor, getCategoryColor } from '@/lib/audit-data';
import FlowNavHint from '@/components/FlowNavHint';

function ScoreGauge({ percentage, classification }: { percentage: number; classification: string }) {
  const getColor = () => {
    if (percentage >= 80) return Colors.riskColors.excelente;
    if (percentage >= 60) return Colors.riskColors.bom;
    if (percentage >= 40) return Colors.riskColors.moderado;
    if (percentage >= 20) return Colors.riskColors.atencao;
    return Colors.riskColors.critico;
  };
  const color = getColor();

  return (
    <Animated.View entering={FadeInUp.duration(600)} style={styles.gaugeContainer}>
      <LinearGradient
        colors={[Colors.primaryLight, Colors.surface]}
        style={styles.gaugeCard}
      >
        <Text style={styles.gaugeLabel}>Pontuacao de Seguranca</Text>
        <View style={styles.gaugeCircle}>
          <View style={[styles.gaugeRing, { borderColor: color + '30' }]}>
            <View style={[styles.gaugeInner, { borderColor: color }]}>
              <Text style={[styles.gaugeValue, { color }]}>{percentage}</Text>
              <Text style={styles.gaugeMax}>/100</Text>
            </View>
          </View>
        </View>
        <View style={[styles.classificationBadge, { backgroundColor: color + '20' }]}>
          <View style={[styles.classificationDot, { backgroundColor: color }]} />
          <Text style={[styles.classificationText, { color }]}>{classification}</Text>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

function CategoryBar({ category, percentage, status, categoryKey, index }: {
  category: string; percentage: number; status: string; categoryKey: string; index: number;
}) {
  const color = getCategoryColor(categoryKey);
  const statusColor = getStatusColor(status);
  const catInfo = CATEGORIES.find(c => c.key === categoryKey);

  return (
    <Animated.View entering={FadeInDown.delay(index * 100).duration(400)} style={styles.barContainer}>
      <View style={styles.barHeader}>
        <View style={styles.barLeft}>
          <View style={[styles.barIcon, { backgroundColor: color + '20' }]}>
            <Ionicons name={catInfo?.icon as any || 'shield-outline'} size={18} color={color} />
          </View>
          <Text style={styles.barCategory}>{category}</Text>
        </View>
        <View style={[styles.statusTag, { backgroundColor: statusColor + '20' }]}>
          <Text style={[styles.statusText, { color: statusColor }]}>{status}</Text>
        </View>
      </View>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${percentage}%`, backgroundColor: color }]} />
      </View>
      <Text style={styles.barPercent}>{percentage}%</Text>
    </Animated.View>
  );
}

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const { score, answeredCount, totalCount } = useAudit();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.primary, Colors.background]}
        style={[styles.header, { paddingTop: Platform.OS === 'web' ? 67 : insets.top }]}
      >
        <View style={styles.logoRow}>
          <Image
            source={require('@/assets/images/logo-casa-blindada.jpg')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Painel de Risco</Text>
            <Text style={styles.headerSubtitle}>
              {answeredCount === 0 ? 'Responda o diagnostico para ver os resultados' :
                `Baseado em ${answeredCount} de ${totalCount} respostas`}
            </Text>
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
        <ScoreGauge percentage={score.percentage} classification={score.classification} />

        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <View style={styles.summaryRow}>
            <View style={[styles.summaryCard, { backgroundColor: Colors.accent + '15' }]}>
              <Ionicons name="checkmark-circle" size={24} color={Colors.accent} />
              <Text style={styles.summaryValue}>{score.totalScore}</Text>
              <Text style={styles.summaryLabel}>Pontos</Text>
            </View>
            <View style={[styles.summaryCard, { backgroundColor: Colors.info + '15' }]}>
              <Ionicons name="stats-chart" size={24} color={Colors.info} />
              <Text style={styles.summaryValue}>{score.maxScore}</Text>
              <Text style={styles.summaryLabel}>Maximo</Text>
            </View>
            <View style={[styles.summaryCard, { backgroundColor: Colors.warning + '15' }]}>
              <Ionicons name="alert-circle" size={24} color={Colors.warning} />
              <Text style={styles.summaryValue}>{score.categories.filter(c => c.status === 'CRITICO').length}</Text>
              <Text style={styles.summaryLabel}>Criticos</Text>
            </View>
          </View>
        </Animated.View>

        <View style={styles.sectionHeader}>
          <Ionicons name="bar-chart-outline" size={18} color={Colors.textSecondary} />
          <Text style={styles.sectionTitle}>Analise por Categoria</Text>
        </View>

        {score.categories.map((cat, idx) => (
          <CategoryBar
            key={cat.categoryKey}
            category={cat.category}
            percentage={cat.percentage}
            status={cat.status}
            categoryKey={cat.categoryKey}
            index={idx}
          />
        ))}

        {answeredCount === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="clipboard-outline" size={48} color={Colors.textMuted} />
            <Text style={styles.emptyText}>Nenhuma resposta registrada</Text>
            <Text style={styles.emptySubtext}>Preencha o diagnostico na aba anterior</Text>
          </View>
        )}

        {answeredCount > 0 && (
          <FlowNavHint
            nextTab="/actions"
            nextLabel="Ações"
            message="Próximo passo: veja as ações recomendadas para melhorar sua segurança."
          />
        )}
      </ScrollView>
    </View>
  );
}

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
  gaugeContainer: {},
  gaugeCard: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  gaugeLabel: { fontSize: 14, color: Colors.textSecondary, marginBottom: 20 },
  gaugeCircle: { alignItems: 'center', justifyContent: 'center' },
  gaugeRing: {
    width: 140, height: 140, borderRadius: 70,
    borderWidth: 6,
    justifyContent: 'center', alignItems: 'center',
  },
  gaugeInner: {
    width: 116, height: 116, borderRadius: 58,
    borderWidth: 3,
    justifyContent: 'center', alignItems: 'center',
    backgroundColor: Colors.surface,
  },
  gaugeValue: { fontSize: 40, fontWeight: '800' as const },
  gaugeMax: { fontSize: 14, color: Colors.textMuted },
  classificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 20,
    gap: 8,
  },
  classificationDot: { width: 8, height: 8, borderRadius: 4 },
  classificationText: { fontSize: 13, fontWeight: '700' as const, letterSpacing: 0.5 },
  summaryRow: {
    flexDirection: 'row',
    gap: 10,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 6,
  },
  summaryValue: { fontSize: 22, fontWeight: '700' as const, color: Colors.text },
  summaryLabel: { fontSize: 11, color: Colors.textSecondary },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  sectionTitle: { fontSize: 16, fontWeight: '600' as const, color: Colors.textSecondary },
  barContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  barHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  barLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  barIcon: {
    width: 36, height: 36, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center',
  },
  barCategory: { fontSize: 14, fontWeight: '600' as const, color: Colors.text, flex: 1 },
  statusTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: { fontSize: 11, fontWeight: '700' as const },
  barTrack: {
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: { height: 8, borderRadius: 4 },
  barPercent: {
    fontSize: 12, color: Colors.textSecondary, marginTop: 6, textAlign: 'right',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  emptyText: { fontSize: 16, fontWeight: '600' as const, color: Colors.textSecondary },
  emptySubtext: { fontSize: 13, color: Colors.textMuted, textAlign: 'center' },
});
