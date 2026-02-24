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
  Modal,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { registerSessionToken, validateSession } from "@/lib/session-guard";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [secure, setSecure] = useState(true);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
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

  const handleForgotPassword = async () => {
    if (!resetEmail) {
      Alert.alert("Atenção", "Digite seu e-mail para redefinir a senha.");
      return;
    }

    setResetLoading(true);

    try {
      const apiBase = process.env.EXPO_PUBLIC_DOMAIN
        ? `https://${process.env.EXPO_PUBLIC_DOMAIN}`
        : "http://localhost:5000";

      const checkRes = await fetch(`${apiBase}/api/check-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail }),
      });

      const checkData = await checkRes.json();

      if (!checkData.exists) {
        setResetLoading(false);
        Alert.alert("E-mail não cadastrado", "Este e-mail não está registrado no sistema. Verifique o endereço digitado.");
        return;
      }

      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: "https://guczydknusnhpooaxvtb.supabase.co/auth/v1/verify",
      });
      setResetLoading(false);

      if (error) {
        Alert.alert("Erro", "Não foi possível enviar o e-mail. Tente novamente mais tarde.");
      } else {
        Alert.alert(
          "E-mail enviado",
          "Verifique sua caixa de entrada (e a pasta de spam) para redefinir sua senha.",
          [{ text: "OK", onPress: () => setShowForgotModal(false) }]
        );
        setResetEmail("");
      }
    } catch {
      setResetLoading(false);
      Alert.alert("Erro", "Não foi possível conectar ao servidor. Tente novamente.");
    }
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

          <TouchableOpacity
            onPress={() => {
              setResetEmail(email);
              setShowForgotModal(true);
            }}
            style={styles.forgotButton}
          >
            <Text style={styles.forgotText}>Esqueci minha senha</Text>
          </TouchableOpacity>

          <Modal
            visible={showForgotModal}
            transparent
            animationType="fade"
            onRequestClose={() => setShowForgotModal(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <TouchableOpacity
                  style={styles.modalClose}
                  onPress={() => setShowForgotModal(false)}
                >
                  <Ionicons name="close" size={22} color="#888" />
                </TouchableOpacity>

                <Ionicons name="mail-unread-outline" size={40} color="#D4AF37" style={{ alignSelf: "center", marginBottom: 12 }} />
                <Text style={styles.modalTitle}>Redefinir Senha</Text>
                <Text style={styles.modalSubtitle}>
                  Digite seu e-mail e enviaremos um link para criar uma nova senha.
                </Text>

                <View style={styles.modalInputContainer}>
                  <Ionicons name="mail-outline" size={18} color="#D4AF37" />
                  <TextInput
                    placeholder="Seu e-mail"
                    placeholderTextColor="#666"
                    style={styles.input}
                    value={resetEmail}
                    onChangeText={setResetEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>

                <TouchableOpacity
                  onPress={handleForgotPassword}
                  activeOpacity={0.85}
                  disabled={resetLoading}
                >
                  <LinearGradient
                    colors={["#F7B500", "#D4AF37", "#B8960C"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.modalButton}
                  >
                    {resetLoading ? (
                      <ActivityIndicator color="#000" />
                    ) : (
                      <Text style={styles.modalButtonText}>Enviar Link</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

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
  forgotButton: {
    alignSelf: "center",
    marginTop: 16,
  },
  forgotText: {
    color: "#D4AF37AA",
    fontSize: 13,
    textDecorationLine: "underline",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalContent: {
    backgroundColor: "#0D1321",
    borderRadius: 20,
    padding: 28,
    width: "100%",
    maxWidth: 400,
    borderWidth: 1,
    borderColor: "#1A2236",
  },
  modalClose: {
    position: "absolute",
    top: 14,
    right: 14,
    zIndex: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 6,
  },
  modalSubtitle: {
    fontSize: 13,
    color: "#888",
    textAlign: "center",
    marginBottom: 22,
    lineHeight: 18,
  },
  modalInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#070A12",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 15,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#1A2236",
  },
  modalButton: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  modalButtonText: {
    fontSize: 15,
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
