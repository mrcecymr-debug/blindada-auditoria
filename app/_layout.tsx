import { QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useRef } from "react";
import { Alert, AppState, Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { StatusBar } from "expo-status-bar";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { queryClient } from "@/lib/query-client";
import { AuditProvider } from "@/lib/audit-context";
import { supabase } from "@/lib/supabase";
import { validateSession, clearSessionToken } from "@/lib/session-guard";
import { registerServiceWorker } from "@/lib/register-sw";

SplashScreen.preventAutoHideAsync();
registerServiceWorker();

function checkUrlForInvite(): boolean {
  if (Platform.OS !== 'web') return false;
  try {
    const hash = window.location.hash;
    if (hash && hash.includes('type=invite')) {
      return true;
    }
  } catch {}
  return false;
}

function RootLayoutNav() {
  const router = useRouter();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const handledInvite = useRef(false);

  useEffect(() => {
    if (Platform.OS === 'web' && checkUrlForInvite() && !handledInvite.current) {
      handledInvite.current = true;
      setTimeout(() => {
        router.replace("/set-password");
      }, 1500);
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (event === 'SIGNED_OUT') {
        router.replace("/login");
      }
    });

    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) return;
      const valid = await validateSession();
      if (!valid) {
        await clearSessionToken();
        Alert.alert(
          "Sessão encerrada",
          "Sua conta foi acessada em outro dispositivo. Apenas um acesso por usuário é permitido.",
          [{ text: "Entendi" }]
        );
        await supabase.auth.signOut();
      }
    };

    intervalRef.current = setInterval(checkSession, 10000);

    const appStateListener = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        checkSession();
      }
    });

    return () => {
      subscription.unsubscribe();
      if (intervalRef.current) clearInterval(intervalRef.current);
      appStateListener.remove();
    };
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView>
          <KeyboardProvider>
            <AuditProvider>
              <StatusBar style="light" />
              <RootLayoutNav />
            </AuditProvider>
          </KeyboardProvider>
        </GestureHandlerRootView>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
