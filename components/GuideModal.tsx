import React from 'react';
import {
  StyleSheet, Text, View, ScrollView, Pressable, Modal, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import Colors from '@/constants/colors';

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
        description: 'O botao de sair fica no canto superior direito de todas as telas. Ao sair, seus dados locais sao preservados para o proximo acesso.',
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

export default function GuideModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const insets = useSafeAreaInsets();

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
                <Text style={styles.headerSubtitle}>Tudo sobre o Casa Blindada</Text>
              </View>
            </View>
            <Pressable onPress={onClose} hitSlop={12}>
              <Ionicons name="close" size={24} color={Colors.textSecondary} />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
            {GUIDE_SECTIONS.map((section, sIdx) => (
              <View key={sIdx} style={styles.sectionWrap}>
                <Animated.View entering={FadeInDown.delay(sIdx * 60).duration(300)}>
                  <View style={styles.sectionHeader}>
                    <View style={[styles.sectionDot, { backgroundColor: section.sectionColor }]} />
                    <Ionicons name={section.sectionIcon} size={16} color={section.sectionColor} />
                    <Text style={[styles.sectionTitle, { color: section.sectionColor }]}>{section.sectionTitle}</Text>
                  </View>
                </Animated.View>
                {section.items.map((item, iIdx) => (
                  <Animated.View key={iIdx} entering={FadeInDown.delay(sIdx * 60 + iIdx * 40).duration(300)}>
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
              <Text style={styles.versionText}>MR ENG - Seguranca Estrategica</Text>
            </View>
          </ScrollView>

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
