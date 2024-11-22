import React from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";

const ConfirmOrder = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.customerName}>Samiksha Sharma</Text>
        <Text style={styles.customerContact}>+91 7709690475</Text>
      </View>

      <View style={styles.orderDetails}>
        <View style={styles.row}>
          <Text style={styles.label}>Order Total</Text>
          <Text style={styles.value}>₹ 499.60</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Delivery Fee</Text>
          <Text style={styles.value}>FREE</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Transaction Ref</Text>
          <Text style={styles.value}>9812BJk1982BSLA</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Payment Method</Text>
          <Text style={styles.value}>Online Payment</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.completeOrderButton}>
        <Text style={styles.completeOrderText}>Complete Order</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ConfirmOrder;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  customerName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  customerContact: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  orderDetails: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    color: "#555",
  },
  value: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  infoText: {
    fontSize: 14,
    color: "#777",
    marginBottom: 20,
    textAlign: "center",
  },
  completeOrderButton: {
    backgroundColor: "#E53935",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  completeOrderText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});
