import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet, Text, View, ScrollView, Pressable, Modal,
  Platform, Linking, TextInput, Alert, KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '@/constants/colors';

const STORAGE_KEY = '@emergency_contacts_v1';

type PersonalContact = {
  id: string;
  label: string;
  phone: string;
};

const OFFICIAL_CONTACTS = [
  { label: 'Polícia Militar', number: '190', icon: 'shield' as const, color: '#4D96FF' },
  { label: 'Bombeiros', number: '193', icon: 'flame' as const, color: '#FF6B6B' },
  { label: 'SAMU', number: '192', icon: 'medkit' as const, color: '#FF9F43' },
  { label: 'Guarda Civil', number: '153', icon: 'people' as const, color: '#6BCB77' },
  { label: 'Emergência Geral', number: '199', icon: 'alert-circle' as const, color: '#9B59B6' },
  { label: 'Disk Denúncia', number: '181', icon: 'megaphone' as const, color: '#D4AF37' },
];

function makeCall(number: string) {
  const url = `tel:${number}`;
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') {
      window.location.href = url;
    }
    return;
  }
  Linking.openURL(url);
}

type ContactRowProps = {
  label: string;
  number: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  delay?: number;
};

function OfficialRow({ label, number, icon, color, delay = 0 }: ContactRowProps) {
  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(280)}>
      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          makeCall(number);
        }}
        style={({ pressed }) => [styles.officialCard, { borderColor: color + '40', opacity: pressed ? 0.8 : 1 }]}
      >
        <View style={[styles.officialIcon, { backgroundColor: color + '18' }]}>
          <Ionicons name={icon} size={22} color={color} />
        </View>
        <View style={styles.officialInfo}>
          <Text style={styles.officialLabel}>{label}</Text>
          <Text style={[styles.officialNumber, { color }]}>{number}</Text>
        </View>
        <View style={[styles.callBtn, { backgroundColor: color + '18', borderColor: color + '40' }]}>
          <Ionicons name="call" size={18} color={color} />
          <Text style={[styles.callBtnText, { color }]}>Ligar</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function EmergencyModal({ visible, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const [contacts, setContacts] = useState<PersonalContact[]>([]);
  const [editing, setEditing] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newPhone, setNewPhone] = useState('');

  useEffect(() => {
    if (visible) loadContacts();
  }, [visible]);

  const loadContacts = async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) setContacts(JSON.parse(raw));
    } catch {}
  };

  const saveContacts = async (updated: PersonalContact[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setContacts(updated);
    } catch {}
  };

  const handleAdd = useCallback(() => {
    const label = newLabel.trim();
    const phone = newPhone.trim().replace(/\D/g, '');
    if (!label || phone.length < 8) {
      Alert.alert('Dados incompletos', 'Preencha o nome e o número com DDD (mínimo 8 dígitos).');
      return;
    }
    const updated = [
      ...contacts,
      { id: Date.now().toString(), label, phone },
    ];
    saveContacts(updated);
    setNewLabel('');
    setNewPhone('');
    setEditing(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [newLabel, newPhone, contacts]);

  const handleDelete = useCallback((id: string) => {
    Alert.alert('Remover contato', 'Deseja remover este contato?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover', style: 'destructive',
        onPress: () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          saveContacts(contacts.filter((c) => c.id !== id));
        },
      },
    ]);
  }, [contacts]);

  const handleClose = () => {
    setEditing(false);
    setNewLabel('');
    setNewPhone('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Animated.View
          entering={FadeIn.duration(250)}
          style={[styles.container, { paddingBottom: Platform.OS === 'web' ? 34 : Math.max(insets.bottom, 20) }]}
        >
          <View style={styles.handle} />

          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.headerIcon}>
                <Ionicons name="call" size={20} color="#FF6B6B" />
              </View>
              <View>
                <Text style={styles.headerTitle}>Emergência</Text>
                <Text style={styles.headerSubtitle}>Números e contatos de segurança</Text>
              </View>
            </View>
            <Pressable onPress={handleClose} hitSlop={12}>
              <Ionicons name="close" size={24} color={Colors.textSecondary} />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll} keyboardShouldPersistTaps="handled">
            <Animated.View entering={FadeInDown.delay(40).duration(280)}>
              <View style={styles.sectionHeader}>
                <View style={[styles.sectionDot, { backgroundColor: '#FF6B6B' }]} />
                <Text style={[styles.sectionTitle, { color: '#FF6B6B' }]}>Números Oficiais</Text>
              </View>
            </Animated.View>

            <View style={styles.officialGrid}>
              {OFFICIAL_CONTACTS.map((c, i) => (
                <OfficialRow
                  key={c.number}
                  label={c.label}
                  number={c.number}
                  icon={c.icon}
                  color={c.color}
                  delay={60 + i * 40}
                />
              ))}
            </View>

            <Animated.View entering={FadeInDown.delay(320).duration(280)}>
              <View style={[styles.sectionHeader, { marginTop: 8 }]}>
                <View style={[styles.sectionDot, { backgroundColor: Colors.accent }]} />
                <Text style={[styles.sectionTitle, { color: Colors.accent }]}>Meus Contatos</Text>
                <Pressable
                  onPress={() => { setEditing(!editing); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
                  style={styles.addBtn}
                >
                  <Ionicons name={editing ? 'close-circle' : 'add-circle'} size={18} color={Colors.accent} />
                  <Text style={styles.addBtnText}>{editing ? 'Cancelar' : 'Adicionar'}</Text>
                </Pressable>
              </View>
            </Animated.View>

            {editing && (
              <Animated.View entering={FadeInDown.duration(250)} style={styles.addForm}>
                <View style={styles.inputRow}>
                  <Ionicons name="person-outline" size={16} color={Colors.textMuted} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Nome (ex: Delegacia 4ª DP)"
                    placeholderTextColor={Colors.textMuted}
                    value={newLabel}
                    onChangeText={setNewLabel}
                    returnKeyType="next"
                  />
                </View>
                <View style={styles.inputRow}>
                  <Ionicons name="call-outline" size={16} color={Colors.textMuted} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Número com DDD (ex: 11 99999-0000)"
                    placeholderTextColor={Colors.textMuted}
                    value={newPhone}
                    onChangeText={setNewPhone}
                    keyboardType="phone-pad"
                    returnKeyType="done"
                    onSubmitEditing={handleAdd}
                  />
                </View>
                <Pressable onPress={handleAdd} style={styles.saveBtn}>
                  <Ionicons name="checkmark" size={16} color="#fff" />
                  <Text style={styles.saveBtnText}>Salvar Contato</Text>
                </Pressable>
              </Animated.View>
            )}

            {contacts.length === 0 && !editing ? (
              <Animated.View entering={FadeInDown.delay(360).duration(280)} style={styles.emptyState}>
                <Ionicons name="person-add-outline" size={32} color={Colors.textMuted} />
                <Text style={styles.emptyTitle}>Nenhum contato salvo</Text>
                <Text style={styles.emptyDesc}>
                  Adicione a delegacia local, segurança do condomínio, familiar ou vizinho de confiança.
                </Text>
              </Animated.View>
            ) : (
              contacts.map((c, i) => (
                <Animated.View key={c.id} entering={FadeInDown.delay(360 + i * 40).duration(280)}>
                  <Pressable
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                      makeCall(c.phone);
                    }}
                    style={({ pressed }) => [styles.personalCard, pressed && { opacity: 0.8 }]}
                  >
                    <View style={styles.personalIcon}>
                      <Ionicons name="person" size={18} color={Colors.accent} />
                    </View>
                    <View style={styles.personalInfo}>
                      <Text style={styles.personalLabel}>{c.label}</Text>
                      <Text style={styles.personalPhone}>{c.phone}</Text>
                    </View>
                    <View style={styles.personalActions}>
                      <View style={styles.personalCallBtn}>
                        <Ionicons name="call" size={16} color={Colors.accent} />
                      </View>
                      <Pressable onPress={() => handleDelete(c.id)} hitSlop={8} style={styles.deleteBtn}>
                        <Ionicons name="trash-outline" size={15} color="#FF6B6B" />
                      </Pressable>
                    </View>
                  </Pressable>
                </Animated.View>
              ))
            )}

            <View style={styles.disclaimer}>
              <Ionicons name="information-circle-outline" size={13} color={Colors.textMuted} />
              <Text style={styles.disclaimerText}>
                Em situação de risco imediato, ligue para 190. Mantenha a calma e informe seu endereço completo.
              </Text>
            </View>
          </ScrollView>

          <Pressable
            onPress={handleClose}
            style={styles.closeBtn}
          >
            <Ionicons name="checkmark" size={18} color="#fff" />
            <Text style={styles.closeBtnText}>Fechar</Text>
          </Pressable>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
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
    marginTop: 12, marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginBottom: 14,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerIcon: {
    width: 38, height: 38, borderRadius: 11,
    backgroundColor: '#FF6B6B18',
    borderWidth: 1, borderColor: '#FF6B6B35',
    justifyContent: 'center', alignItems: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '700' as const, color: Colors.text },
  headerSubtitle: { fontSize: 11, color: Colors.textSecondary, marginTop: 1 },
  scroll: { marginBottom: 12 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: 10,
    paddingLeft: 2,
  },
  sectionDot: { width: 6, height: 6, borderRadius: 3 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800' as const,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    flex: 1,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addBtnText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.accent,
  },
  officialGrid: { gap: 8, marginBottom: 4 },
  officialCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    gap: 12,
  },
  officialIcon: {
    width: 44, height: 44, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center',
    flexShrink: 0,
  },
  officialInfo: { flex: 1 },
  officialLabel: { fontSize: 13, fontWeight: '600' as const, color: Colors.text },
  officialNumber: { fontSize: 22, fontWeight: '800' as const, letterSpacing: 1, marginTop: 1 },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    flexShrink: 0,
  },
  callBtnText: { fontSize: 13, fontWeight: '700' as const },
  addForm: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.accent + '35',
    gap: 10,
    marginBottom: 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    gap: 8,
  },
  inputIcon: { flexShrink: 0 },
  input: {
    flex: 1,
    height: 44,
    color: Colors.text,
    fontSize: 14,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.accent,
    borderRadius: 10,
    paddingVertical: 12,
  },
  saveBtnText: { fontSize: 14, fontWeight: '700' as const, color: '#fff' },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 8,
  },
  emptyTitle: { fontSize: 14, fontWeight: '600' as const, color: Colors.textSecondary },
  emptyDesc: {
    fontSize: 12, color: Colors.textMuted, textAlign: 'center',
    lineHeight: 18, maxWidth: 280,
  },
  personalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
    marginBottom: 8,
  },
  personalIcon: {
    width: 38, height: 38, borderRadius: 10,
    backgroundColor: Colors.accent + '18',
    justifyContent: 'center', alignItems: 'center',
    flexShrink: 0,
  },
  personalInfo: { flex: 1 },
  personalLabel: { fontSize: 13, fontWeight: '600' as const, color: Colors.text },
  personalPhone: { fontSize: 15, fontWeight: '700' as const, color: Colors.accent, marginTop: 2 },
  personalActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  personalCallBtn: {
    width: 34, height: 34, borderRadius: 9,
    backgroundColor: Colors.accent + '18',
    borderWidth: 1, borderColor: Colors.accent + '35',
    justifyContent: 'center', alignItems: 'center',
  },
  deleteBtn: {
    width: 34, height: 34, borderRadius: 9,
    backgroundColor: '#FF6B6B12',
    borderWidth: 1, borderColor: '#FF6B6B30',
    justifyContent: 'center', alignItems: 'center',
  },
  disclaimer: {
    flexDirection: 'row',
    gap: 7,
    alignItems: 'flex-start',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 12,
    marginTop: 4,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  disclaimerText: { fontSize: 11, color: Colors.textMuted, lineHeight: 16, flex: 1 },
  closeBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FF6B6B',
    borderRadius: 14,
    paddingVertical: 14,
    marginBottom: 4,
  },
  closeBtnText: { fontSize: 16, fontWeight: '600' as const, color: '#fff' },
});
