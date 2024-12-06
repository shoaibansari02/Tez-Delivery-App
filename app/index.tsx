import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  SafeAreaView,
  Platform,
  Alert,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomStatusBar from "../components/StatusBar";

export default function LoginPage() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");

      if (token) {
        const response = await axios.post(
          "https://tezapi.demogames.cloud/api/v2/deliveryBoy/verify-token",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.status) {
          router.replace("/(tabs)/home");
          return;
        }
      }
    } catch (error) {
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("userDetails");
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const validatePhoneNumber = (number) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(number);
  };

  const onLogin = async () => {
    if (!phoneNumber.trim() || !password.trim()) {
      Alert.alert("Error", "Please enter both phone number and password");
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      Alert.alert(
        "Invalid Phone Number",
        "Please enter a valid 10-digit Indian mobile number"
      );
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        "Weak Password",
        "Password must be at least 6 characters long"
      );
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        "https://tezapi.demogames.cloud/api/v2/deliveryBoy/login",
        {
          number: phoneNumber,
          password: password,
        }
      );

      if (response.data.status) {
        await AsyncStorage.setItem("userToken", response.data.token);

        if (response.data.user) {
          await AsyncStorage.setItem(
            "userDetails",
            JSON.stringify(response.data.user)
          );
        }

        router.replace("/(tabs)/home");
      } else {
        Alert.alert("Login Failed", response.data.message || "Unable to login");
      }
    } catch (error) {
      console.error("Login Error:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Network error. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#D62F2F" />
        <Text style={styles.loadingText}>Checking authentication...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
              <View style={styles.inputRow}>
                <Text style={styles.inputPrefix}>+91</Text>
                <TextInput
                  style={styles.input}
                  placeholder="your phone number"
                  keyboardType="numeric"
                  placeholderTextColor="#aaa"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  maxLength={10}
                />
              </View>

              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  placeholder="your password"
                  secureTextEntry={!showPassword}
                  placeholderTextColor="#aaa"
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.showPasswordButton}
                >
                  <Text style={styles.showPasswordText}>
                    {showPassword ? "Hide" : "Show"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onLogin}
              style={[
                styles.loginButton,
                isLoading && styles.loginButtonDisabled,
              ]}
              disabled={isLoading}
            >
              <Text style={styles.loginButtonText}>
                {isLoading ? "Logging in..." : "Login"}
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loginContainer: {
    flex: 1,
    width: "90%",
    padding: 20,
    alignSelf: "center",
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
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
  showPasswordButton: {
    paddingHorizontal: 10,
  },
  showPasswordText: {
    color: "#666",
  },
  forgotPasswordContainer: {
    alignSelf: "flex-end",
    marginBottom: 10,
  },
  forgotPasswordText: {
    color: "#D62F2F",
    fontWeight: "500",
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
  loginButtonDisabled: {
    opacity: 0.5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 10,
    color: "#D62F2F",
    fontSize: 16,
  },
});
