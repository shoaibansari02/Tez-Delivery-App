import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomStatusBar from "../../components/StatusBar";

interface Order {
  order_id: number;
  customer_name: string;
}

const Home = () => {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setError(null);
      setIsLoading(true);
      setIsRefreshing(true);

      // Ensure token exists before making the request
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        router.replace("/");
        return;
      }

      const response = await axios.get(
        "https://tezapi.demogames.cloud/api/v2/deliveryBoy/AllOrders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 10000, // 10 seconds timeout
        }
      );

      // Robust data extraction
      const fetchedOrders = Array.isArray(response.data)
        ? response.data
        : response.data.orders || response.data.data || [];

      const validOrders = fetchedOrders.filter(
        (order: any) => order.order_id && order.customer_name
      );

      setOrders(validOrders);
    } catch (error: any) {
      console.error("Error fetching orders:", error);

      // Improved error handling
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          await AsyncStorage.removeItem("userToken");
          router.replace("/");
          return;
        }

        // More specific error messages
        if (error.code === "ECONNABORTED") {
          setError("Request timed out. Please check your internet connection.");
        } else {
          setError(
            error.response?.data?.message ||
              "Unable to fetch orders. Please try again."
          );
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }

      // Show error alert
      Alert.alert("Error", error.message || "Unable to fetch orders");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const onRefresh = useCallback(() => {
    fetchOrders();
  }, []);

  const onDetails = (orderId: number) => {
    router.navigate(`/orderDetails?orderId=${orderId}`);
  };

  const renderOrderItem = ({ item }: { item: Order }) => (
    <TouchableOpacity
      style={styles.orderItem}
      onPress={() => onDetails(item.order_id)}
    >
      <View style={styles.orderTextContainer}>
        <Text style={styles.customerName}>{item.customer_name}</Text>
        <Text style={styles.orderNumber}>Order Number: {item.order_id}</Text>
      </View>
    </TouchableOpacity>
  );

  // Render loading state
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <CustomStatusBar />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>Loading orders...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Render error state
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <CustomStatusBar />
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={onRefresh} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Render empty state
  if (orders.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <CustomStatusBar />
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No orders available</Text>
          <TouchableOpacity onPress={onRefresh} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Main render with FlatList
  return (
    <SafeAreaView style={styles.container}>
      <CustomStatusBar />
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.order_id.toString()}
        refreshing={isRefreshing}
        onRefresh={onRefresh}
        contentContainerStyle={styles.content}
        ListEmptyComponent={() => (
          <View style={styles.centerContainer}>
            <Text style={styles.emptyText}>No orders available</Text>
          </View>
        )}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={21}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  content: {
    paddingBottom: 16,
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    marginBottom: 15,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  retryButtonText: {
    color: "white",
    textAlign: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  orderItem: {
    backgroundColor: "#fff",
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  orderTextContainer: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  orderNumber: {
    fontSize: 14,
    color: "#666",
  },
});

export default Home;
