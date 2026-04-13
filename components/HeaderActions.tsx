import React from 'react';
import { StyleSheet, Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { supabase } from '@/lib/supabase';
import { clearSessionToken } from '@/lib/session-guard';

type HeaderActionsProps = {
  onShowGuide: () => void;
  onShowEmergency: () => void;
  extraButtons?: React.ReactNode;
};

export default function HeaderActions({ onShowGuide, onShowEmergency, extraButtons }: HeaderActionsProps) {
  const handleLogout = async () => {
    await clearSessionToken();
    await supabase.auth.signOut();
  };

  return (
    <View style={styles.headerActions}>
      <Pressable
        onPress={() => {
          onShowEmergency();
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }}
        style={({ pressed }) => [styles.headerIconBtn, styles.emergencyIconBtn, pressed && { opacity: 0.7 }]}
      >
        <Ionicons name="call" size={18} color="#FF6B6B" />
      </Pressable>

      <Pressable
        onPress={() => {
          onShowGuide();
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }}
        style={({ pressed }) => [styles.headerIconBtn, styles.helpIconBtn, pressed && { opacity: 0.7 }]}
      >
        <Ionicons name="help-circle" size={20} color={Colors.accent} />
      </Pressable>

      {extraButtons}

      <Pressable
        onPress={handleLogout}
        style={({ pressed }) => [styles.headerIconBtn, styles.logoutIconBtn, pressed && { opacity: 0.7 }]}
      >
        <Ionicons name="log-out-outline" size={20} color="#FF6B6B" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
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
  emergencyIconBtn: {
    backgroundColor: '#FF6B6B15',
    borderWidth: 1,
    borderColor: '#FF6B6B35',
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
});
