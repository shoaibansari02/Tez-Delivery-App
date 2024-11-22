import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
  Dimensions,
  StatusBar,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function Profile() {
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    profilePhoto: "https://via.placeholder.com/150",
    selectedPincodes: [
      "110001",
      "110002",
      "110003",
      "110004",
      "110005",
      "411037",
      "112244",
      "445566",
      "875554",
      "334466",
    ],
    status: "Active",
    memberSince: "2023",
  };

  return (
    <>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.container}>
        {/* Curved Header with Gradient */}
        <View style={styles.headerContainer}>
          <LinearGradient
            colors={["#2D3436", "#000000"]}
            style={styles.headerGradient}
          >
            <View style={styles.headerContentOverlay}>
              <View style={styles.photoContainer}>
                <View style={styles.photoFrame}>
                  <Image
                    source={{ uri: user.profilePhoto }}
                    style={styles.profilePhoto}
                  />
                  <View style={styles.statusIndicator} />
                </View>
              </View>
              <Text style={styles.userName}>{user.name}</Text>
              <View style={styles.memberBadge}>
                <MaterialCommunityIcons
                  name="shield-check"
                  size={14}
                  color="#FFD700"
                />
                <Text style={styles.memberText}>Verified Member</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Quick Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <MaterialCommunityIcons
                name="map-marker-multiple"
                size={24}
                color="#2D3436"
              />
              <Text style={styles.statNumber}>
                {user.selectedPincodes.length}
              </Text>
              <Text style={styles.statLabel}>Areas</Text>
            </View>
            <View style={styles.statBox}>
              <MaterialCommunityIcons
                name="account-clock"
                size={24}
                color="#2D3436"
              />
              <Text style={styles.statNumber}>{user.memberSince}</Text>
              <Text style={styles.statLabel}>Joined</Text>
            </View>
            <View style={styles.statBox}>
              <MaterialCommunityIcons
                name="check-decagram"
                size={24}
                color="#2D3436"
              />
              <Text style={styles.statNumber}>{user.status}</Text>
              <Text style={styles.statLabel}>Status</Text>
            </View>
          </View>

          {/* Contact Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            <View style={styles.card}>
              <View style={styles.infoRow}>
                <View style={styles.iconContainer}>
                  <Ionicons name="mail" size={20} color="#2D3436" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Email Address</Text>
                  <Text style={styles.infoValue}>{user.email}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Service Areas */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Service Areas</Text>
            <View style={styles.card}>
              <View style={styles.pincodesContainer}>
                {user.selectedPincodes.map((pincode, index) => (
                  <View key={index} style={styles.pincodeChip}>
                    <MaterialCommunityIcons
                      name="map-marker"
                      size={16}
                      color="#2D3436"
                    />
                    <Text style={styles.pincodeText}>{pincode}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Account Status Card */}
          <View style={[styles.card, styles.statusCard]}>
            <LinearGradient
              colors={["#2D3436", "#000000"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.statusGradient}
            >
              <View style={styles.statusContent}>
                <MaterialCommunityIcons
                  name="shield-check"
                  size={30}
                  color="#FFD700"
                />
                <Text style={styles.statusTitle}>Verified Account</Text>
                <Text style={styles.statusSubtitle}>
                  Your account is fully verified and active
                </Text>
              </View>
            </LinearGradient>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingTop: Platform.OS === "ios" ? 30 : StatusBar.currentHeight,
  },
  headerContainer: {
    overflow: "hidden",
    paddingBottom: 5,
  },
  headerGradient: {
    height: 210,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContentOverlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 20,
  },
  photoContainer: {
    marginBottom: 15,
  },
  photoFrame: {
    width: 95,
    height: 95,
    borderRadius: 60,
    padding: 3,
    backgroundColor: "rgba(255,255,255,0.2)",
    position: "relative",
  },
  profilePhoto: {
    width: "100%",
    height: "100%",
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#fff",
  },
  statusIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#4CAF50",
    position: "absolute",
    bottom: 5,
    right: 5,
    borderWidth: 3,
    borderColor: "#fff",
  },
  userName: {
    fontSize: 26,
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
  },
  memberBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  memberText: {
    color: "#FFD700",
    marginLeft: 5,
    fontSize: 6,
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#fff",
    marginHorizontal: 5,
    borderRadius: 15,
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2D3436",
    marginTop: 5,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 3,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2D3436",
    marginBottom: 10,
    marginLeft: 5,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f8f9fa",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    color: "#2D3436",
    fontWeight: "500",
  },
  pincodesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  pincodeChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  pincodeText: {
    color: "#2D3436",
    fontSize: 14,
    marginLeft: 4,
    fontWeight: "500",
  },
  statusCard: {
    padding: 0,
    overflow: "hidden",
  },
  statusGradient: {
    borderRadius: 15,
  },
  statusContent: {
    padding: 20,
    alignItems: "center",
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 10,
  },
  statusSubtitle: {
    fontSize: 13,
    color: "#fff",
    opacity: 0.8,
    marginTop: 5,
    textAlign: "center",
  },
});