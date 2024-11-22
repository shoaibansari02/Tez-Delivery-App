import { useRouter } from "expo-router";
import React from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import CustomStatusBar from "../components/StatusBar";

export default function index() {
  const router = useRouter();
  const onLogin = () => {
    router.replace("/(tabs)/home");
  };
  return (
    <SafeAreaView style={styles.container}>
      <CustomStatusBar />
      <View style={styles.loginContainer}>
        <View style={styles.logoContainer}>
          <View style={styles.logoBackground}>
            <Text style={styles.logoText}>tez</Text>
            <Text style={styles.logoSubText}>partner</Text>
          </View>
        </View>
        <View style={styles.inputContainer}>
          {/* Phone number field with +91 prefix */}
          <View style={styles.inputRow}>
            <Text style={styles.inputPrefix}>+91</Text>
            <TextInput
              style={styles.input}
              placeholder="your phone number"
              keyboardType="numeric"
              placeholderTextColor="#aaa"
            />
          </View>
          {/* Password field */}
          <TextInput
            style={styles.passwordInput}
            placeholder="your password"
            secureTextEntry={true}
            placeholderTextColor="#aaa"
          />
        </View>
        {/* Login button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onLogin}
          style={styles.loginButton}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: Platform.OS === "ios" ? 30 : StatusBar.currentHeight,
  },
  loginContainer: {
    flex: 1,
    width: "90%",
    padding: 20,
    alignSelf: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logoBackground: {
    backgroundColor: "#D62F2F",
    borderRadius: 30,
    padding: 15,
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
  },
  logoSubText: {
    color: "#fff",
    fontSize: 14,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  inputPrefix: {
    fontSize: 16,
    color: "#000",
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderRightWidth: 1,
    borderRightColor: "#ccc",
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  passwordInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 10,
  },
  loginButton: {
    backgroundColor: "#D62F2F",
    borderRadius: 8,
    paddingVertical: 14,
  },
  loginButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
});
