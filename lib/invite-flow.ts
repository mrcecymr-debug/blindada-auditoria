import { Platform } from 'react-native';

const INVITE_KEY = 'casa_blindada_invite';

export function detectAndMarkInviteFlow(): boolean {
  if (Platform.OS !== 'web') return false;
  try {
    const hash = window.location.hash;
    if (hash && hash.includes('type=invite')) {
      sessionStorage.setItem(INVITE_KEY, 'true');
      return true;
    }
    return sessionStorage.getItem(INVITE_KEY) === 'true';
  } catch {}
  return false;
}

export function isInviteFlowActive(): boolean {
  if (Platform.OS !== 'web') return false;
  try {
    return sessionStorage.getItem(INVITE_KEY) === 'true';
  } catch {}
  return false;
}

export function clearInviteFlow(): void {
  if (Platform.OS !== 'web') return;
  try {
    sessionStorage.removeItem(INVITE_KEY);
  } catch {}
}
