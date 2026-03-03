import React, { useState } from "react";
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
import { registerSessionToken } from "@/lib/session-guard";

export default function SetPasswordScreen() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [secure, setSecure] = useState(true);
  const [secureConfirm, setSecureConfirm] = useState(true);
  const router = useRouter();

  const handleSetPassword = async () => {
    if (!password || !confirmPassword) {
      alert("Preencha os dois campos de senha.");
      return;
    }
    if (password.length < 6) {
      alert("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      alert("As senhas não coincidem.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setLoading(false);
      alert("Erro ao definir senha. Tente novamente.");
      return;
    }

    await registerSessionToken();
    setLoading(false);
    alert("Senha criada com sucesso! Bem-vindo ao Casa Blindada!");
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

          <View style={styles.congratsBox}>
            <Ionicons name="checkmark-circle" size={28} color="#00C6AE" />
            <Text style={styles.congratsTitle}>Parabéns pela sua escolha!</Text>
            <Text style={styles.congratsText}>
              Crie sua senha para acessar o Casa Blindada MR@
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={18} color="#D4AF37" />
            <TextInput
              placeholder="Crie sua senha"
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

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={18} color="#D4AF37" />
            <TextInput
              placeholder="Confirme sua senha"
              placeholderTextColor="#666"
              style={styles.input}
              secureTextEntry={secureConfirm}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity onPress={() => setSecureConfirm(!secureConfirm)}>
              <Ionicons
                name={secureConfirm ? "eye-outline" : "eye-off-outline"}
                size={20}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.hint}>Mínimo 6 caracteres</Text>

          <TouchableOpacity
            style={styles.buttonWrapper}
            onPress={handleSetPassword}
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
                  <Text style={styles.buttonText}>Criar Senha e Entrar</Text>
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
    width: 120,
    height: 120,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#D4AF37",
    shadowOpacity: 0.35,
    shadowRadius: 25,
    shadowOffset: { width: 0, height: 0 },
    elevation: 15,
    marginBottom: 12,
  },
  logo: {
    width: 110,
    height: 110,
    borderRadius: 22,
  },
  brandName: {
    fontSize: 20,
    fontWeight: "800" as const,
    color: "#D4AF37",
    letterSpacing: 4,
    textAlign: "center",
    marginBottom: 6,
  },
  taglineLine: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 10,
  },
  taglineDash: {
    width: 20,
    height: 1,
    backgroundColor: "#D4AF3766",
  },
  tagline: {
    fontSize: 11,
    color: "#D4AF37AA",
    letterSpacing: 2,
    textTransform: "uppercase" as const,
  },
  divider: {
    height: 1,
    backgroundColor: "#1F293744",
    marginVertical: 20,
    marginHorizontal: 20,
  },
  congratsBox: {
    alignItems: "center" as const,
    marginBottom: 24,
    padding: 16,
    backgroundColor: "#0D132180",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#00C6AE33",
  },
  congratsTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#00C6AE",
    textAlign: "center",
    marginTop: 8,
  },
  congratsText: {
    fontSize: 13,
    color: "#AAA",
    textAlign: "center",
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
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
  hint: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginBottom: 8,
  },
  buttonWrapper: {
    marginTop: 10,
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
    alignItems: "center" as const,
    flexDirection: "row" as const,
    justifyContent: "center" as const,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#000",
  },
  footerSection: {
    alignItems: "center" as const,
    marginTop: 28,
  },
  footerBrand: {
    fontSize: 14,
    fontWeight: "800" as const,
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
    textTransform: "uppercase" as const,
  },
});
