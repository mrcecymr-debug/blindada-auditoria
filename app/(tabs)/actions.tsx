import React from 'react';
import {
  StyleSheet, Text, View, ScrollView, Pressable, Linking, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Colors from '@/constants/colors';
import { ACTION_ITEMS, ActionItem } from '@/lib/audit-data';

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

function ActionCard({ item, index }: { item: ActionItem; index: number }) {
  const getCategoryIcon = (cat: string) => {
    const icons: Record<string, string> = {
      ACESSO: 'key-outline',
      ELETRONICA: 'hardware-chip-outline',
      ILUMINACAO: 'bulb-outline',
      PERIMETRO: 'shield-outline',
      AUTOMACAO: 'settings-outline',
    };
    return icons[cat] || 'construct-outline';
  };

  return (
    <Animated.View entering={FadeInDown.delay(index * 80).duration(400)}>
      <View style={styles.actionCard}>
        <View style={styles.actionHeader}>
          <View style={styles.actionLeft}>
            <View style={styles.actionIconContainer}>
              <Ionicons name={getCategoryIcon(item.category) as any} size={20} color={Colors.accent} />
            </View>
            <View style={styles.actionTitleGroup}>
              <Text style={styles.actionCategory}>{item.category}</Text>
              <Text style={styles.actionVulnerability}>{item.vulnerability}</Text>
            </View>
          </View>
          <PriorityBadge priority={item.priority} />
        </View>

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
      </View>
    </Animated.View>
  );
}

export default function ActionsScreen() {
  const insets = useSafeAreaInsets();
  const priority1 = ACTION_ITEMS.filter(i => i.priority === 1);
  const priority2 = ACTION_ITEMS.filter(i => i.priority === 2);
  const priority3 = ACTION_ITEMS.filter(i => i.priority === 3);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.primary, Colors.background]}
        style={[styles.header, { paddingTop: Platform.OS === 'web' ? 67 : insets.top }]}
      >
        <Text style={styles.headerTitle}>Plano de Acao</Text>
        <Text style={styles.headerSubtitle}>Recomendacoes priorizadas de seguranca</Text>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, {
          paddingBottom: Platform.OS === 'web' ? 34 + 84 : 100,
        }]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.duration(400)}>
          <View style={styles.investmentCard}>
            <Text style={styles.investmentTitle}>Resumo de Investimento</Text>
            <View style={styles.investmentRow}>
              <View style={[styles.investmentDot, { backgroundColor: Colors.danger }]} />
              <Text style={styles.investmentLabel}>Prioridade 1 (7 dias)</Text>
              <Text style={styles.investmentValue}>R$ 500-1.000</Text>
            </View>
            <View style={styles.investmentRow}>
              <View style={[styles.investmentDot, { backgroundColor: Colors.warning }]} />
              <Text style={styles.investmentLabel}>Prioridade 2 (30 dias)</Text>
              <Text style={styles.investmentValue}>R$ 800-1.500</Text>
            </View>
            <View style={styles.investmentRow}>
              <View style={[styles.investmentDot, { backgroundColor: Colors.info }]} />
              <Text style={styles.investmentLabel}>Prioridade 3 (90 dias)</Text>
              <Text style={styles.investmentValue}>R$ 8.000+</Text>
            </View>
            <View style={styles.investmentDivider} />
            <View style={styles.investmentRow}>
              <Ionicons name="wallet-outline" size={16} color={Colors.accent} />
              <Text style={[styles.investmentLabel, { color: Colors.accent, fontWeight: '700' as const }]}>Total Estimado</Text>
              <Text style={[styles.investmentValue, { color: Colors.accent }]}>R$ 9.300-10.500</Text>
            </View>
          </View>
        </Animated.View>

        {priority1.length > 0 && (
          <View style={styles.prioritySection}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionDot, { backgroundColor: Colors.danger }]} />
              <Text style={styles.sectionTitle}>Prioridade 1 - Implementar em 7 dias</Text>
            </View>
            {priority1.map((item, idx) => (
              <ActionCard key={idx} item={item} index={idx} />
            ))}
          </View>
        )}

        {priority2.length > 0 && (
          <View style={styles.prioritySection}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionDot, { backgroundColor: Colors.warning }]} />
              <Text style={styles.sectionTitle}>Prioridade 2 - Implementar em 30 dias</Text>
            </View>
            {priority2.map((item, idx) => (
              <ActionCard key={idx} item={item} index={idx + priority1.length} />
            ))}
          </View>
        )}

        {priority3.length > 0 && (
          <View style={styles.prioritySection}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionDot, { backgroundColor: Colors.info }]} />
              <Text style={styles.sectionTitle}>Prioridade 3 - Implementar em 90 dias</Text>
            </View>
            {priority3.map((item, idx) => (
              <ActionCard key={idx} item={item} index={idx + priority1.length + priority2.length} />
            ))}
          </View>
        )}
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
  headerTitle: { fontSize: 28, fontWeight: '700' as const, color: Colors.text, marginTop: 12 },
  headerSubtitle: { fontSize: 14, color: Colors.textSecondary, marginTop: 4 },
  scrollView: { flex: 1 },
  scrollContent: { padding: 16, gap: 16 },
  investmentCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
  },
  investmentTitle: { fontSize: 16, fontWeight: '700' as const, color: Colors.text, marginBottom: 4 },
  investmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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
});
