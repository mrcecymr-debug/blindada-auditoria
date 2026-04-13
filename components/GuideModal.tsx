import React, { useState } from 'react';
import {
  StyleSheet, Text, View, ScrollView, Pressable, Modal, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import Colors from '@/constants/colors';
import { GLOSSARY } from '@/lib/security-content';

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
    sectionTitle: 'Como Usar o App',
    sectionIcon: 'navigate-outline',
    sectionColor: Colors.accent,
    items: [
      {
        icon: 'clipboard-outline',
        title: 'Passo 1 — Diagnostico',
        description: 'Responda as 32 perguntas distribuidas em 5 categorias de seguranca. Para cada pergunta, escolha a opcao que melhor descreve a situacao atual do seu imovel. Use o campo de observacao para anotar detalhes.',
      },
      {
        icon: 'bar-chart-outline',
        title: 'Passo 2 — Painel',
        description: 'Apos responder todas as 32 perguntas, o botao do Painel fica disponivel. Ali voce ve a pontuacao geral de seguranca e os resultados por categoria, atualizados em tempo real.',
      },
      {
        icon: 'shield-checkmark-outline',
        title: 'Passo 3 — Plano de Acao',
        description: 'O app gera automaticamente uma lista de melhorias com prioridade, produto sugerido, custo estimado e impacto na pontuacao. Implemente cada melhoria e marque como feito.',
      },
      {
        icon: 'document-text-outline',
        title: 'Passo 4 — Relatorio',
        description: 'Salve o diagnostico com um nome e gere um PDF profissional completo. Compartilhe via WhatsApp, e-mail ou imprima. Com 2 ou mais relatorios, aparece um grafico de evolucao da pontuacao.',
      },
    ],
  },
  {
    sectionTitle: 'Ciclo de Evolucao',
    sectionIcon: 'refresh-circle-outline',
    sectionColor: '#D4AF37',
    items: [
      {
        icon: 'checkmark-circle-outline',
        title: 'Marcar Acao como Feita',
        description: 'Ao marcar uma acao como implementada, o diagnostico dessa pergunta e atualizado automaticamente para o nivel-meta. O score sobe instantaneamente no Painel.',
      },
      {
        icon: 'trophy-outline',
        title: 'Missao Cumprida',
        description: 'Quando voce implementa TODAS as melhorias do plano, o app exibe uma celebracao com sua pontuacao final. E a hora de salvar o relatorio desta fase antes de avancar.',
        highlight: true,
      },
      {
        icon: 'rocket-outline',
        title: 'Nova Fase',
        description: 'Apos salvar, inicie uma nova avaliacao completa. Com o imovel melhorado, suas respostas serao diferentes — um novo conjunto de melhorias mais refinadas sera gerado para atingir o nivel maximo.',
      },
      {
        icon: 'trending-up-outline',
        title: 'Acompanhe a Evolucao',
        description: 'Cada fase salva vira um ponto no grafico de evolucao na aba Relatorio. Voce visualiza de forma clara o quanto seu lar evoluiu entre as fases.',
      },
    ],
  },
  {
    sectionTitle: 'Categorias Avaliadas',
    sectionIcon: 'layers-outline',
    sectionColor: '#4D96FF',
    items: [
      {
        icon: 'home-outline',
        title: 'Perimetro e Estrutura',
        description: 'Muros, cercas, portoes, grades, altura das barreiras e integridade fisica dos pontos de entrada e acesso externo.',
      },
      {
        icon: 'sunny-outline',
        title: 'Iluminacao e Visibilidade',
        description: 'Iluminacao externa, sensores de presenca, cobertura de pontos cegos e visibilidade do imovel a partir da rua.',
      },
      {
        icon: 'key-outline',
        title: 'Controle de Acesso',
        description: 'Fechaduras, portoes automatizados, controle de chaves, interfone e gerenciamento do acesso de pessoas.',
      },
      {
        icon: 'videocam-outline',
        title: 'Sistemas Eletronicos',
        description: 'Cameras de seguranca, alarmes, sensores de movimento, monitoramento 24h e integracao de sistemas eletronicos.',
      },
      {
        icon: 'people-outline',
        title: 'Fatores Humanos',
        description: 'Rotinas de seguranca, consciencia dos moradores, automacao residencial, procedimentos de emergencia e historico da regiao.',
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
        title: 'Pontuacao Geral (0 a 100%)',
        description: 'O medidor circular exibe o nivel geral de seguranca. Abaixo de 40% e Critico (vermelho), entre 40-69% e Atencao (laranja/amarelo), acima de 70% e Bom (verde).',
      },
      {
        icon: 'stats-chart-outline',
        title: 'Analise por Categoria',
        description: 'Barras de progresso mostram o desempenho em cada uma das 5 categorias. Identifique rapidamente quais areas precisam de mais atencao.',
      },
      {
        icon: 'lock-open-outline',
        title: 'Disponivel apos 32/32',
        description: 'O botao para acessar o Painel so aparece quando todas as 32 perguntas forem respondidas. Isso garante que o score e os dados sejam completos e precisos.',
      },
    ],
  },
  {
    sectionTitle: 'Plano de Acao — Detalhes',
    sectionIcon: 'construct-outline',
    sectionColor: Colors.warning,
    items: [
      {
        icon: 'alert-circle-outline',
        title: 'Prioridade 1 — Critico (7 dias)',
        description: 'Vulnerabilidades graves que representam risco imediato. Devem ser resolvidas com urgencia.',
      },
      {
        icon: 'warning-outline',
        title: 'Prioridade 2 — Importante (30 dias)',
        description: 'Falhas significativas que comprometem a seguranca do imovel. Planeje e execute dentro de 1 mes.',
      },
      {
        icon: 'construct-outline',
        title: 'Prioridade 3 — Melhoria (90 dias)',
        description: 'Aprimoramentos que elevam o nivel geral de protecao. Podem ser feitos de forma gradual em ate 3 meses.',
      },
      {
        icon: 'pricetag-outline',
        title: 'O que cada acao inclui',
        description: 'Vulnerabilidade identificada, meta de melhoria no diagnostico, produto sugerido, solucao tecnica, investimento estimado e se e instalacao DIY ou profissional.',
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
        title: 'Salvar Diagnostico',
        description: 'Na aba Relatorio, toque em "Salvar Diagnostico Atual". Escolha um nome descritivo (ex: "Fase 1" ou "Antes das melhorias"). O historico de auditorias salvas aparece logo abaixo.',
      },
      {
        icon: 'document-attach-outline',
        title: 'Gerar PDF Profissional',
        description: 'Abra um relatorio salvo e toque no botao PDF. O documento inclui: resumo executivo, pontuacao por categoria, lista de vulnerabilidades, cronograma de acoes e plano completo.',
      },
      {
        icon: 'share-social-outline',
        title: 'Compartilhar',
        description: 'Apos gerar o PDF, compartilhe via WhatsApp, e-mail, Drive ou qualquer app instalado no dispositivo. No computador, o PDF pode ser impresso em A4.',
      },
      {
        icon: 'trending-up-outline',
        title: 'Grafico de Evolucao',
        description: 'Com 2 ou mais relatorios salvos, aparece automaticamente um grafico mostrando como a pontuacao evoluiu entre as fases. Tangibiliza o progresso das melhorias.',
      },
      {
        icon: 'trash-outline',
        title: 'Excluir Relatorio',
        description: 'Na lista de relatorios salvos, deslize o card para a esquerda para excluir. Relatorios apagados nao podem ser recuperados.',
      },
    ],
  },
  {
    sectionTitle: 'Sua Conta e Dados',
    sectionIcon: 'settings-outline',
    sectionColor: Colors.textSecondary,
    items: [
      {
        icon: 'phone-portrait-outline',
        title: 'Sessao Unica',
        description: 'Sua conta permite apenas uma sessao ativa por vez. Ao fazer login em outro dispositivo, a sessao anterior e encerrada automaticamente por seguranca.',
      },
      {
        icon: 'cloud-offline-outline',
        title: 'Dados Locais',
        description: 'O diagnostico atual e as acoes marcadas ficam salvos no dispositivo. Os relatorios salvos tambem ficam no aparelho. Tudo funciona sem internet.',
      },
      {
        icon: 'refresh-outline',
        title: 'Limpar Diagnostico Atual',
        description: 'Na aba Relatorio, o botao "Limpar" apaga as respostas atuais e as acoes marcadas. Os relatorios ja salvos NAO sao afetados. Use isso para iniciar uma nova fase.',
      },
      {
        icon: 'log-out-outline',
        title: 'Sair da Conta',
        description: 'O botao de sair fica no canto superior direito de todas as telas. Seus dados locais sao preservados — ao entrar novamente, tudo estara como antes.',
      },
    ],
  },
  {
    sectionTitle: 'Dicas Importantes',
    sectionIcon: 'bulb-outline',
    sectionColor: '#D4AF37',
    items: [
      {
        icon: 'bulb-outline',
        title: 'Seja honesto nas respostas',
        description: 'O valor do diagnostico depende da precisao das respostas. Escolha sempre a opcao que reflete a realidade atual — nao o que voce planeja ter futuramente.',
        highlight: true,
      },
      {
        icon: 'create-outline',
        title: 'Use o campo de observacao',
        description: 'Cada pergunta tem um campo para anotacoes. Registre medidas, marcas de equipamentos, pendencias ou qualquer detalhe relevante que queira guardar.',
      },
      {
        icon: 'save-outline',
        title: 'Salve antes de mudar',
        description: 'Se quiser guardar o estado atual antes de alterar respostas ou iniciar nova fase, salve um relatorio primeiro. Mudancas no diagnostico nao podem ser desfeitas.',
      },
    ],
  },
];

