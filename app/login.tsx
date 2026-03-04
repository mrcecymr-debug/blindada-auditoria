import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { registerSessionToken, validateSession } from "@/lib/session-guard";

function isInviteUrl(): boolean {
  if (Platform.OS !== 'web') return false;
  try {
    const hash = window.location.hash;
    return !!(hash && hash.includes('type=invite'));
  } catch {}
  return false;
}

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [secure, setSecure] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (isInviteUrl()) return;

    supabase.auth.getSession().then(async ({ data }) => {
      if (data.session) {
        const valid = await validateSession();
        if (valid) {
          router.replace("/(tabs)");
        } else {
          await supabase.auth.signOut();
        }
      }
    });
  }, []);

  const handleLogin = async () => {
    if (!email || !password) return;

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setLoading(false);
      alert("Email ou senha incorretos.");
      return;
    }

    await registerSessionToken();
    setLoading(false);
    router.replace("/(tabs)");
  };

  return (
    <LinearGradient
      colors={["#070A12", "#0B1120", "#101828", "#0B1120", "#070A12"]}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1, justifyContent: "center" }}
      >
        <Animated.View
          entering={FadeInDown.duration(800)}
          style={styles.content}
        >
          <View style={styles.logoSection}>
            <View style={styles.logoGlow}>
              <Image
                source={require("@/assets/images/logo-casa-blindada.jpg")}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.brandName}>CASA BLINDADA</Text>
            <View style={styles.taglineLine}>
              <View style={styles.taglineDash} />
              <Text style={styles.tagline}>Seguranca Residencial</Text>
              <View style={styles.taglineDash} />
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.title}>Bem-vindo</Text>
          <Text style={styles.subtitle}>
            Acesse sua conta para continuar
          </Text>

          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={18} color="#D4AF37" />
            <TextInput
              placeholder="Seu e-mail"
              placeholderTextColor="#666"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={18} color="#D4AF37" />
            <TextInput
              placeholder="Sua senha"
              placeholderTextColor="#666"
              style={styles.input}
              secureTextEntry={secure}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setSecure(!secure)}>
              <Ionicons
                name={secure ? "eye-outline" : "eye-off-outline"}
                size={20}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.buttonWrapper}
            onPress={handleLogin}
            activeOpacity={0.85}
            disabled={loading}
          >
            <LinearGradient
              colors={["#F7B500", "#D4AF37", "#B8960C"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.button}
            >
              {loading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <>
                  <Ionicons name="shield-checkmark" size={18} color="#000" style={{ marginRight: 8 }} />
                  <Text style={styles.buttonText}>Entrar</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.footerSection}>
            <Text style={styles.footerBrand}>MR ENG</Text>
            <Text style={styles.footerSub}>Seguranca Estrategica</Text>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 32,
  },
  logoSection: {
    alignItems: "center",
    marginBottom: 8,
  },
  logoGlow: {
    width: 160,
    height: 160,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#D4AF37",
    shadowOpacity: 0.35,
    shadowRadius: 25,
    shadowOffset: { width: 0, height: 0 },
    elevation: 15,
    marginBottom: 16,
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 30,
  },
  brandName: {
    fontSize: 22,
    fontWeight: "800",
    color: "#D4AF37",
    letterSpacing: 4,
    textAlign: "center",
    marginBottom: 6,
  },
  taglineLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  taglineDash: {
    width: 20,
    height: 1,
    backgroundColor: "#D4AF3766",
  },
  tagline: {
    fontSize: 12,
    color: "#D4AF37AA",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  divider: {
    height: 1,
    backgroundColor: "#1F293744",
    marginVertical: 24,
    marginHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 13,
    color: "#888",
    textAlign: "center",
    marginBottom: 28,
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0D1321",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 15,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#1A2236",
  },
  input: {
    flex: 1,
    marginLeft: 12,
    color: "#FFFFFF",
    fontSize: 15,
  },
  buttonWrapper: {
    marginTop: 14,
    borderRadius: 14,
    shadowColor: "#F7B500",
    shadowOpacity: 0.5,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 6 },
    elevation: 12,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },
  footerSection: {
    alignItems: "center",
    marginTop: 28,
  },
  footerBrand: {
    fontSize: 14,
    fontWeight: "800",
    color: "#D4AF37AA",
    letterSpacing: 3,
    textAlign: "center",
  },
  footerSub: {
    fontSize: 11,
    color: "#D4AF3777",
    letterSpacing: 2,
    textAlign: "center",
    marginTop: 2,
    textTransform: "uppercase",
  },
});
