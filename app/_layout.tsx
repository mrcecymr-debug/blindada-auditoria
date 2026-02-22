import { QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useRef } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { StatusBar } from "expo-status-bar";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { queryClient } from "@/lib/query-client";
import { AuditProvider } from "@/lib/audit-context";
import { supabase } from "@/lib/supabase";

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const router = useRouter();
  const prevLoggedIn = useRef<boolean | null>(null);

  useEffect(() => {
    let isMounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (isMounted) {
        prevLoggedIn.current = !!data.session;
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!isMounted) return;
      const isLoggedIn = !!newSession;
      if (prevLoggedIn.current !== null && prevLoggedIn.current !== isLoggedIn) {
        setTimeout(() => {
          if (isLoggedIn) {
            router.replace("/(tabs)");
          } else {
            router.replace("/login");
          }
        }, 100);
      }
      prevLoggedIn.current = isLoggedIn;
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
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