type Tab = 'guia' | 'glossario';

export default function GuideModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<Tab>('guia');

  const handleTabChange = (tab: Tab) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveTab(tab);
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <Animated.View entering={FadeIn.duration(300)} style={[styles.container, { paddingBottom: Platform.OS === 'web' ? 34 : Math.max(insets.bottom, 20) }]}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.headerIcon}>
                <Ionicons name="book-outline" size={20} color={Colors.accent} />
              </View>
              <View>
                <Text style={styles.headerTitle}>Central de Ajuda</Text>
                <Text style={styles.headerSubtitle}>Casa Blindada MR@</Text>
              </View>
            </View>
            <Pressable onPress={onClose} hitSlop={12}>
              <Ionicons name="close" size={24} color={Colors.textSecondary} />
            </Pressable>
          </View>

          <View style={styles.tabRow}>
            <Pressable
              onPress={() => handleTabChange('guia')}
              style={[styles.tabBtn, activeTab === 'guia' && styles.tabBtnActive]}
            >
              <Ionicons
                name="navigate-outline"
                size={15}
                color={activeTab === 'guia' ? Colors.accent : Colors.textMuted}
              />
              <Text style={[styles.tabText, activeTab === 'guia' && styles.tabTextActive]}>
                Como Usar
              </Text>
            </Pressable>
            <Pressable
              onPress={() => handleTabChange('glossario')}
              style={[styles.tabBtn, activeTab === 'glossario' && styles.tabBtnActive]}
            >
              <Ionicons
                name="library-outline"
                size={15}
                color={activeTab === 'glossario' ? Colors.accent : Colors.textMuted}
              />
              <Text style={[styles.tabText, activeTab === 'glossario' && styles.tabTextActive]}>
                Glossario
              </Text>
            </Pressable>
          </View>

          {activeTab === 'guia' ? (
            <ScrollView key="guia" showsVerticalScrollIndicator={false} style={styles.scroll}>
              {GUIDE_SECTIONS.map((section, sIdx) => (
                <View key={sIdx} style={styles.sectionWrap}>
                  <Animated.View entering={FadeInDown.delay(sIdx * 50).duration(280)}>
                    <View style={styles.sectionHeader}>
                      <View style={[styles.sectionDot, { backgroundColor: section.sectionColor }]} />
                      <Ionicons name={section.sectionIcon} size={16} color={section.sectionColor} />
                      <Text style={[styles.sectionTitle, { color: section.sectionColor }]}>{section.sectionTitle}</Text>
                    </View>
                  </Animated.View>
                  {section.items.map((item, iIdx) => (
                    <Animated.View key={iIdx} entering={FadeInDown.delay(sIdx * 50 + iIdx * 35).duration(280)}>
                      <View style={[
                        styles.stepCard,
                        item.highlight && { borderColor: '#D4AF37' + '50', backgroundColor: '#D4AF37' + '08' },
                      ]}>
                        <View style={[
                          styles.stepIcon,
                          item.highlight && { backgroundColor: '#D4AF37' + '20' },
                        ]}>
                          <Ionicons name={item.icon} size={20} color={item.highlight ? '#D4AF37' : Colors.text} />
                        </View>
                        <View style={styles.stepContent}>
                          <Text style={[styles.stepTitle, item.highlight && { color: '#D4AF37' }]}>{item.title}</Text>
                          <Text style={styles.stepDesc}>{item.description}</Text>
                        </View>
                      </View>
                    </Animated.View>
                  ))}
                </View>
              ))}
              <View style={styles.versionWrap}>
                <Text style={styles.versionText}>Casa Blindada Auditoria v3.0</Text>
                <Text style={styles.versionText}>MR ENG — Seguranca Estrategica</Text>
              </View>
            </ScrollView>
          ) : (
            <ScrollView key="glossario" showsVerticalScrollIndicator={false} style={styles.scroll}>
              <Animated.View entering={FadeIn.duration(300)}>
                <View style={styles.glossaryIntro}>
                  <Ionicons name="library-outline" size={16} color={Colors.accent} />
                  <Text style={styles.glossaryIntroText}>
                    {GLOSSARY.length} termos tecnicos explicados de forma simples
                  </Text>
                </View>
              </Animated.View>

              {GLOSSARY.map((item, idx) => (
                <Animated.View key={idx} entering={FadeInDown.delay(idx * 30).duration(260)}>
                  <View style={styles.glossaryCard}>
                    <View style={styles.glossaryLeft}>
                      <View style={styles.glossaryLetterBg}>
                        <Text style={styles.glossaryLetter}>
                          {item.term.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.glossaryContent}>
                      <Text style={styles.glossaryTerm}>{item.term}</Text>
                      <Text style={styles.glossaryDef}>{item.definition}</Text>
                    </View>
                  </View>
                </Animated.View>
              ))}

              <View style={styles.versionWrap}>
                <Text style={styles.versionText}>Casa Blindada Auditoria v3.0</Text>
                <Text style={styles.versionText}>MR ENG — Seguranca Estrategica</Text>
              </View>
            </ScrollView>
          )}

          <Pressable
            onPress={() => { onClose(); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
            style={styles.closeBtn}
          >
            <Ionicons name="checkmark" size={18} color="#fff" />
            <Text style={styles.closeBtnText}>Entendi</Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '92%',
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
    marginBottom: 12,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerIcon: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: Colors.accent + '15',
    justifyContent: 'center', alignItems: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '700' as const, color: Colors.text },
  headerSubtitle: { fontSize: 11, color: Colors.textSecondary, marginTop: 1 },

  tabRow: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 3,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: 10,
  },
  tabBtnActive: {
    backgroundColor: Colors.accent + '18',
    borderWidth: 1,
    borderColor: Colors.accent + '35',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.textMuted,
  },
  tabTextActive: {
    color: Colors.accent,
  },

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
  sectionDot: { width: 6, height: 6, borderRadius: 3 },
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

  glossaryIntro: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.accent + '10',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.accent + '20',
  },
  glossaryIntroText: {
    fontSize: 12,
    color: Colors.accent,
    fontWeight: '600' as const,
  },
  glossaryCard: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
    alignItems: 'flex-start',
  },
  glossaryLeft: {
    flexShrink: 0,
  },
  glossaryLetterBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.accent + '18',
    borderWidth: 1,
    borderColor: Colors.accent + '30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  glossaryLetter: {
    fontSize: 16,
    fontWeight: '800' as const,
    color: Colors.accent,
  },
  glossaryContent: { flex: 1 },
  glossaryTerm: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  glossaryDef: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },

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
