import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";

interface OrderDetails {
  order_id: number;
  total: number;
  customer_name: string;
  customer_phone_number: string;
  payment_method: string;
  transaction_id: string;
}

export default function ConfirmOrder() {
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const router = useRouter();
  const { orderId } = useLocalSearchParams();

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(
        `https://tezapi.demogames.cloud/api/v2/deliveryBoy/completeOrder/${orderId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch order details");
      }

      const data = await response.json();
      setOrderDetails(data);
    } catch (error) {
      console.error("Error fetching order details:", error);
      Alert.alert("Error", "Could not fetch order details");
    }
  };

  const handleCompleteOrder = async () => {
    // Show confirmation alert before completing the order
    Alert.alert(
      "Confirm Order Completion",
      "Are you sure you want to complete this order?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("userToken");
              const response = await fetch(
                `https://tezapi.demogames.cloud/api/v2/deliveryBoy/completeOrder/${orderId}`,
                {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                  },
                }
              );

              if (!response.ok) {
                throw new Error("Failed to complete order");
              }

              Alert.alert("Success", "Order completed successfully", [
                { text: "OK", onPress: () => router.push("/home") },
              ]);
            } catch (error) {
              console.error("Error completing order:", error);
              Alert.alert("Error", "Could not complete order");
            }
          },
        },
      ]
    );
  };

  if (!orderDetails) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading order details...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.customerName}>{orderDetails.customer_name}</Text>
        <Text style={styles.customerContact}>
          {orderDetails.customer_phone_number}
        </Text>
      </View>

      <View style={styles.orderDetails}>
        <View style={styles.row}>
          <Text style={styles.label}>Order Total</Text>
          <Text style={styles.value}>₹ {orderDetails.total}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Payment Method</Text>
          <Text style={styles.value}>{orderDetails.payment_method}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Transaction ID</Text>
          <Text style={styles.value}>{orderDetails.transaction_id}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Order ID</Text>
          <Text style={styles.value}>{orderDetails.order_id}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.completeOrderButton}
        onPress={handleCompleteOrder}
      >
        <Text style={styles.completeOrderText}>Complete Order</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  loadingText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
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
