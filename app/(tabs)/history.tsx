import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import { ChevronRightIcon, ClockIcon } from "react-native-heroicons/outline";
import CustomStatusBar from "../../components/StatusBar";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function History() {
  const router = useRouter();
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrderHistory();
  }, []);

  const fetchOrderHistory = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get(
        "https://tezapi.demogames.cloud/api/v2/deliveryBoy/OrderHistory",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const transformedOrderHistory = response.data.map((order) => ({
        id: order.order_id.toString(),
        orderNumber: order.order_id.toString(),
        customerName: order.customer_name,
        date: new Date(order.updated_at).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        time: new Date(order.updated_at).toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
        status: order.status.charAt(0).toUpperCase() + order.status.slice(1),
        amount: `₹${order.total}`,
        items: order.order_items,
      }));

      setOrderHistory(transformedOrderHistory);
      setLoading(false);
      setRefreshing(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      setRefreshing(false);
      Alert.alert("Error", "Failed to fetch order history");
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrderHistory();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "#4CAF50";
      case "Cancelled":
        return "#F44336";
      default:
        return "#FFA500";
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <CustomStatusBar />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2D3436" />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <CustomStatusBar />
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>Failed to load order history</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <CustomStatusBar />

      {/* Order List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={
          orderHistory.length === 0 ? styles.emptyContainer : null
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#2D3436"]}
            tintColor="#2D3436"
          />
        }
      >
        {orderHistory.length === 0 ? (
          <Text style={styles.emptyText}>No order history found</Text>
        ) : (
          orderHistory.map((order) => (
            <TouchableOpacity key={order.id} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <View style={styles.orderNumberContainer}>
                  <Text style={styles.orderNumberLabel}>Order #</Text>
                  <Text style={styles.orderNumber}>{order.orderNumber}</Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(order.status) + "20" },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      { color: getStatusColor(order.status) },
                    ]}
                  >
                    {order.status}
                  </Text>
                </View>
              </View>

              <View style={styles.customerInfo}>
                <Text style={styles.customerName}>{order.customerName}</Text>
                <View style={styles.timeContainer}>
                  <ClockIcon size={16} color="#666" />
                  <Text style={styles.timeText}>
                    {order.date} • {order.time}
                  </Text>
                </View>
              </View>

              <View style={styles.orderFooter}>
                <View style={styles.orderDetails}>
                  <Text style={styles.itemCount}>{order.items} items</Text>
                  <Text style={styles.amount}>{order.amount}</Text>
                </View>
                <ChevronRightIcon size={20} color="#666" />
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },

  scrollView: {
    flex: 1,
    padding: 16,
  },
  orderCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  orderNumberContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  orderNumberLabel: {
    fontSize: 14,
    color: "#666",
  },
  orderNumber: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginLeft: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  customerInfo: {
    marginBottom: 12,
  },
  customerName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeText: {
    fontSize: 13,
    color: "#666",
    marginLeft: 4,
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  orderDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemCount: {
    fontSize: 14,
    color: "#666",
    marginRight: 12,
  },
  amount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#F44336",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
});
