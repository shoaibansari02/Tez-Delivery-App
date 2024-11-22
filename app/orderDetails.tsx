import { useRouter } from "expo-router";
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";

const OrderDetails = () => {
  const Router = useRouter();

  const onCheck = () => {
    Router.navigate("/checkItems");
  };
  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}

      <View style={styles.header}>
        <View style={styles.contactInfo}>
          <Text style={styles.name}>Samiksha Sharma</Text>
          <Text style={styles.phone}>+91 7709690475</Text>
          <Text style={styles.address}>
            192, Nandanwan Main Road, Beside Nirmal Bank, Nagpur, 440024
          </Text>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>CALL</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>MAPS</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Order Details Section */}
      <View style={styles.detailsContainer}>
        <Text style={styles.detailItem}>
          <Text style={styles.label}>Order ID:</Text> 19928
        </Text>
        <Text style={styles.detailItem}>
          <Text style={styles.label}>Order Date:</Text> 11/06/22 at 09:22pm
        </Text>
        <Text style={styles.detailItem}>
          <Text style={styles.label}>MRP Total:</Text> ₹ 550.00
        </Text>
        <Text style={styles.detailItem}>
          <Text style={styles.label}>Order Total:</Text> ₹ 499.60
        </Text>
        <Text style={styles.detailItem}>
          <Text style={styles.label}>Delivery Fee:</Text> FREE
        </Text>
        <Text style={styles.detailItem}>
          <Text style={styles.label}>Transaction Ref:</Text> 00000
        </Text>
        <Text style={styles.detailItem}>
          <Text style={styles.label}>Payment Method:</Text> Cash on Delivery
        </Text>
      </View>

      {/* Check Items Button */}
      <TouchableOpacity style={styles.checkItemsButton} onPress={onCheck}>
        <Text style={styles.checkItemsText}>Check items</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#f8f8f8",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  appName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "red",
    marginBottom: 10,
  },
  contactInfo: {
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  phone: {
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
  },
  address: {
    fontSize: 14,
    color: "#777",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    backgroundColor: "#e0e0e0",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  detailsContainer: {
    padding: 20,
    backgroundColor: "#fff",
    marginTop: 15,
    borderRadius: 8,
    elevation: 2, // For subtle shadow on Android
    shadowColor: "#000", // For subtle shadow on iOS
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  detailItem: {
    fontSize: 16,
    marginBottom: 10,
  },
  label: {
    fontWeight: "bold",
  },
  checkItemsButton: {
    backgroundColor: "red",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    marginHorizontal: 10,
  },
  checkItemsText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default OrderDetails;
