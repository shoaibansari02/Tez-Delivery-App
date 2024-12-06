import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ScrollView,
  StatusBar,
} from "react-native";
import {
  MaterialCommunityIcons,
  MaterialIcons,
  Ionicons,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import index from "../index";

export default function Settings() {
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await AsyncStorage.removeItem("userToken");

            await AsyncStorage.removeItem("phoneNumber");
            await AsyncStorage.removeItem("password");

            router.replace(index);
          } catch (error) {
            console.error("Logout Error:", error);
            Alert.alert(
              "Logout Failed",
              "An error occurred while logging out."
            );
          }
        },
      },
    ]);
  };

  const openTermsAndConditions = () => {
    router.push("/terms-and-conditions");
  };

  const openPrivacyPolicy = () => {
    router.push("/privacy-policy");
  };

  const openContact = () => {
    router.push("/contact");
  };

  return (
    <>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account</Text>
            <View style={styles.card}>
              <TouchableOpacity style={styles.menuItem} onPress={openContact}>
                <View style={styles.menuIconContainer}>
                  <MaterialIcons
                    name="contact-support"
                    size={22}
                    color="#2D3436"
                  />
                </View>
                <View style={styles.menuContent}>
                  <Text style={styles.menuText}>Contact Us</Text>
                  <MaterialIcons name="chevron-right" size={24} color="#666" />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Legal</Text>
            <View style={styles.card}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={openTermsAndConditions}
              >
                <View style={styles.menuIconContainer}>
                  <MaterialCommunityIcons
                    name="file-document-outline"
                    size={22}
                    color="#2D3436"
                  />
                </View>
                <View style={styles.menuContent}>
                  <Text style={styles.menuText}>Terms & Conditions</Text>
                  <MaterialIcons name="chevron-right" size={24} color="#666" />
                </View>
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity
                style={styles.menuItem}
                onPress={openPrivacyPolicy}
              >
                <View style={styles.menuIconContainer}>
                  <MaterialCommunityIcons
                    name="shield-check-outline"
                    size={22}
                    color="#2D3436"
                  />
                </View>
                <View style={styles.menuContent}>
                  <Text style={styles.menuText}>Privacy Policy</Text>
                  <MaterialIcons name="chevron-right" size={24} color="#666" />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LinearGradient
              colors={["#FF4B2B", "#FF416C"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.logoutGradient}
            >
              <Ionicons name="log-out-outline" size={24} color="#fff" />
              <Text style={styles.logoutText}>Logout</Text>
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.versionText}>Version 1.0.0</Text>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    height: 120,
    justifyContent: "flex-end",
    padding: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#fff",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2D3436",
    marginBottom: 12,
    marginLeft: 4,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#f8f9fa",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  menuContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  menuText: {
    fontSize: 16,
    color: "#2D3436",
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginHorizontal: 16,
  },
  logoutButton: {
    marginTop: 8,
    marginBottom: 24,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logoutGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  versionText: {
    textAlign: "center",
    color: "#666",
    fontSize: 12,
    marginBottom: 20,
  },
});
