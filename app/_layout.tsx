import { QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState, useRef } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { StatusBar } from "expo-status-bar";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { queryClient } from "@/lib/query-client";
import { AuditProvider } from "@/lib/audit-context";
import { supabase } from "@/lib/supabase";

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const [session, setSession] = useState<any | undefined>(undefined);
  const [initialLoad, setInitialLoad] = useState(true);
  const router = useRouter();
  const prevLoggedIn = useRef<boolean | null>(null);

  useEffect(() => {
    let isMounted = true;

    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (isMounted) {
        prevLoggedIn.current = !!data.session;
        setSession(data.session);
        setInitialLoad(false);
        if (data.session) {
          router.replace("/(tabs)");
        } else {
          router.replace("/login");
        }
      }
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!isMounted) return;
      const isLoggedIn = !!newSession;
      if (prevLoggedIn.current !== null && prevLoggedIn.current !== isLoggedIn) {
        if (isLoggedIn) {
          router.replace("/(tabs)");
        } else {
          router.replace("/login");
        }
      }
      prevLoggedIn.current = isLoggedIn;
      setSession(newSession);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (session === undefined && initialLoad) {
    return null;
  }

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
