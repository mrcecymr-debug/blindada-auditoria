import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import { supabase } from './supabase';

const SESSION_TOKEN_KEY = 'casa_blindada_session_token';

export async function registerSessionToken(): Promise<string> {
  const token = Crypto.randomUUID();
  await AsyncStorage.setItem(SESSION_TOKEN_KEY, token);
  await supabase.auth.updateUser({
    data: { active_session_token: token },
  });
  return token;
}

export async function validateSession(): Promise<boolean> {
  try {
    const localToken = await AsyncStorage.getItem(SESSION_TOKEN_KEY);
    if (!localToken) return false;

    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return false;

    const serverToken = user.user_metadata?.active_session_token;
    return serverToken === localToken;
  } catch {
    return false;
  }
}

export async function clearSessionToken(): Promise<void> {
  await AsyncStorage.removeItem(SESSION_TOKEN_KEY);
}
