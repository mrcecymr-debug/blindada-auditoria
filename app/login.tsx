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
import { supabase } from "@/lib/supabase";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [secure, setSecure] = useState(true);

  const handleLogin = async () => {
    if (!email || !password) return;

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert("Email ou senha incorretos.");
    }
  };

  return (
    <LinearGradient
      colors={["#0B0F18", "#0E1422", "#0B0F18"]}
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
          {/* LOGO */}
          <Image
            source={require("@/assets/images/logo-casa-blindada.jpg")}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.title}>Bem-vindo</Text>
          <Text style={styles.subtitle}>
            Acesse sua conta para continuar
          </Text>

          {/* EMAIL */}
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={18} color="#D4AF37" />
            <TextInput
              placeholder="Seu e-mail"
              placeholderTextColor="#888"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          {/* SENHA */}
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={18} color="#D4AF37" />
            <TextInput
              placeholder="Sua senha"
              placeholderTextColor="#888"
              style={styles.input}
              secureTextEntry={secure}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setSecure(!secure)}>
              <Ionicons
                name={secure ? "eye-outline" : "eye-off-outline"}
                size={18}
                color="#888"
              />
            </TouchableOpacity>
          </View>

          {/* BOTÃO */}
          <TouchableOpacity
            style={styles.buttonWrapper}
            onPress={handleLogin}
            activeOpacity={0.85}
            disabled={loading}
          >
            <LinearGradient
              colors={["#F7B500", "#D4AF37"]}
              style={styles.button}
            >
              {loading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text style={styles.buttonText}>Entrar</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
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
    paddingHorizontal: 30,
  },
  logo: {
    width: 110,
    height: 110,
    alignSelf: "center",
    marginBottom: 30,
    borderRadius: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#AAAAAA",
    textAlign: "center",
    marginBottom: 35,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#141A2A",
    borderRadius: 14,
    paddingHorizontal: 15,
    paddingVertical: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#1F2937",
  },
  input: {
    flex: 1,
    marginLeft: 10,
    color: "#FFFFFF",
    fontSize: 14,
  },
  buttonWrapper: {
    marginTop: 10,
    borderRadius: 16,
    shadowColor: "#F7B500",
    shadowOpacity: 0.6,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 5 },
    elevation: 10,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },
});
